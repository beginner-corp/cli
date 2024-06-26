let { existsSync, mkdirSync, writeFileSync } = require('node:fs')
let { readFile } = require('node:fs/promises')
let { join } = require('node:path')
let test = require('tape')
let { begin: _begin, newTmpFolder, start, shutdown } = require('../../lib')

let cwd = process.cwd()
let mock = join(cwd, 'test', 'mock')

let filePath = folder => join(folder, 'config.json')

test('Run logout tests', async t => {
  let mode = `[Logout]`
  let begin = _begin.bind({}, t)

  let logoutDir = 'logout'
  let loggedOut = 'Successfully logged out!'
  let alreadyLoggedOut = 'Cannot log out without a valid access token'
  let port

  let config = JSON.stringify({
    access_token: 'foo',
    device_code: 'bar',
  }, null, 2)

  t.test(`${mode} Start dev server`, async t => {
    port = await start(t, mock)
  })

  t.test(`${mode} Normal`, async t => {
    t.plan(6)
    let file, folder, path, r

    folder = newTmpFolder(t, logoutDir)
    mkdirSync(folder, { recursive: true })
    path = filePath(folder)
    writeFileSync(path, config)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = `http://localhost:${port}`
    r = await begin('logout')
    if (!existsSync(path)) t.fail(`Did not find config.json at ${path}`)
    file = JSON.parse((await readFile(path)).toString())
    t.notOk(file.access_token, 'config.access_token property no longer found')
    t.notOk(file.device_code, 'config.device_code property no longer found')
    t.equal(r.stdout, loggedOut, 'Got logout confirmation')
    t.equal(r.code, 0, 'Exited 0')

    // Re-logout
    r = await begin('logout')
    t.equal(r.stderr, 'Error: ' + alreadyLoggedOut, 'Got already logged out error')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} JSON`, async t => {
    t.plan(8)
    let file, folder, json, path, r

    folder = newTmpFolder(t, logoutDir)
    mkdirSync(folder, { recursive: true })
    path = filePath(folder)
    writeFileSync(path, config)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = `http://localhost:${port}`
    r = await begin('logout --json')
    json = JSON.parse(r.stdout)
    if (!existsSync(path)) t.fail(`Did not find config.json at ${path}`)
    file = JSON.parse((await readFile(path)).toString())
    t.notOk(file.access_token, 'config.access_token property no longer found')
    t.notOk(file.device_code, 'config.device_code property no longer found')
    t.equal(json.ok, true, 'Got ok: true for logout confirmation')
    t.equal(json.message, loggedOut, 'Got logout confirmation')
    t.equal(r.code, 0, 'Exited 0')

    // Re-logout
    r = await begin('logout --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false for logout error')
    t.equal(json.error, alreadyLoggedOut, 'Got already logged out error')
    t.equal(r.code, 1, 'Exited 1')
  })

  // /**
  //  * TODO write (errors) tests where:
  //  * - Invalid client ID
  //  * - Invalid token
  //  * - API returns invalid/expired token error
  //  */

  t.test(`${mode} Shut down dev server`, t => {
    shutdown(t)
    process.exitCode = 0
    delete process.env.BEGIN_INSTALL
    delete process.env.__BEGIN_TEST_URL__
  })
  t.end()
})

