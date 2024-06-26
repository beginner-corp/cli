let { existsSync } = require('node:fs')
let { join } = require('node:path')
let test = require('tape')
let { begin: _begin, defaultNumberOfLambdas, getInv, newTmpFolder } = require('../../../lib')

test('Run generate tests (http)', async t => {
  let mode = `[Generate]`
  let begin = _begin.bind({}, t)

  let methodInvalid = /Invalid HTTP method/
  let pathNotFound = /HTTP path not found/
  let pathNotString = /HTTP path must be a string/
  let pathStartsWithSlash = /HTTP path must begin with `\/`/
  let invalidSrcPath = /Function source path must be within your project/
  let duplicateRoute = /Duplicate @http routes item/
  let newAppDir = 'new-http'
  let oob = join(process.cwd(), '..', 'whatev')

  t.test(`${mode} generate http`, async t => {
    t.plan(26)
    let i, lambda, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate http -m get -p /js', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 1, 'Project has an extra Lambda')
    lambda = i.get.http('get /js')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate http -p /default', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 2, 'Project has two extra Lambdas')
    lambda = i.get.http('get /default')
    t.equal(lambda.method, 'get', 'Used default lambda method')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate http -m PUT -p /default', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 3, 'Project has three extra Lambdas')
    lambda = i.get.http('put /default')
    t.equal(lambda.method, 'put', 'Used put for lambda method')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate http (errors)`, async t => {
    t.plan(24)
    let r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)

    r = await begin('generate http', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing path')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing path')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m foo -p /', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, methodInvalid, 'Errored on invalid method')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m get', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotFound, 'Errored on missing path')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m get -p 1', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathNotString, 'Errored on invalid path')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m get -p foo', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, pathStartsWithSlash, 'Errored on path missing slash')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`generate http -m get -p / --src ${oob}`, cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidSrcPath, 'Errored on invalid src path')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new', cwd)
    await begin(`generate http -m get -p /foo`, cwd)
    r = await begin(`generate http -m get -p /foo`, cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, duplicateRoute, 'Errored on duplicate route')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} generate http (JSON)`, async t => {
    t.plan(26)
    let i, json, lambda, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')

    r = await begin('generate http -m get -p /js --json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 1, 'Project has an extra Lambda')
    lambda = i.get.http('get /js')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate http -p /default --json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 2, 'Project has two extra Lambdas')
    lambda = i.get.http('get /default')
    t.equal(lambda.method, 'get', 'Used default lambda method')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate http -m PUT -p /default --json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 3, 'Project has three extra Lambdas')
    lambda = i.get.http('put /default')
    t.equal(lambda.method, 'put', 'Used put for lambda method')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate http (errors / JSON)`, async t => {
    t.plan(32)
    let json, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)

    r = await begin('generate http --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m foo -p / --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, methodInvalid, 'Errored on invalid method')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m get --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotFound, 'Errored on missing path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m get -p 1 --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathNotString, 'Errored on invalid path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate http -m get -p foo --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, pathStartsWithSlash, 'Errored on path missing slash')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`generate http -m get -p / --src ${oob} --json`, cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidSrcPath, 'Errored on invalid src path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new', cwd)
    await begin(`generate http -m get -p /foo --json`, cwd)
    r = await begin(`generate http -m get -p /foo --json`, cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, duplicateRoute, 'Errored on duplicate route')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
  t.end()
})

