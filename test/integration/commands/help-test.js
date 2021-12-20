let test = require('tape')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, run } = require(lib)

test('Run help tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Help / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  let errCmd = /ohnoes/
  let globalOptions = /Global options\:/
  let stack = /src[\/\\]{1,2}index.js/
  let ver = /Begin version: \d+\.\d+\.\d+/

  t.test(`${mode} Normal`, async t => {
    t.plan(36)
    let help = /^begin help/
    let ver = /Begin version: \d+\.\d+\.\d+/
    let r

    r = await begin('help')
    t.match(r.stdout, help, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('--help')
    t.match(r.stdout, help, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('-h')
    t.match(r.stdout, help, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    // Order: subcommand before help
    r = await begin('new help')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('new --help')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('new -h')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    // Order: help before subcommand
    r = await begin('help new')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('--help new')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')

    r = await begin('-h new')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} Normal (errors)`, async t => {
    t.plan(10)
    let r

    // Unknown command
    r = await begin('ohnoes')
    t.match(r.stderr, globalOptions, 'Got help for unknown command')
    t.match(r.stderr, ver, 'Got version (non-truncated help)')
    t.doesNotMatch(r.stderr, stack, 'Did not get stack trace in debug mode')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('ohnoes --debug')
    t.match(r.stderr, globalOptions, 'Got help for unknown command')
    t.match(r.stderr, ver, 'Got version (non-truncated help)')
    t.match(r.stderr, stack, 'Got stack trace in debug mode')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.equal(r.code, 1, 'Exited 1')
  })

  t.test(`${mode} JSON`, async t => {
    t.plan(4)
    let r, json

    r = await begin('help --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got ok: true for help')
    t.ok(json.message, 'Got message for help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} JSON (errors)`, async t => {
    t.plan(8)
    let r, json

    r = await begin('ohnoes --json')
    json = JSON.parse(r.stdout)
    t.match(json.error, errCmd, 'Got error for unknown command')
    t.notOk(json.stack, 'Did not get stack trace in !debug mode')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')

    r = await begin('ohnoes --json --debug')
    json = JSON.parse(r.stdout)
    t.match(json.error, errCmd, 'Got error for unknown command')
    t.match(json.stack, stack, 'Got stack trace in debug mode')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.code, 1, 'Exited 1')
  })
}
