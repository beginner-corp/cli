let test = require('tape')
let { join } = require('path')
let proxyquire = require('proxyquire')
let lib = join(process.cwd(), 'test', 'lib')
let { capture } = require(lib)
let sut = join(process.cwd())

let error = false
function commands (p) {
  params = p
  if (error) throw error
}
let begin = proxyquire(sut, {
  './commands': commands
})

let argv = process.argv
let env = process.env
let args = s => process.argv = [ 'fake-env', 'fake-file', ...s.split(' ').filter(Boolean) ]
let params

function reset () {
  process.argv = argv
  process.env = env
  params = undefined
}

test('Set up env', t => {
  t.plan(1)
  t.ok(begin, 'Begin entry is present')
})

test('Args', async t => {
  t.plan(9)
  async function run (flags) {
    reset()
    args(flags)
    await begin()
  }

  await run('-d')
  t.ok(params.args.debug, 'args.debug set with -d')
  await run('--debug')
  t.ok(params.args.debug, 'args.debug set with --debug')
  // Ok not an arg, but it overrides the arg
  process.env.DEBUG = true
  await run('--debug')
  t.ok(params.args.debug, 'args.debug set with DEBUG')
  delete process.env.DEBUG

  await run('-h')
  t.ok(params.args.help, 'args.help set with -h')
  await run('--help')
  t.ok(params.args.help, 'args.help set with --help')

  await run('-q')
  t.ok(params.args.quiet, 'args.quiet set with -q')
  await run('--quiet')
  t.ok(params.args.quiet, 'args.quiet set with --quiet')

  await run('-v')
  t.ok(params.args.verbose, 'args.verbose set with -v')
  await run('--verbose')
  t.ok(params.args.verbose, 'args.verbose set with --verbose')
})

test('Version', async t => {
  t.plan(2)
  reset()
  let ver = 'henlo'
  await begin(ver)
  t.equal(params.appVersion, ver, `Passed through app version: ${ver}`)

  reset()
  await begin()
  t.ok(params.appVersion && (params.appVersion !== ver), `Got a default app version: ${params.appVersion}`)
})

test('Print error if something blows up', async t => {
  t.plan(1)
  let msg = 'uh oh'
  error = Error(msg)

  capture.start()
  await begin()
  capture.stop()
  t.ok(capture.stderr.includes(msg), `Errored at top leve.: ${capture.stderr}`)

  t.teardown(() => {
    capture.reset()
    error = false
  })
})
