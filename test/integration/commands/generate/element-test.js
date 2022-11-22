let test = require('tape')
let { existsSync } = require('fs')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, defaultNumberOfLambdas, getInv, newFolder, run } = require(lib)

test('Run generate tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Generate / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let nameNotFound = /Element name not found/
  let nameInvalid = /The supplied element name is invalid/
  let duplicateElement = /File already exists/
  let newAppDir = 'new-element'

  t.test(`${mode} generate element`, async t => {
    t.plan(8)
    let i, r
    let cwd = newFolder(newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate element -n my-element', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'elements', 'my-element.mjs')), 'Wrote element file')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate element (errors)`, async t => {
    t.plan(18)
    let r
    let cwd = newFolder(newAppDir)
    await begin('new', cwd)

    r = await begin('generate element', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameNotFound, 'Errored on missing path')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate element -n', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameNotFound, 'Errored on missing name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate element -n element', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate element -n 1my-element', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate element -n font-face', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new', cwd)
    await begin(`generate element -n my-element`, cwd, true)
    r = await begin(`generate element -n my-element`, cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, duplicateElement, 'Errored on duplicate api')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} generate element (JSON)`, async t => {
    t.plan(8)
    let i, json, r
    let cwd = newFolder(newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate element -n my-element --json', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'elements', 'my-element.mjs')), 'Wrote element file')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate element (errors / JSON)`, async t => {
    t.plan(24)
    let r, json
    let cwd = newFolder(newAppDir)
    await begin('new', cwd)

    r = await begin('generate element --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate element -n --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate element -n element --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameInvalid, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate element -n 1my-element --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameInvalid, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate element -n font-face --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameInvalid, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new', cwd)
    await begin(`generate element -n my-element --json`, cwd, true)
    r = await begin(`generate element -n my-element --json`, cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, duplicateElement, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
