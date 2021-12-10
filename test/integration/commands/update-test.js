let test = require('tape')
let { constants: fsConstants, existsSync } = require('fs')
let { access, readFile } = require('fs/promises')
let { join } = require('path')
let sandbox = require('@architect/sandbox')
let cwd = process.cwd()
let lib = join(cwd, 'test', 'lib')
let mock = join(cwd, 'test', 'mock')
let { begin: _begin, run, tmp } = require(lib)
let install = join(tmp, 'install')
let filePath = join(install, 'hi.txt')

test('Run update tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Update / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let upgraded = 'Successfully upgraded Begin!'
  let upgradeVer = /10000\.0\.0/
  let didNotUpgrade = 'Begin already running the latest version, nice!'
  let contents = 'henlo!\n'

  t.test(`${mode} Start Sandbox`, async t => {
    t.plan(1)
    await sandbox.start({ cwd: mock, quiet: true })
    process.env.BEGIN_INSTALL = install
    t.pass('Started Sandbox')
  })

  t.test(`${mode} Normal`, async t => {
    t.plan(11)
    let r, file

    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-upgrade'
    r = await begin('update')
    if (!existsSync(filePath)) t.fail(`Did not find unzipped / installed file at ${filePath}`)
    file = await readFile(filePath)
    await isExecutable(t, filePath)
    t.equal(file.toString(), contents, 'File unzipped into correct location')
    t.equal(r.stdout, upgraded, 'Got upgrade confirmation')
    t.match(r.stderr, upgradeVer, 'Printed upgrade version to stderr')
    t.ok(r.stderr.includes(filePath), 'Printed destination filepath to stderr')
    t.equal(r.status, 0, 'Exited 0')

    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-ok'
    r = await begin('update')
    if (existsSync(filePath)) t.fail(`Found unzipped / installed file at ${filePath}`)
    t.equal(r.stdout, didNotUpgrade, `Got confirmation that upgrade wasn't necessary`)
    t.ok(r.stderr, 'Printed update info stderr')
    t.equal(r.status, 0, 'Exited 0')

    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/lolidk'
    r = await begin('update')
    if (existsSync(filePath)) t.fail(`Found unzipped / installed file at ${filePath}`)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.ok(r.stderr, 'Printed error to stderr')
    t.equal(r.status, 1, 'Exited 1')
  })

  t.test(`${mode} JSON`, async t => {
    t.plan(8)
    let r, file, json

    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-upgrade'
    r = await begin('update --json')
    if (!existsSync(filePath)) t.fail(`Did not find unzipped / installed file at ${filePath}`)
    file = await readFile(filePath)
    json = JSON.parse(r.stdout)
    await isExecutable(t, filePath)
    t.equal(file.toString(), contents, 'File unzipped into correct location')
    t.equal(json.ok, true, 'Got { ok: true } for upgrade confirmation')
    t.match(r.stderr, upgradeVer, 'Printed upgrade version to stderr')
    t.ok(r.stderr.includes(filePath), 'Printed destination filepath to stderr')
    t.equal(r.status, 0, 'Exited 0')

    process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/versions-ok'
    r = await begin('update --json')
    if (existsSync(filePath)) t.fail(`Found unzipped / installed file at ${filePath}`)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got { ok: true } for upgrade confirmation')
    t.ok(r.stderr, 'Printed update info stderr')
    t.equal(r.status, 0, 'Exited 0')

    // TODO fix/test error state; currently stderr stream is polluted by !json output in update
    // process.env.__BEGIN_TEST_URL__ = 'http://localhost:3333/lolidk'
  })

  t.test(`${mode} Shut down sandbox`, async t => {
    t.plan(1)
    await sandbox.end()
    process.exitCode = 0
    delete process.env.BEGIN_INSTALL
    delete process.env.__BEGIN_TEST_URL__
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
