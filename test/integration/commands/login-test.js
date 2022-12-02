let test = require('tape')
let { existsSync } = require('fs')
let { readFile } = require('fs/promises')
let { join } = require('path')
let cwd = process.cwd()
let lib = join(cwd, 'test', 'lib')
let mock = join(cwd, 'test', 'mock')
let { begin: _begin, newTmpFolder, run, start, shutdown } = require(lib)
let filePath = folder => join(folder, 'config.json')

test('Run login tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Login / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let loginDir = 'login'
  let loggedIn = 'Successfully logged in!'
  let alreadyLoggedIn = 'You are already logged in, yay!'
  let port, pleaseAuth

  t.test(`${mode} Start dev server`, async t => {
    port = await start[runType](t, mock)
    pleaseAuth = `Please authenticate by visiting: http://localhost:${port}/auth?user_code=bar?user_code=bar\nAwaiting authentication...`
  })

  t.test(`${mode} Normal`, async t => {
    t.plan(11)
    let file, folder, path, r

    folder = newTmpFolder(t, loginDir)
    path = filePath(folder)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = `http://localhost:${port}`
    r = await begin('login')
    if (!existsSync(path)) t.fail(`Did not find config.json at ${path}`)
    file = JSON.parse(await readFile(path))
    t.ok(file['// Begin config'], 'Got Begin config file comment')
    t.ok(file.created, 'Got config.created property')
    t.ok(file.createdVer, 'Got config.createdVer property')
    t.ok(file.modified, 'Got config.modified property')
    t.equal(file.access_token, 'lolidk', 'Got correct config.access_token property')
    t.equal(file.device_code, 'foo', 'Got correct config.device_code property')
    t.equal(r.stdout, loggedIn, 'Got login confirmation')
    t.equal(r.stderr, pleaseAuth, 'Printed auth URL to stderr')
    t.equal(r.code, 0, 'Exited 0')

    // Re-login
    r = await begin('login')
    t.equal(r.stdout, alreadyLoggedIn, 'Got already logged in confirmation')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} JSON`, async t => {
    t.plan(13)
    let file, folder, json, path, r

    folder = newTmpFolder(t, loginDir)
    path = filePath(folder)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = `http://localhost:${port}`
    r = await begin('login --json')
    json = JSON.parse(r.stdout)
    if (!existsSync(path)) t.fail(`Did not find config.json at ${path}`)
    file = JSON.parse(await readFile(path))
    t.ok(file['// Begin config'], 'Got Begin config file comment')
    t.ok(file.created, 'Got config.created property')
    t.ok(file.createdVer, 'Got config.createdVer property')
    t.ok(file.modified, 'Got config.modified property')
    t.equal(file.access_token, 'lolidk', 'Got correct config.access_token property')
    t.equal(file.device_code, 'foo', 'Got correct config.device_code property')
    t.equal(json.ok, true, 'Got ok: true for login confirmation')
    t.equal(json.message, loggedIn, 'Got login confirmation')
    t.equal(r.stderr, pleaseAuth, 'Printed auth URL to stderr')
    t.equal(r.code, 0, 'Exited 0')

    // Re-login
    r = await begin('login --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true for login confirmation')
    t.equal(json.message, alreadyLoggedIn, 'Got already logged in confirmation')
    t.equal(r.code, 0, 'Exited 0')
  })

  /**
   * TODO write (errors) tests where:
   * - Login stops midway through and updates existing device_code
   * - /devicecode endpoint doesn't respond
   * - /devicecode endpoint doesn't send back all required properties
   * - /token endpoint doesn't send an access_token
   */

  t.test(`${mode} Shut down dev server`, t => {
    shutdown(t)
    process.exitCode = 0
    delete process.env.BEGIN_INSTALL
    delete process.env.__BEGIN_TEST_URL__
  })
}
