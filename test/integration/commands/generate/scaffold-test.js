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

  let newAppDir = 'crud-app'
  // let alreadyExists = / already exist in the project/

  t.test(`${mode} scaffold project - normal`, async t => {
    t.plan(16)
    let i, r
    let cwd = newFolder(newAppDir)
    await begin('new project -p .', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project has a single Lambda')

    r = await begin('generate scaffold Books title:string author:string', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project still has one Lambda')
    t.ok(existsSync(join(cwd, 'app/api/books.mjs')), 'Wrote books api route')
    t.ok(existsSync(join(cwd, 'app/api/books/$id.mjs')), 'Wrote books/$id api route')
    t.ok(existsSync(join(cwd, 'app/api/books/$id/delete.mjs')), 'Wrote books/$id/delete api route')
    t.ok(existsSync(join(cwd, 'app/db/books.mjs')), 'Wrote books db code')
    t.ok(existsSync(join(cwd, 'app/pages/books.mjs')), 'Wrote books view')
    t.ok(existsSync(join(cwd, 'app/pages/books/$id.mjs')), 'Wrote books/$id view')
    t.ok(existsSync(join(cwd, 'app/pages/books/new.mjs')), 'Wrote books/new view')
    t.ok(existsSync(join(cwd, 'app/schemas/book.mjs')), 'Wrote books JSON schema')
    t.ok(existsSync(join(cwd, 'app/schemas/schema-to-form.mjs')), 'Wrote schema-to-form helper')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} scaffold app (errors)`, async t => {
    t.plan(2)
    let cwd, r

    cwd = newFolder(newAppDir)
    // Create a fresh project
    r = await begin('new project -p .', cwd)
    r = await begin('generate scaffold Books title:string author:string', cwd, true)
    await getInv(t, cwd)
    t.pass('Project is valid')
    // Now error
    /*
    r = await begin('generate scaffold Books title:string author:string', cwd, true)
    */
    t.notOk(r.stdout, 'Did not print to stdout')
    /*
    t.match(r.stderr, alreadyExists, 'Errored upon finding existing routes in project')
    t.equal(r.code, 1, 'Exited 1')
    */
  })

  t.test(`${mode} scaffold project - normal / JSON`, async t => {
    t.plan(15)
    let i, r
    let cwd = newFolder(newAppDir)
    await begin('new project -p .', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project has a single Lambda')

    r = await begin('generate scaffold Books title:string author:string', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project still has one Lambda')
    t.ok(existsSync(join(cwd, 'app/api/books.mjs')), 'Wrote books api route')
    t.ok(existsSync(join(cwd, 'app/api/books/$id.mjs')), 'Wrote books/$id api route')
    t.ok(existsSync(join(cwd, 'app/api/books/$id/delete.mjs')), 'Wrote books/$id/delete api route')
    t.ok(existsSync(join(cwd, 'app/db/books.mjs')), 'Wrote books db code')
    t.ok(existsSync(join(cwd, 'app/pages/books.mjs')), 'Wrote books view')
    t.ok(existsSync(join(cwd, 'app/pages/books/$id.mjs')), 'Wrote books/$id view')
    t.ok(existsSync(join(cwd, 'app/pages/books/new.mjs')), 'Wrote books/new view')
    t.ok(existsSync(join(cwd, 'app/schemas/book.mjs')), 'Wrote books JSON schema')
    t.ok(existsSync(join(cwd, 'app/schemas/schema-to-form.mjs')), 'Wrote schema-to-form helper')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} scaffold app (errors / JSON)`, async t => {
    t.plan(2)
    let cwd, r

    cwd = newFolder(newAppDir)
    // Create a fresh project
    r = await begin('new project -p .', cwd)
    r = await begin('generate scaffold Books title:string author:string --json', cwd, true)
    await getInv(t, cwd)
    t.pass('Project is valid')
    // Now error
    /*
    r = await begin('generate scaffold Books title:string author:string --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, alreadyExists, 'Errored upon finding existing routes in project')
    */
    t.notOk(r.stderr, 'Did not print to stderr')
    /*
    t.equal(r.code, 1, 'Exited 1')
    */
  })
}
