let test = require('tape')
let { existsSync, mkdirSync, rmSync, writeFileSync } = require('fs')
let { readFile } = require('fs/promises')
let { join } = require('path')
let sandbox = require('@architect/sandbox')
let cwd = process.cwd()
let lib = join(cwd, 'test', 'lib')
let mock = join(cwd, 'test', 'mock')
let { begin: _begin, newFolder, run } = require(lib)
let filePath = folder => join(folder, 'config.json')
let reset = folder => rmSync(folder, { recursive: true, force: true })

test('Run logout tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Logout / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let loggedOut = 'Successfully logged out!'
  let alreadyLoggedOut = 'Cannot log out without a valid access token'

  let config = JSON.stringify({
    access_token: 'foo',
    device_code: 'bar',
  }, null, 2)

  t.test(`${mode} Start Sandbox`, async t => {
    t.plan(1)
    await sandbox.start({ cwd: mock, quiet: true })

    t.pass('Started Sandbox')
  })

  t.test(`${mode} Normal`, async t => {
    t.plan(6)
    let file, folder, path, r

    folder = newFolder('logout')
    // Safe to assume this folder exists, as it's where Begin is running
    mkdirSync(folder, { recursive: true })

    path = filePath(folder)
    writeFileSync(path, config)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST__ = true
    r = await begin('logout', undefined, true)
    if (!existsSync(path)) t.fail(`Did not find config.json at ${path}`)
    file = JSON.parse(await readFile(path))
    t.notOk(file.access_token, 'config.access_token property no longer found')
    t.notOk(file.device_code, 'config.device_code property no longer found')
    t.equal(r.stdout, loggedOut, 'Got logout confirmation')
    t.equal(r.code, 0, 'Exited 0')

    // Re-logout
    r = await begin('logout', undefined, true)
    t.equal(r.stderr, 'Error: ' + alreadyLoggedOut, 'Got already logged out error')
    t.equal(r.code, 1, 'Exited 1')
    reset(folder)
  })

  t.test(`${mode} JSON`, async t => {
    t.plan(8)
    let file, folder, json, path, r

    folder = newFolder('logout')
    // Safe to assume this folder exists, as it's where Begin is running
    mkdirSync(folder, { recursive: true })

    path = filePath(folder)
    writeFileSync(path, config)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST__ = true
    r = await begin('logout --json', undefined, true)
    json = JSON.parse(r.stdout)
    if (!existsSync(path)) t.fail(`Did not find config.json at ${path}`)
    file = JSON.parse(await readFile(path))
    t.notOk(file.access_token, 'config.access_token property no longer found')
    t.notOk(file.device_code, 'config.device_code property no longer found')
    t.equal(json.ok, true, 'Got ok: true for logout confirmation')
    t.equal(json.message, loggedOut, 'Got logout confirmation')
    t.equal(r.code, 0, 'Exited 0')

    // Re-logout
    r = await begin('logout --json', undefined, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false for logout error')
    t.equal(json.error, alreadyLoggedOut, 'Got already logged out error')
    t.equal(r.code, 1, 'Exited 1')
    reset(folder)
  })

  // /**
  //  * TODO write (errors) tests where:
  //  * - Invalid client ID
  //  * - Invalid token
  //  * - API returns invalid/expired token error
  //  */

  t.test(`${mode} Shut down sandbox`, async t => {
    t.plan(1)
    await sandbox.end()
    process.exitCode = 0
    delete process.env.BEGIN_INSTALL
    delete process.env.__BEGIN_TEST_URL__
    t.pass('Shut down Sandbox')
  })
}
