let stripAnsi = require('strip-ansi')
let stripEntries = (([ k, v ]) => [ stripAnsi(k), stripAnsi(v) ])
let getStack = err => err.stack.split('\n').slice(1).join('\n')

// Per clig.dev: stdout is for piping to other apps; stderr is for userland
//   https://clig.dev/#the-basics
function printer (args) {
  function print (out = '', verbosity) {
    let isError = out instanceof Error
    if (isError) process.exitCode = 1

    // TODO: this should probably be more nuanced based on stdout vs stderr, TTY state, etc.
    if (args.quiet) return

    let { verbose, debug } = args
    if (verbosity === 'verbose' && !(verbose || debug)) return
    if (verbosity === 'debug' && !debug) return

    // Look for color-disabling env vars
    let { BEGIN_NO_COLOR, NO_COLOR, TERM } = process.env
    let isTTY = !!(process.stdout.isTTY)
    let noColor = BEGIN_NO_COLOR || NO_COLOR || !isTTY || TERM === 'dumb'

    // JSON output is assumed to be for machines, not for userland (read: stderr)
    if (args.json && !verbosity) {
      let output
      if (isError) {
        output = { error: stripAnsi(out.message) }
        if (args.debug) output.stack = stripAnsi(getStack(out))
      }
      else output = out.json
        ? Object.fromEntries(Object.entries(out.json).map(stripEntries))
        : { ok: true }
      let log = isError ? console.error : console.log
      log(JSON.stringify(output, null, 2))
    }
    else if (!args.json && out) {
      let format = output => (noColor || args['no-color']) ? stripAnsi(output) : output
      if (isError) {
        let c = require('chalk')
        console.error(format(`${c.bold.red('Error:')} ${out.message}`))
        if (args.debug) {
          let stack = getStack(out)
          console.error(format(stack))
        }
      }
      else {
        let log = verbosity ? console.error : console.log
        log(format(out.string || out))
      }
    }
  }
  print.verbose = out => print(out, 'verbose')
  print.debug = out => print(out, 'debug')
  return print
}
module.exports = printer
