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

  t.test(`${mode} Normal`, async t => {
    t.plan(38)
    let help = /^begin help/
    let globalOptions = /Global options\:/
    let ver = /Begin version: \d+\.\d+\.\d+/
    let stack = /src[\/\\]{1,2}index.js/
    let r

    r = await begin('help')
    t.match(r.stdout, help, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 0, 'Exited 0')

    r = await begin('--help')
    t.match(r.stdout, help, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')

    r = await begin('-h')
    t.match(r.stdout, help, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')

    // Order: subcommand before help
    r = await begin('new help')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')

    r = await begin('new --help')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')

    r = await begin('new -h')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')

    // Order: help before subcommand
    r = await begin('help new')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')

    r = await begin('--help new')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')

    r = await begin('-h new')
    t.match(r.stdout, globalOptions, 'Got help')
    t.match(r.stdout, ver, 'Got version (non-truncated help)')
    t.notOk(r.stderr, 'Did not print to stderr')

    // Unknown command
    r = await begin('ohnoes')
    t.match(r.stderr, globalOptions, 'Got help for unknown command')
    t.match(r.stderr, ver, 'Got version (non-truncated help)')
    t.doesNotMatch(r.stderr, stack, 'Did not get stack trace in debug mode')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('ohnoes --debug')
    t.match(r.stderr, globalOptions, 'Got help for unknown command')
    t.match(r.stderr, ver, 'Got version (non-truncated help)')
    t.match(r.stderr, stack, 'Got stack trace in debug mode')
    t.notOk(r.stdout, 'Did not print to stdout')
    t.equal(r.status, 1, 'Exited 1')
  })

  t.test(`${mode} JSON`, async t => {
    t.plan(11)
    let errCmd = /ohnoes/
    let stack = /src[\/\\]{1,2}index.js/
    let r, json

    r = await begin('help --json')
    json = JSON.parse(r.stdout)
    t.equal(json.ok, true, 'Got { ok: true } for help')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 0, 'Exited 0')

    r = await begin('ohnoes --json')
    json = JSON.parse(r.stdout)
    t.match(json.error, errCmd, 'Got error for unknown command')
    t.notOk(json.stack, 'Did not get stack trace in !debug mode')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')

    r = await begin('ohnoes --json --debug')
    json = JSON.parse(r.stdout)
    t.match(json.error, errCmd, 'Got error for unknown command')
    t.match(json.stack, stack, 'Got stack trace in debug mode')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 1, 'Exited 1')
  })
}
