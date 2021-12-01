let { join } = require('path')
let test = require('tape')
let sut = join(process.cwd(), 'src', 'printer')
let printer = require(sut)

let isTTY = process.stdout.isTTY
let { env } = process
let log = console.log
let err = console.err

let stdout = ''
let stderr = ''

function setup () {
  console.log = out => stdout += out + '\n'
  console.error = out => stderr += out + '\n'
  stdout = ''
  stderr = ''
  if (process.exitCode) process.exitCode = 0
}
function reset () {
  console.log = log
  console.err = err
  process.stdout.isTTY = false
  process.env = env
}
function run (method, args, out) {
  setup()
  let _printer = printer(args)
  let print = method === 'normal' ? _printer : _printer[method]
  print(out)
  // Trim for easier assertion
  stdout = stdout.trim()
  stderr = stderr.trim()
  reset()
}
let json = str => JSON.stringify(str, null, 2)
let trimStack = err => err.stack.split('\n').slice(1).join('\n')

test('Set up env', t => {
  t.plan(1)
  t.ok(printer, 'Printer module is present')
})

test('Basic output', t => {
  t.plan(4)
  let out

  out = 'hi there'
  run('normal', {}, out)
  t.equal(stdout, out, `Printed normal output to stdout (normal mode): ${out}`)
  t.notOk(stderr, `Did not print to stderr`)

  out = { string: 'hi there' }
  run('normal', {}, out)
  t.equal(stdout, out.string, `Printed normal output to stdout (normal mode): ${out.string}`)
  t.notOk(stderr, `Did not print to stderr`)
})

test('JSON output', t => {
  // FYI: JSON x errors are tested in the 'errors' test block
  t.plan(6)
  let out

  out = {}
  let def = json({ ok: true })
  run('normal', { json: true }, out)
  t.equal(stdout, def, `Printed default JSON output to stdout (JSON mode): ${def}`)
  t.notOk(stderr, `Did not print to stderr`)

  out = { json: { message: 'hi there' } }
  run('normal', { json: true }, out)
  t.equal(stdout, json(out.json), `Printed JSON output to stdout (JSON mode): ${json(out.json)}`)
  t.notOk(stderr, `Did not print to stderr`)

  run('verbose', { verbose: true, json: true }, out)
  t.notOk(stdout || stderr, `Verbose method did not print`)

  run('debug', { debug: true, json: true }, out)
  t.notOk(stdout || stderr, `Debug method did not print`)
})

test('Quiet', t => {
  t.plan(1)
  let out = 'hi there'
  run('normal', { quiet: true }, out)
  t.notOk(stdout || stderr, `Verbose method did not print`)
})

test('Modes: normal, verbose, debug', t => {
  t.plan(20)
  let out

  /**
   * Normal
   */
  // As string
  out = 'hi there'
  run('normal', { verbose: true }, out)
  t.equal(stdout, out, `Printed normal output to stdout (verbose mode): ${out}`)
  t.notOk(stderr, `Did not print to stderr`)

  run('normal', { debug: true }, out)
  t.equal(stdout, out, `Printed normal output to stdout (debug mode): ${out}`)
  t.notOk(stderr, `Did not print to stderr`)

  // As object
  out = { string: 'hi there' }
  run('normal', { verbose: true }, out)
  t.equal(stdout, out.string, `Printed normal output to stdout (verbose mode): ${out}`)
  t.notOk(stderr, `Did not print to stderr`)

  run('normal', { debug: true }, out)
  t.equal(stdout, out.string, `Printed normal output to stdout (debug mode): ${out}`)
  t.notOk(stderr, `Did not print to stderr`)

  /**
   * Verbose
   */
  // As string
  out = 'verbose hi there'
  run('verbose', { verbose: true }, out)
  t.equal(stderr, out, `Printed verbose output to stderr (verbose mode): ${out}`)
  t.notOk(stdout, `Verbose method did not print to stdout`)

  run('verbose', {}, out)
  t.notOk(stdout || stderr, `Verbose method did not print (verbose not set)`)

  // As object
  out = { string: 'verbose hi there' }
  run('verbose', { verbose: true }, out)
  t.equal(stderr, out.string, `Printed verbose output to stderr (verbose mode): ${out}`)
  t.notOk(stdout, `Verbose method did not print to stdout`)

  run('verbose', {}, out)
  t.notOk(stdout || stderr, `Verbose method did not print (verbose not set)`)

  /**
   * Debug
   */
  // As string
  out = 'debug hi there'
  run('debug', { debug: true }, out)
  t.equal(stderr, out, `Printed debug output to stderr (debug mode): ${out}`)
  t.notOk(stdout, `Debug method did not print to stdout`)

  run('debug', {}, out)
  t.notOk(stdout || stderr, `Debug method did not print (normal mode)`)

  // As object
  out = { string: 'debug hi there' }
  run('debug', { debug: true }, out)
  t.equal(stderr, out.string, `Printed debug output to stderr (debug mode): ${out}`)
  t.notOk(stdout, `Debug method did not print to stdout`)

  run('debug', {}, out)
  t.notOk(stdout || stderr, `Debug method did not print (normal mode)`)
})

test('Errors', t => {
  t.plan(14)
  if (process.exitCode) t.fail('process.exitCode should not be set during this test run')
  let re = str => new RegExp(str)

  let msg = 'oh noes'
  let err = Error(msg)

  // Normal
  run('normal', {}, err)
  t.match(stderr, re(msg), `Printed error output to stderr: ${stderr}`)
  t.notOk(stderr.includes(err.stack.split('\n').slice(1)), `Did not print stack`)
  t.notOk(stdout, `Did not print to stdout`)
  t.equal(process.exitCode, 1, `Printer set process.exitCode: ${process.exitCode}`)

  run('normal', { debug: true }, err)
  t.match(stderr, re(msg), `Printed error output to stderr (debug mode): ${stderr}`)
  t.ok(stderr.includes(err.stack), `Printed error stack to stderr (debug mode)`)
  t.notOk(stdout, `Did not print to stdout`)
  t.equal(process.exitCode, 1, `Printer set process.exitCode: ${process.exitCode}`)

  // JSON
  run('normal', { json: true }, err)
  t.equal(stderr, json({ error: msg }), `Printed error output to stderr (JSON mode): ${stderr}`)
  t.notOk(stdout, `Did not print to stdout`)
  t.equal(process.exitCode, 1, `Printer set process.exitCode: ${process.exitCode}`)

  run('normal', { json: true, debug: true }, err)
  t.equal(stderr, json({ error: msg, stack: trimStack(err) }), `Printed error output to stderr (JSON mode): ${stderr}`)
  t.notOk(stdout, `Did not print to stdout`)
  t.equal(process.exitCode, 1, `Printer set process.exitCode: ${process.exitCode}`)

  t.teardown(() => process.exitCode = 0)
})

test('No color', t => {
  t.plan(5)
  let msg = 'hi there'
  let color = '\x1B[1m\x1B[31mhi there\x1B[39m\x1B[22m'

  process.stdout.isTTY = true
  run('normal', {}, color)
  t.equal(stdout, color, `Printed with color (normal)`)
  delete process.env.FORCE_COLOR

  process.stdout.isTTY = false
  run('normal', {}, color)
  t.equal(stdout, msg, `Printed without color (!isTTY)`)

  process.env.BEGIN_NO_COLOR = true
  run('normal', {}, color)
  t.equal(msg, stdout, `Printed without color (BEGIN_NO_COLOR)`)

  process.env.NO_COLOR = true
  run('normal', {}, color)
  t.equal(msg, stdout, `Printed without color (NO_COLOR)`)

  process.env.TERM = 'dumb'
  run('normal', {}, color)
  t.equal(msg, stdout, `Printed without color (TERM)`)
})

test('Nothing passed back to print', t => {
  t.plan(1)
  run('normal', {})
  t.notOk(stdout || stderr, `Did not print`)
})

test('Teardown', t => {
  t.plan(1)
  reset()
  process.exitCode = 0
  process.stdout.isTTY = isTTY
  t.pass('Finished testing printer')
})
