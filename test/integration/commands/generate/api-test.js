let test = require('tape')
let { existsSync } = require('fs')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, defaultNumberOfLambdas, getInv, newTmpFolder, run } = require(lib)

test('Run generate tests (API)', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Generate / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let pathNotFound = /API path not found/
  let pathInvalid = /Invalid API path/
  let duplicateApi = /API already exists/
  let newAppDir = 'new-api'

  t.test(`${mode} generate api`, async t => {
    t.plan(8)
    let i, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate api -p test', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'api', 'test.mjs')), 'Wrote API handler')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate api (errors)`, async t => {
    t.plan(12)
    let r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)

    r = await begin('generate api', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing path')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate api -p', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate api -p 1', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    await begin('generate api -p foo', cwd)
    r = await begin('generate api -p foo', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, duplicateApi, 'Errored on duplicate API')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} generate api (JSON)`, async t => {
    t.plan(8)
    let i, json, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate api -p test --json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'api', 'test.mjs')), 'Wrote API handler')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate api (errors / JSON)`, async t => {
    t.plan(16)
    let json, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)

    r = await begin('generate api --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate api -p --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate api -p 1 --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathInvalid, 'Errored on invalid path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    await begin('generate api -p foo --json', cwd)
    r = await begin('generate api -p foo --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, duplicateApi, 'Errored on duplicate API')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
