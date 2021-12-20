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

  let methodNotFound = /HTTP method not found/
  let methodInvalid = /Invalid HTTP method/
  let pathNotFound = /HTTP path not found/
  let pathNotString = /HTTP path must be a string/
  let pathStartsWithSlash = /HTTP path must begin with `\/`/
  let invalidRuntime = /Function runtime must be one of/
  let invalidSrcPath = /Function source path must be within your project/
  let duplicateRoute = /Duplicate @http routes item/
  let newAppDir = 'new-http'
  let oob = join(process.cwd(), '..', 'whatev')

  t.test(`${mode} new http`, async t => {
    t.plan(17)
    let i, lambda, r
    let cwd = newFolder(newAppDir)
    await begin('new app', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, 'app.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project has a single Lambda')

    r = await begin('new http -m get -p /js', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 2, 'Project now has two Lambdas')
    lambda = i.get.http('get /js')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.js'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 0, 'Exited 0')

    r = await begin('new http -m get -p /py --runtime python', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 3, 'Project now has three Lambdas')
    lambda = i.get.http('get /py')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(existsSync(lambda.configFile), 'Wrote Lambda config')
    t.ok(lambda.handlerFile.endsWith('.py'), 'Lambda handler is Python')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 0, 'Exited 0')
  })

  t.test(`${mode} new http (errors)`, async t => {
    t.plan(27)
    let r
    let cwd = newFolder(newAppDir)
    await begin('new app', cwd)

    r = await begin('new http', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, methodNotFound, 'Errored on missing method')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, methodNotFound, 'Errored on missing method')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m foo', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, methodInvalid, 'Errored on invalid method')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m get', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing path')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m get -p 1', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotString, 'Errored on invalid path')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m get -p foo', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathStartsWithSlash, 'Errored on path missing slash')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m get -p / -r whatev', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidRuntime, 'Errored on invalid runtime')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin(`new http -m get -p / --src ${oob}`, cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidSrcPath, 'Errored on invalid src path')
    t.equal(r.status, 1, 'Exited 1')

    await begin('new app', cwd)
    await begin(`new http -m get -p /foo`, cwd, true)
    r = await begin(`new http -m get -p /foo`, cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, duplicateRoute, 'Errored on duplicate route')
    t.equal(r.status, 1, 'Exited 1')
  })

  t.test(`${mode} new http (JSON)`, async t => {
    t.plan(17)
    let i, json, lambda, r
    let cwd = newFolder(newAppDir)
    await begin('new app', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, 'app.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project has a single Lambda')

    r = await begin('new http -m get -p /js --json', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 2, 'Project now has two Lambdas')
    lambda = i.get.http('get /js')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.js'), 'Lambda handler is JavaScript')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 0, 'Exited 0')

    r = await begin('new http -m get -p /py --runtime python --json', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 3, 'Project now has three Lambdas')
    lambda = i.get.http('get /py')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(existsSync(lambda.configFile), 'Wrote Lambda config')
    t.ok(lambda.handlerFile.endsWith('.py'), 'Lambda handler is Python')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 0, 'Exited 0')
  })

  t.test(`${mode} new http (errors / JSON)`, async t => {
    t.plan(36)
    let json, r
    let cwd = newFolder(newAppDir)
    await begin('new app', cwd)

    r = await begin('new http --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, methodNotFound, 'Errored on missing method')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, methodNotFound, 'Errored on missing method')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m foo --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, methodInvalid, 'Errored on invalid method')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m get --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m get -p 1 --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotString, 'Errored on invalid path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m get -p foo --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathStartsWithSlash, 'Errored on path missing slash')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('new http -m get -p / -r whatev --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidRuntime, 'Errored on invalid runtime')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin(`new http -m get -p / --src ${oob} --json`, cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidSrcPath, 'Errored on invalid src path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    await begin('new app', cwd)
    await begin(`new http -m get -p /foo --json`, cwd, true)
    r = await begin(`new http -m get -p /foo --json`, cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, duplicateRoute, 'Errored on duplicate route')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')
  })
}
