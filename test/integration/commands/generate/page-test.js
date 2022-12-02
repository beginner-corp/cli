let test = require('tape')
let { existsSync } = require('fs')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, defaultNumberOfLambdas, getInv, newTmpFolder, run } = require(lib)

test('Run generate tests (page)', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Generate / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let pathNotFound = /Page path not found/
  let pathInvalid = /Invalid page path/
  let typeInvalid = /Invalid page type/
  let duplicatePage = /Page already exists/
  let newAppDir = 'new-page'

  t.test(`${mode} generate page`, async t => {
    t.plan(13)
    let i, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate page -p test', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'test.html')), 'Wrote API handler')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate page -p test -t js', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'test.mjs')), 'Wrote API handler')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate page (errors)`, async t => {
    t.plan(15)
    let r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)

    r = await begin('generate page', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing path')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate page -p', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate page -p 1', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate page -p test -t cobol', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, typeInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new', cwd)
    await begin('generate page -p foo', cwd)
    r = await begin('generate page -p foo', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, duplicatePage, 'Errored on duplicate page')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} generate page (JSON)`, async t => {
    t.plan(13)
    let i, json, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate page -p test --json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'test.html')), 'Wrote API handler')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate page -p test -t js --json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'test.mjs')), 'Wrote API handler')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate page (errors / JSON)`, async t => {
    t.plan(20)
    let json, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)

    r = await begin('generate page --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate page -p --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate page -p 1 --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathInvalid, 'Errored on invalid path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate page -p test -t cobol --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, typeInvalid, 'Errored on invalid type')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new --json', cwd)
    await begin('generate page -p foo --json', cwd)
    r = await begin('generate page -p foo --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, duplicatePage, 'Errored on duplicate page')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
