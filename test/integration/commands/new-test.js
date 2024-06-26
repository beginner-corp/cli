let { existsSync } = require('node:fs')
let { join } = require('node:path')
let test = require('tape')
let { begin: _begin, defaultNumberOfLambdas, getInv, newTmpFolder } = require('../../lib')

test('Run new tests', async t => {
  let mode = '[New]'
  let begin = _begin.bind({}, t)

  let newAppDir = 'new'
  let appFound = /Existing Begin app already found in this directory/

  t.test(`${mode} new - normal`, async t => {
    t.plan(8)
    let cwd, i, lambda, r

    cwd = newTmpFolder(t, newAppDir)
    r = await begin('new', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    lambda = i.get.http('any /*')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.ok(r.stderr, 'Prints to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new - destination folder`, async t => {
    t.plan(8)
    let cwd, dest, i, lambda, r

    cwd = newTmpFolder(t, newAppDir, { copy: 'lolidk' })
    dest = join(cwd, 'lolidk')
    r = await begin('new lolidk', cwd)
    i = await getInv(t, dest)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(dest, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    lambda = i.get.http('any /*')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.ok(r.stderr, 'Prints to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new - with app name`, async t => {
    t.plan(9)
    let cwd, i, lambda, r

    cwd = newTmpFolder(t, newAppDir)
    r = await begin('new --name test-app', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.app, 'test-app', 'Correct app name')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    lambda = i.get.http('any /*')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.ok(r.stderr, 'Prints to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new app (errors)`, async t => {
    t.plan(4)
    let cwd, r

    cwd = newTmpFolder(t, newAppDir)
    // Create a fresh project
    r = await begin('new', cwd)
    await getInv(t, cwd)
    t.pass('Project is valid')
    // Now error
    r = await begin('new', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, appFound, 'Errored upon finding existing app in cwd')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} new app (JSON)`, async t => {
    t.plan(8)
    let cwd, i, json, lambda, r

    cwd = newTmpFolder(t, newAppDir)
    r = await begin('new --json', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    json = JSON.parse(r.stdout)
    t.equal(i.inv._project.manifest, join(cwd, '.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, defaultNumberOfLambdas, 'Project has default number of Lambdas')
    lambda = i.get.http('any /*')
    t.ok(existsSync(lambda.handlerFile), 'Wrote Lambda handler')
    t.ok(lambda.handlerFile.endsWith('.mjs'), 'Lambda handler is JavaScript')
    t.equal(json.ok, true, 'Got ok: true')
    t.ok(r.stderr, 'Prints to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new app (errors / JSON)`, async t => {
    t.plan(5)
    let cwd, json, r

    cwd = newTmpFolder(t, newAppDir)
    // Create a fresh project
    r = await begin('new', cwd)
    await getInv(t, cwd)
    t.pass('Project is valid')
    // Now error
    r = await begin('new --json', cwd)
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, appFound, 'Errored upon finding existing app in cwd')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
  t.end()
})

