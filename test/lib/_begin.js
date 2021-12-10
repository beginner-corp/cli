let { existsSync, mkdirSync } = require('fs')
let { join } = require('path')
let { exec: _exec } = require('child_process')
let { promisify } = require('util')
let exec = promisify(_exec)

let capture = require('./_capture')
let tmp = require('./_tmp-dir')
let resetTmp = require('./_reset-tmp')

let cwd = process.cwd()
let isWin = process.platform.startsWith('win')
let mod = require(cwd)
let binPath = join(cwd, 'build', `begin${isWin ? '.exe' : ''}`)
let bin = join(binPath)

let argv = process.argv
let json = i => JSON.stringify(i)
let getArgs = str => [ ...str.split(' ').filter(Boolean) ]

function setup (t) {
  process.exitCode = 0
  resetTmp(t)
  mkdirSync(tmp, { recursive: true })
  if (!existsSync(tmp)) t.fail(`Failed to create ${tmp}`)
}

function reset (t) {
  process.chdir(cwd)
  if (process.cwd() !== cwd) t.fail('process.cwd not correctly reset')

  process.argv = argv
  if (json(process.argv) !== json(argv)) t.fail('process.argv not correctly reset')

  capture.reset()
}

module.exports = {
  module: async (t, args) => {
    setup(t)
    process.chdir(tmp)
    process.argv = [ 'fake-env', 'fake-file', ...getArgs(args) ]
    capture.start()
    await mod()
    capture.stop()
    let { stdout, stderr } = capture
    reset(t)
    return {
      type: 'module',
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      status: process.exitCode
    }
  },
  binary: async (t, args) => {
    setup(t)
    let opts = { cwd: tmp, shell: true }
    let cmd = `${bin} ${args}`
    let result, status
    try {
      result = await exec(cmd, opts)
      status = result.error?.code
    }
    catch (error) {
      result = error
      status = error?.code
    }
    reset(t)
    return {
      type: 'binary',
      stdout: result.stdout?.toString()?.trim(),
      stderr: result.stderr?.toString()?.trim(),
      status: status || 0,
    }
  },
}
