let test = require('tape')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, run } = require(lib)

test('Run new tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[New / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let globalOptions = /Global options\:/
  let noType = /Please specify a resource type to create/
  let newApp = /begin new project \[parameters\]/

  // `new` is unusual in Begin commands in that it has subcommands, so test the subcommand help
  t.test(`${mode} new help`, async t => {
    t.plan(7)
    let r

    r = await begin('new help')
    t.match(r.stdout, globalOptions, 'Got help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('new project help')
    t.match(r.stdout, newApp, 'Got subcommand help')
    t.match(r.stdout, globalOptions, 'Got help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new help (errors)`, async t => {
    t.plan(4)
    let r

    r = await begin('new')
    t.match(r.stderr, noType, 'Did not find resource type arg')
    t.match(r.stderr, globalOptions, 'Got help')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} new help (JSON)`, async t => {
    t.plan(9)
    let r, json

    r = await begin('new help --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true for help')
    t.match(json.message, globalOptions, 'Got help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('new project help --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true for help')
    t.match(json.message, newApp, 'Got subcommand help')
    t.match(json.message, globalOptions, 'Got help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} new help (errors / JSON)`, async t => {
    t.plan(4)
    let r, json

    r = await begin('new --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, noType, 'Did not find resource type arg')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
