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
  // if (runType !== 'binary') return false
  let begin = _begin[runType].bind({}, t)

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
    let cwd = newFolder(newAppDir)
    await begin('new project', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, 'app.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project has a single Lambda')
    r = await begin('new scheduled -n js-rate -r "4 days"', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 2, 'Project now has two Lambdas')
    lambda = i.get.scheduled('js-rate')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.js'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('new scheduled -n js-cron -c "0 18 ? * MON-FRI *"', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 3, 'Project now has three Lambdas')
    lambda = i.get.scheduled('js-cron')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.js'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new event (errors)`, async t => {
    t.plan(27)
    let r
    let cwd = newFolder(newAppDir)
    await begin('new project', cwd)

    r = await begin('new scheduled', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameNotFound, 'Errored on missing name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new scheduled -n', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameNotFound, 'Errored on missing name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new scheduled -n 1', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, nameInvalid, 'Errored on invalid name')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new scheduled -n foo -r whatev', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidRate, 'Errored on invalid runtime')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new scheduled -n foo -c whatev', cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidCron, 'Errored on invalid runtime')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`new scheduled -n foo`, cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, missingRateOrCron, 'Errored on missing rate or cron')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`new scheduled -n foo -r "1 day" -c "0 18 ? * MON-FRI *"`, cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, onlyOneInterval, 'Errored on missing rate or cron')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`new scheduled -n foo -r "1 day" --src ${oob}`, cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, invalidSrcPath, 'Errored on invalid src path')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new project', cwd)
    await begin(`new scheduled -n foo -r "1 day"`, cwd, true)
    r = await begin(`new scheduled -n foo -r "1 day"`, cwd, true)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, duplicateSchedule, 'Errored on duplicate schedule')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} new event (JSON)`, async t => {
    t.plan(17)
    let i, lambda, r, json
    let cwd = newFolder(newAppDir)
    await begin('new project', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, 'app.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project has a single Lambda')
    r = await begin('new scheduled -n js-rate -r "4 days" --json', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 2, 'Project now has two Lambdas')
    lambda = i.get.scheduled('js-rate')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.js'), 'Lambda handler is JavaScript')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('new scheduled -n js-cron -c "0 18 ? * MON-FRI *" --json', cwd, true)
    i = await getInv(t, cwd)
    t.equal(i.inv.lambdaSrcDirs.length, 3, 'Project now has three Lambdas')
    lambda = i.get.scheduled('js-cron')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(!existsSync(lambda.configFile), 'Did not write Lambda config')
    t.ok(lambda.handlerFile.endsWith('.js'), 'Lambda handler is JavaScript')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new event (errors / JSON)`, async t => {
    t.plan(36)
    let r, json
    let cwd = newFolder(newAppDir)
    await begin('new project', cwd)

    r = await begin('new scheduled --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameNotFound, 'Errored on missing name')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new scheduled -n --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameNotFound, 'Errored on missing name')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new scheduled -n 1 --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, nameInvalid, 'Errored on invalid name')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new scheduled -n foo -r whatev --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidRate, 'Errored on invalid runtime')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('new scheduled -n foo -c whatev --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidCron, 'Errored on invalid runtime')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`new scheduled -n foo --json`, cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, missingRateOrCron, 'Errored on missing rate or cron')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`new scheduled -n foo -r "1 day" -c "0 18 ? * MON-FRI *" --json`, cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, onlyOneInterval, 'Errored on missing rate or cron')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin(`new scheduled -n foo -r "1 day" --src ${oob} --json`, cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidSrcPath, 'Errored on invalid src path')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    await begin('new project', cwd)
    await begin(`new scheduled -n foo -r "1 day" --json`, cwd, true)
    r = await begin(`new scheduled -n foo -r "1 day" --json`, cwd, true)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, duplicateSchedule, 'Errored on duplicate schedule')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
