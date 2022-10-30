let test = require('tape')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, run } = require(lib)

test('Run generate tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Generate / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let globalOptions = /Global options\:/
  let noType = /Please specify a generator to run/
  let invalidType = /Invalid generator type: foo/
  let generateScaffold = /begin generate scaffold <parameters> \[options\]/

  // `generate` is unusual in Begin commands in that it has subcommands, so test the subcommand help
  t.test(`${mode} generate help`, async t => {
    t.plan(7)
    let r

    r = await begin('generate help')
    t.match(r.stdout, globalOptions, 'Got help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate scaffold help')
    t.match(r.stdout, generateScaffold, 'Got subcommand help')
    t.match(r.stdout, globalOptions, 'Got help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate help (errors)`, async t => {
    t.plan(8)
    let r

    r = await begin('generate')
    t.match(r.stderr, noType, 'Did not find resource type arg')
    t.match(r.stderr, globalOptions, 'Got help')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate foo')
    t.match(r.stderr, invalidType, 'Errored on invalid resource type arg')
    t.match(r.stderr, globalOptions, 'Got help')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} generate help (JSON)`, async t => {
    t.plan(9)
    let r, json

    r = await begin('generate help --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true for help')
    t.match(json.message, globalOptions, 'Got help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('generate scaffold help --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true for help')
    t.match(json.message, globalOptions, 'Got subcommand help')
    t.match(json.message, globalOptions, 'Got help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} generate help (errors / JSON)`, async t => {
    t.plan(8)
    let r, json

    r = await begin('generate --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, noType, 'Did not find resource type arg')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('generate foo --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, false, 'Got ok: false')
    t.match(json.error, invalidType, 'Errored on invalid resource type arg')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
