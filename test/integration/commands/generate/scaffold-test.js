let { existsSync } = require('node:fs')
let { join } = require('node:path')
let test = require('tape')
let { begin: _begin, defaultNumberOfLambdas, getInv, newTmpFolder } = require('../../../lib')

test('Run generate tests (scaffold)', async t => {
  let mode = `[Generate]`
  let begin = _begin.bind({}, t)

  let newAppDir = 'crud-app'
  let alreadyExists = /The schema already exists/

  t.test(`${mode} scaffold project - normal`, async t => {
    t.plan(13)
    let i, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate scaffold Books title:string author:string', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'api', 'books.mjs')), 'Wrote books api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'books', '$id.mjs')), 'Wrote books/$id api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'books', '$id', 'delete.mjs')), 'Wrote books/$id/delete api route')
    t.ok(existsSync(join(cwd, 'app', 'models', 'books.mjs')), 'Wrote books db code')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'books.mjs')), 'Wrote books view')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'books', '$id.mjs')), 'Wrote books/$id view')
    t.ok(existsSync(join(cwd, 'app', 'models', 'schemas', 'book.mjs')), 'Wrote books JSON schema')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} scaffold project - file based`, async t => {
    t.plan(13)
    let i, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    r = await begin('generate scaffold -f ../../mock/person.schema.json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'api', 'people.mjs')), 'Wrote people api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'people', '$id.mjs')), 'Wrote people/$id api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'people', '$id', 'delete.mjs')), 'Wrote people/$id/delete api route')
    t.ok(existsSync(join(cwd, 'app', 'models', 'people.mjs')), 'Wrote people db code')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'people.mjs')), 'Wrote people view')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'people', '$id.mjs')), 'Wrote people/$id view')
    t.ok(existsSync(join(cwd, 'app', 'models', 'schemas', 'person.mjs')), 'Wrote person JSON schema')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} scaffold project - reference file based`, async t => {
    t.plan(13)
    let i, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has a single Lambda')
    r = await begin('generate scaffold -f ../../mock/customer.schema.json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project still has one Lambda')
    t.ok(existsSync(join(cwd, 'app', 'api', 'customers.mjs')), 'Wrote customers api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'customers', '$id.mjs')), 'Wrote customers/$id api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'customers', '$id', 'delete.mjs')), 'Wrote customers/$id/delete api route')
    t.ok(existsSync(join(cwd, 'app', 'models', 'customers.mjs')), 'Wrote customers db code')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'customers.mjs')), 'Wrote customers view')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'customers', '$id.mjs')), 'Wrote customers/$id view')
    t.ok(existsSync(join(cwd, 'app', 'models', 'schemas', 'customer.mjs')), 'Wrote customer JSON schema')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} scaffold app (errors)`, async t => {
    t.plan(4)
    let cwd, r

    cwd = newTmpFolder(t, newAppDir)
    // Create a fresh project
    r = await begin('new', cwd)
    t.pass('Project is valid')
    await begin('generate scaffold Books title:string author:string', cwd)
    r = await begin('generate scaffold Books title:string author:string', cwd)
    await getInv(t, cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, alreadyExists, 'Errored upon finding existing routes in project')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} scaffold project - normal / JSON`, async t => {
    t.plan(13)
    let i, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate scaffold Books title:string author:string', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'api', 'books.mjs')), 'Wrote books api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'books', '$id.mjs')), 'Wrote books/$id api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'books', '$id', 'delete.mjs')), 'Wrote books/$id/delete api route')
    t.ok(existsSync(join(cwd, 'app', 'models', 'books.mjs')), 'Wrote books db code')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'books.mjs')), 'Wrote books view')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'books', '$id.mjs')), 'Wrote books/$id view')
    t.ok(existsSync(join(cwd, 'app', 'models', 'schemas', 'book.mjs')), 'Wrote books JSON schema')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} scaffold project - file based / JSON`, async t => {
    t.plan(13)
    let i, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate scaffold  -f ../../mock/person.schema.json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'api', 'people.mjs')), 'Wrote people api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'people', '$id.mjs')), 'Wrote people/$id api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'people', '$id', 'delete.mjs')), 'Wrote people/$id/delete api route')
    t.ok(existsSync(join(cwd, 'app', 'models', 'people.mjs')), 'Wrote people db code')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'people.mjs')), 'Wrote people view')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'people', '$id.mjs')), 'Wrote people/$id view')
    t.ok(existsSync(join(cwd, 'app', 'models', 'schemas', 'person.mjs')), 'Wrote person JSON schema')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} scaffold project - referenced file based / JSON`, async t => {
    t.plan(13)
    let i, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate scaffold -f ../../mock/customer.schema.json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    t.ok(existsSync(join(cwd, 'app', 'api', 'customers.mjs')), 'Wrote customers api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'customers', '$id.mjs')), 'Wrote customers/$id api route')
    t.ok(existsSync(join(cwd, 'app', 'api', 'customers', '$id', 'delete.mjs')), 'Wrote customers/$id/delete api route')
    t.ok(existsSync(join(cwd, 'app', 'models', 'customers.mjs')), 'Wrote customers db code')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'customers.mjs')), 'Wrote customers view')
    t.ok(existsSync(join(cwd, 'app', 'pages', 'customers', '$id.mjs')), 'Wrote customers/$id view')
    t.ok(existsSync(join(cwd, 'app', 'models', 'schemas', 'customer.mjs')), 'Wrote customer JSON schema')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} scaffold app (errors / JSON)`, async t => {
    t.plan(5)
    let cwd, json, r

    cwd = newTmpFolder(t, newAppDir)
    // Create a fresh project
    r = await begin('new', cwd)
    t.pass('Project is valid')

    await begin('generate scaffold Books title:string author:string --json', cwd)
    r = await begin('generate scaffold Books title:string author:string --json', cwd)
    await getInv(t, cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, alreadyExists, 'Errored upon finding existing routes in project')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
  t.end()
})

