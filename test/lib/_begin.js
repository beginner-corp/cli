let { parseArgsStringToArgv: getArgs } = require('string-argv')

let capture = require('./_capture')
let tmp = require('./_tmp-dir')

let cwd = process.cwd()
let mod = require(cwd)

let argv = process.argv
let json = i => JSON.stringify(i)
let disableTelemetry = '--disable-telemetry'

function reset (t) {
  process.chdir(cwd)
  if (process.cwd() !== cwd) t.fail('process.cwd not correctly reset')

  process.argv = argv
  if (json(process.argv) !== json(argv)) t.fail('process.argv not correctly reset')

  capture.reset()
}

module.exports = async (t, args, dir) => {
  process.chdir(dir || tmp)
  process.argv = [ 'fake-env', 'fake-file', ...getArgs(args), disableTelemetry ]
  process.exitCode = 0
  capture.start()
  await mod()
  capture.stop()
  let { stdout, stderr } = capture
  reset(t)
  return {
    type: 'module',
    stdout: stdout.trim(),
    stderr: stderr.trim(),
    code: process.exitCode,
  }
}
