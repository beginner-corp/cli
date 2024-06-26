let { existsSync } = require('node:fs')
let { join } = require('node:path')
let test = require('tape')
let { begin: _begin, defaultNumberOfLambdas, getInv, newTmpFolder } = require('../../../lib')

test('Run generate tests (scheduled)', async t => {
  let mode = `[Generate]`
  let begin = _begin.bind({}, t)

  let nameNotFound = /Scheduled name not found/
  let nameInvalid = /Invalid scheduled name/
  let missingRateOrCron = /Neither a rate or cron expression was specified/
  let onlyOneInterval = /Only one interval is supported/
  let duplicateSchedule = /Duplicate @scheduled item/
  let invalidCron = /The specified cron expression is invalid/
  let invalidRate = /The specified rate expression is invalid/
  let invalidSrcPath = /Function source path must be within your project/
  let newAppDir = 'new-scheduled'
  let oob = join(process.cwd(), '..', 'whatev')

  t.test(`${mode} new scheduled`, async t => {
    t.plan(17)
    let i, lambda, r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    r = await begin('generate scheduled -n js-rate -r "4 days"', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 1, 'Project now has two Lambdas')
    lambda = i.get.scheduled('js-rate')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate scheduled -n js-cron -c "0 18 ? * MON-FRI *"', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 2, 'Project now has three Lambdas')
    lambda = i.get.scheduled('js-cron')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new scheduled (errors)`, async t => {
    t.plan(27)
    let r
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)

    r = await begin('generate scheduled', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameNotFound, 'Errored on missing name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate scheduled -n', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameNotFound, 'Errored on missing name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate scheduled -n 1', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate scheduled -n foo -r whatev', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidRate, 'Errored on invalid runtime')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate scheduled -n foo -c whatev', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidCron, 'Errored on invalid runtime')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`generate scheduled -n foo`, cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, missingRateOrCron, 'Errored on missing rate or cron')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`generate scheduled -n foo -r "1 day" -c "0 18 ? * MON-FRI *"`, cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, onlyOneInterval, 'Errored on missing rate or cron')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`generate scheduled -n foo -r "1 day" --src ${oob}`, cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidSrcPath, 'Errored on invalid src path')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new', cwd)
    await begin(`generate scheduled -n foo -r "1 day"`, cwd)
    r = await begin(`generate scheduled -n foo -r "1 day"`, cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, duplicateSchedule, 'Errored on duplicate schedule')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} new scheduled (JSON)`, async t => {
    t.plan(17)
    let i, lambda, r, json
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    r = await begin('generate scheduled -n js-rate -r "4 days" --json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 1, 'Project now has two Lambdas')
    lambda = i.get.scheduled('js-rate')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate scheduled -n js-cron -c "0 18 ? * MON-FRI *" --json', cwd)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas + 2, 'Project now has three Lambdas')
    lambda = i.get.scheduled('js-cron')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new scheduled (errors / JSON)`, async t => {
    t.plan(36)
    let r, json
    let cwd = newTmpFolder(t, newAppDir)
    await begin('new', cwd)

    r = await begin('generate scheduled --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameNotFound, 'Errored on missing name')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate scheduled -n --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameNotFound, 'Errored on missing name')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate scheduled -n 1 --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameInvalid, 'Errored on invalid name')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate scheduled -n foo -r whatev --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidRate, 'Errored on invalid runtime')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate scheduled -n foo -c whatev --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidCron, 'Errored on invalid runtime')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`generate scheduled -n foo --json`, cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, missingRateOrCron, 'Errored on missing rate or cron')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`generate scheduled -n foo -r "1 day" -c "0 18 ? * MON-FRI *" --json`, cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, onlyOneInterval, 'Errored on missing rate or cron')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`generate scheduled -n foo -r "1 day" --src ${oob} --json`, cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidSrcPath, 'Errored on invalid src path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new', cwd)
    await begin(`generate scheduled -n foo -r "1 day" --json`, cwd)
    r = await begin(`generate scheduled -n foo -r "1 day" --json`, cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, duplicateSchedule, 'Errored on duplicate schedule')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
  t.end()
})
