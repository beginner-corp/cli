let stripAnsi = require('strip-ansi')
let stripEntries = (([ k, v ]) => [ stripAnsi(k), stripAnsi(v) ])
let c = require('chalk')

// Look for color-disabling env vars
let { BEGIN_NO_COLOR, NO_COLOR, TERM } = process.env
let isTTY = !!(process.stdout.isTTY)
let noColor = BEGIN_NO_COLOR || NO_COLOR || !isTTY || TERM === 'dumb'

// Per clig.dev: stdout is for piping to other apps; stderr is for userland
//   https://clig.dev/#the-basics
function printer (params, out = '', verboseOrDebug) {
  let { args } = params
  let isError = out instanceof Error
  if (isError) process.exitCode = 1

  // TODO: this should probably be more nuanced based on stdout vs stderr, TTY state, etc.
  if (args.quiet) return

  if (args.json && !verboseOrDebug) {
    let output
    if (isError) {
      output = { error: stripAnsi(out.message) }
      if (args.debug) output.stack = stripAnsi(out.stack)
    }
    else output = out.json
      ? Object.fromEntries(Object.entries(out.json).map(stripEntries))
      : { ok: true }
    let log = isError ? console.error : console.log
    log(JSON.stringify(output, null, 2))
  }
  else {
    let format = output => (noColor || args['no-color']) ? stripAnsi(output) : output
    if (isError) {
      console.error(format(`${c.bold.red('Error:')} ${out.message}`))
      if (args.debug) {
        let stack = out.stack.split('\n').slice(1).join('\n')
        console.error(format(stack))
      }
    }
    else if (verboseOrDebug && out) {
      console.error(format(out))
    }
    else if (out) {
      console.log(format(out.stdout || out))
    }
  }
}

printer.verbose = function (params, out) {
  let { args } = params
  let { verbose, debug } = args
  if (verbose || debug) printer(params, out, true)
}
printer.debug = function (params, out) {
  let { args } = params
  let { debug } = args
  if (debug) printer(params, out, true)
}

module.exports = printer
