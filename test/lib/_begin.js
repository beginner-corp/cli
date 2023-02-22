let { join } = require('path')
let { exec: _exec } = require('child_process')
let { promisify } = require('util')
let { parseArgsStringToArgv: getArgs } = require('string-argv')
let exec = promisify(_exec)

let capture = require('./_capture')
let tmp = require('./_tmp-dir')

let cwd = process.cwd()
let isWin = process.platform.startsWith('win')
let mod = require(cwd)
let binPath = join(cwd, 'build', `begin${isWin ? '.exe' : ''}`)
let bin = join(binPath)

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

module.exports = {
  module: async (t, args, dir) => {
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
      code: process.exitCode
    }
  },
  binary: async (t, args, dir) => {
    let opts = { cwd: dir || tmp, shell: true }
    let cmd = `${bin} ${args} disableTelemetry`
    let result, code
    try {
      process.exitCode = 0
      result = await exec(cmd, opts)
      code = result.error?.code
    }
    catch (error) {
      result = error
      code = error?.code
    }
    reset(t)
    return {
      type: 'binary',
      stdout: result.stdout?.toString()?.trim(),
      stderr: result.stderr?.toString()?.trim(),
      code: code || 0,
    }
  },
}
