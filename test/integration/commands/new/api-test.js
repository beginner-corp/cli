let test = require('tape')
let { existsSync } = require('fs')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, getInv, newFolder, run } = require(lib)

test('Run new tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[New / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let pathNotFound = /API path not found/
  let pathInvalid = /Invalid API path/
  let duplicateApi = /API already exists/
  let newAppDir = 'new-api'

  t.test(`${mode} new api`, async t => {
    t.plan(8)
    let i, r
    let cwd = newFolder(newAppDir)
    await begin('new project -p .', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 2, 'Project has a single Lambda')

    r = await begin('new api -p test', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 2, 'Project still has one Lambda')
    t.ok(existsSync(join(cwd, './app/api/test.mjs')), 'Wrote API handler')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new api (errors)`, async t => {
    t.plan(12)
    let r
    let cwd = newFolder(newAppDir)
    await begin('new project -p .', cwd)

    r = await begin('new api', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing path')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new api -p', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new api -p 1', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new project -p .', cwd)
    await begin(`new api -p foo`, cwd, true)
    r = await begin(`new api -p foo`, cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, duplicateApi, 'Errored on duplicate api')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} new api (JSON)`, async t => {
    t.plan(8)
    let i, json, r
    let cwd = newFolder(newAppDir)
    await begin('new project -p .', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 2, 'Project has a single Lambda')

    r = await begin('new api -p test --json', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 2, 'Project still has one Lambda')
    t.ok(existsSync(join(cwd, './app/api/test.mjs')), 'Wrote API handler')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new api (errors / JSON)`, async t => {
    t.plan(16)
    let json, r
    let cwd = newFolder(newAppDir)
    await begin('new project -p .', cwd)

    r = await begin('new api --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new api -p --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new api -p 1 --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathInvalid, 'Errored on invalid path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new project -p . --json', cwd)
    await begin(`new api -p foo --json`, cwd, true)
    r = await begin(`new api -p foo --json`, cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, duplicateApi, 'Errored on duplicate api')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
