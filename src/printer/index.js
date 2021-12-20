let stripAnsi = require('strip-ansi')
let getStack = err => err.stack.split('\n').slice(1).join('\n')

// Per clig.dev: stdout is for piping to other apps; stderr is for userland
//   https://clig.dev/#the-basics
function printer (args) {
  function print (out = '', verbosity) {
    let isError = out instanceof Error
    if (isError) process.exitCode = 1
    let errored = process.exitCode === 1

    // TODO: this should probably be more nuanced based on stdout vs stderr, TTY state, etc.
    if (args.quiet) return

    let { verbose, debug } = args
    if (verbosity === 'verbose' && !(verbose || debug)) return
    if (verbosity === 'debug' && !debug) return

    // JSON output is assumed to be for machines, not for userland (read: stderr)
    if (args.json && !verbosity) {
      let output = { ok: true }
      if (isError) {
        output = { ok: false, error: stripAnsi(out.message) }
        if (args.debug) output.stack = stripAnsi(getStack(out))
      }
      else if (out.json) {
        Object.entries(out.json).forEach(([ k, v ]) => output[stripAnsi(k)] = stripAnsi(v))
      }
      else {
        output.message = stripAnsi(out)
      }
      console.log(JSON.stringify(output, null, 2))
    }
    else if (!args.json && out) {
      // Look for color-disabling env vars, TTY state, flags, etc.
      let { BEGIN_NO_COLOR, NO_COLOR, TERM } = process.env
      let isTTY = !!(process.stdout.isTTY)
      let noColor = BEGIN_NO_COLOR || NO_COLOR || !isTTY || TERM === 'dumb' || args['no-color']
      let format = output => noColor ? stripAnsi(output) : output

      if (isError) {
        let c = require('chalk')
        console.error(format(`${c.bold.red('Error:')} ${out.message}`))
        if (args.debug) {
          let stack = getStack(out)
          console.error(format(stack))
        }
      }
      else {
        let log = verbosity || errored ? console.error : console.log
        log(format(out.string || out))
      }
    }
  }
  print.verbose = out => print(out, 'verbose')
  print.debug = out => print(out, 'debug')
  return print
}
module.exports = printer
