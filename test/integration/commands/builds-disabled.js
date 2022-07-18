let test = require('tape')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, run, getInv, newFolder } = require(lib)
let { writeFileSync } = require('fs')

function appendAppID (i) {
  writeFileSync(i.inv._project.manifest, `${i.inv._project.raw}@begin\nappID XXXXXXXX\n`)
}

test('Run builds tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Help / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let newAppDir = 'new-app'

  let noAppFound = /No app found with that app ID/
  let invalidAppID = /No app found with that app ID/

  t.test(`${mode} Builds (errors)`, async t => {
    t.plan(5)
    let cwd, i, r

    // Check build in a folder without app.arc
    r = await begin('builds')
    t.match(r.stderr, noAppFound, 'No app ID')

    // Create project and check builds
    cwd = newFolder(newAppDir)
    r = await begin('new project -p .', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, 'app.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project has a single Lambda')
    // Fake app ID
    appendAppID(i)
    r = await begin('builds', cwd, true)
    t.match(r.stderr, invalidAppID, 'Got error message for invalid app ID')
  })

  t.test(`${mode} Builds JSON (errors)`, async t => {
    t.plan(11)
    let cwd, i, r, json

    // Check build in a folder without app.arc
    r = await begin('builds --json')
    json = JSON.parse(r.stdout)
    t.match(json.error, noAppFound, 'Got error for unknown command')
    t.notOk(json.stack, 'Did not get stack trace in !debug mode')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    // Create project and check builds
    cwd = newFolder(newAppDir)
    r = await begin('new project -p . --json', cwd)
    i = await getInv(t, cwd)
    t.pass('Project is valid')
    t.equal(i.inv._project.manifest, join(cwd, 'app.arc'), 'Wrote manifest to folder')
    t.equal(i.inv.lambdaSrcDirs.length, 1, 'Project has a single Lambda')
    // Fake app ID
    appendAppID(i)
    r = await begin('builds --json', cwd, true)
    json = JSON.parse(r.stdout)
    t.match(json.error, invalidAppID, 'Got error message for invalid app ID')
    t.notOk(json.stack, 'Did not get stack trace in !debug mode')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
