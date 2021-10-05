let stripAnsi = require('strip-ansi')
let { BEGIN_NO_COLOR, NO_COLOR, TERM } = process.env
let isTTY = !!(process.stdout.isTTY)
let stripEntries = (([ k, v ]) => [ stripAnsi(k), stripAnsi(v) ])

// Per clig.dev: stdout is for piping to other apps; stderr is for userland
//   https://clig.dev/#the-basics
function printer (params, out, verboseOrDebug) {
  let { args } = params

  // TODO: this should probably be more nuanced based on stdout vs stderr, TTY state, etc.
  if (args.quiet) return

  if (args.json && !verboseOrDebug) {
    let missing = { message: 'No JSON output for this command' }
    let output = out.json
      ? Object.fromEntries(Object.entries(out.json).map(stripEntries))
      : missing
    let log = output.error ? console.error : console.log
    log(JSON.stringify(output, null, 2))
  }
  else {
    let noColor = BEGIN_NO_COLOR || NO_COLOR || !isTTY || TERM === 'dumb' || args['no-color']
    if (out.stdout) {
      console.log(noColor ? stripAnsi(out.stdout) : out.stdout)
    }
    if (out.stderr) {
      console.error(noColor ? stripAnsi(out.stderr) : out.stderr)
    }
  }
}

printer.verbose = function (params, stderr) {
  let { args } = params
  let { verbose, debug } = args
  if (verbose || debug) printer(params, { stderr }, true)
}
printer.debug = function (params, stderr) {
  let { args } = params
  let { debug } = args
  if (debug) printer(params, { stderr }, true)
}

module.exports = printer
