let stripAnsi = require('strip-ansi')
let { BEGIN_NO_COLOR, NO_COLOR, TERM } = process.env
let isTTY = !!(process.stdout.isTTY)
let stripEntries = (([ k, v ]) => [ stripAnsi(k), stripAnsi(v) ])

// Per clig.dev: stdout is for piping to other apps; stderr is for userland
//   https://clig.dev/#the-basics
function printer (params, out, verboseOrDebug) {
  let { args } = params
  let isError = process.exitCode !== 0

  // TODO: this should probably be more nuanced based on stdout vs stderr, TTY state, etc.
  if (args.quiet) return

  if (args.json && !verboseOrDebug) {
    let missing = { message: 'No JSON output for this command' }
    let output
    if (isError) output = { error: stripAnsi(out) }
    else output = out.json
      ? Object.fromEntries(Object.entries(out.json).map(stripEntries))
      : missing
    let log = isError ? console.error : console.log
    log(JSON.stringify(output, null, 2))
  }
  else {
    let noColor = BEGIN_NO_COLOR || NO_COLOR || !isTTY || TERM === 'dumb' || args['no-color']
    let format = output => noColor ? stripAnsi(output) : output
    if (out.stdout) {
      console.log(format(out.stdout))
    }
    if (out.stderr) {
      console.error(format(out.stderr))
    }
    if (isError && out && !out.stdout && !out.stderr) {
      console.error(format(out))
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
