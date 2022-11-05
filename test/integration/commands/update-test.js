let test = require('tape')
let { constants: fsConstants, existsSync } = require('fs')
let { access, readFile } = require('fs/promises')
let { join } = require('path')
let sandbox = require('@architect/sandbox')
let cwd = process.cwd()
let lib = join(cwd, 'test', 'lib')
let mock = join(cwd, 'test', 'mock')
let { begin: _begin, newFolder, run } = require(lib)
let filePath = folder => join(folder, 'hi.txt')

test('Run update tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Update / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let upgraded = 'Successfully upgraded Begin!'
  let x64Release = /file-x64.zip/
  let arm64Release = /file-arm64.zip/
  let upgradeVer = /10000\.0\.0/
  let didNotUpgrade = 'Begin already running the latest version, nice!'
  let contents = 'henlo!\n'
  let failed = /Failed to check latest version/

  t.test(`${mode} Start Sandbox`, async t => {
    t.plan(1)
    await sandbox.start({ cwd: mock, quiet: true })
    t.pass('Started Sandbox')
  })

  t.test(`${mode} Normal (x64)`, async t => {
    t.plan(9)
    let file, folder, path, r

    folder = newFolder('install')
    path = filePath(folder)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-upgrade'
    r = await begin('update')
    if (!existsSync(path)) t.fail(`Did not find unzipped / installed file at ${path}`)
    file = await readFile(path)
    await isExecutable(t, path)
    t.equal(file.toString(), contents, 'File unzipped into correct location')
    t.equal(r.stdout, upgraded, 'Got upgrade confirmation')
    t.match(r.stderr, x64Release, 'Printed x64 release to stderr')
    t.match(r.stderr, upgradeVer, 'Printed upgrade version to stderr')
    t.ok(r.stderr.includes(path), 'Printed destination filepath to stderr')
    t.equal(r.code, 0, 'Exited 0')

    folder = newFolder('install')
    path = filePath(folder)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-ok'
    r = await begin('update')
    if (existsSync(path)) t.fail(`Found unzipped / installed file at ${path}`)
    t.equal(r.stdout, didNotUpgrade, `Got confirmation that upgrade wasn't necessary`)
    t.ok(r.stderr, 'Printed update info stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  // arm64-specific tests (which means macOS only for now)
  if (process.platform === 'darwin') {
    t.test(`${mode} Normal (arm64)`, async t => {
      t.plan(9)
      let file, folder, path, r

      folder = newFolder('install')
      path = filePath(folder)
      process.env.BEGIN_INSTALL = folder
      process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-upgrade'
      process.env.__BEGIN_TEST_ARCH__ = 'arm64'
      r = await begin('update')
      if (!existsSync(path)) t.fail(`Did not find unzipped / installed file at ${path}`)
      file = await readFile(path)
      await isExecutable(t, path)
      t.equal(file.toString(), contents, 'File unzipped into correct location')
      t.equal(r.stdout, upgraded, 'Got upgrade confirmation')
      t.match(r.stderr, arm64Release, 'Printed arm64 release to stderr')
      t.match(r.stderr, upgradeVer, 'Printed upgrade version to stderr')
      t.ok(r.stderr.includes(path), 'Printed destination filepath to stderr')
      t.equal(r.code, 0, 'Exited 0')

      folder = newFolder('install')
      path = filePath(folder)
      process.env.BEGIN_INSTALL = folder
      process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-ok'
      r = await begin('update')
      if (existsSync(path)) t.fail(`Found unzipped / installed file at ${path}`)
      t.equal(r.stdout, didNotUpgrade, `Got confirmation that upgrade wasn't necessary`)
      t.ok(r.stderr, 'Printed update info stderr')
      t.equal(r.code, 0, 'Exited 0')
    })
  }

  t.test(`${mode} Errors`, async t => {
    t.plan(3)
    let folder, path, r

    folder = newFolder('install')
    path = filePath(folder)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/lolidk'
    r = await begin('update')
    if (existsSync(path)) t.fail(`Found unzipped / installed file at ${path}`)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.ok(r.stderr, 'Printed error to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} JSON`, async t => {
    t.plan(10)
    let file, folder, json, path, r

    folder = newFolder('install')
    path = filePath(folder)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-upgrade'
    r = await begin('update --json')
    if (!existsSync(path)) t.fail(`Did not find unzipped / installed file at ${path}`)
    file = await readFile(path)
    json = JSON.parse(r.stdout)
    await isExecutable(t, path)
    t.equal(file.toString(), contents, 'File unzipped into correct location')
    t.equal(json.ok, true, 'Got ok: true for upgrade confirmation')
    t.ok(json.message, 'Got message for upgrade confirmation')
    t.match(r.stderr, upgradeVer, 'Printed upgrade version to stderr')
    t.ok(r.stderr.includes(path), 'Printed destination filepath to stderr')
    t.equal(r.code, 0, 'Exited 0')

    folder = newFolder('install')
    path = filePath(folder)
    process.env.BEGIN_INSTALL = folder
    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-ok'
    r = await begin('update --json')
    if (existsSync(path)) t.fail(`Found unzipped / installed file at ${path}`)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true for upgrade confirmation')
    t.ok(json.message, 'Got message for upgrade confirmation')
    t.ok(r.stderr, 'Printed update info stderr')
    t.equal(r.code, 0, 'Exited 0')

    // TODO test --use flag
  })

  t.test(`${mode} Errors (JSON)`, async t => {
    t.plan(4)
    let json, r

    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/lolidk'
    r = await begin('update --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, failed, 'Errored on upgrade')
    t.ok(r.stderr, 'Printed update info stderr')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} Shut down sandbox`, async t => {
    t.plan(1)
    await sandbox.end()
    process.exitCode = 0
    delete process.env.BEGIN_INSTALL
    delete process.env.__BEGIN_TEST_URL__
    delete process.env.__BEGIN_TEST_ARCH__
    t.pass('Shut down Sandbox')
  })
}

// Confirm the file written to the filesystem is chmod +x
async function isExecutable (t, filePath) {
  if (!process.platform.startsWith('win')) {
    try {
      await access(filePath, fsConstants.X_OK)
    }
    catch (err) {
      t.fail(`File is not executable: ${filePath}`)
    }
  }
}
