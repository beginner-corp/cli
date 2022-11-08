let { existsSync, mkdirSync, rmSync } = require('fs')
let { copySync: copy } = require('fs-extra')
let { join } = require('path')
let { exec: _exec } = require('child_process')
let { promisify } = require('util')
let { parseArgsStringToArgv: getArgs } = require('string-argv')
let exec = promisify(_exec)

let capture = require('./_capture')
let tmp = require('./_tmp-dir')

let cwd = process.cwd()
let enhancePlugin = join('node_modules', '@enhance', 'arc-plugin-enhance')
let isWin = process.platform.startsWith('win')
let mod = require(cwd)
let binPath = join(cwd, 'build', `begin${isWin ? '.exe' : ''}`)
let bin = join(binPath)

let argv = process.argv
let json = i => JSON.stringify(i)

function setup (t, dir, reuse, options) {
  process.exitCode = 0
  if (!reuse) {
    // Best effort to clean up the tmp dir; Windows + Node.js 18 mysteriously breaks
    try {
      rmSync(tmp, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 })
    }
    catch (err) {
      if (process.platform.startsWith('win') &&
          process.versions.node.startsWith('18')) { /* noop */ }
      else {
        console.log('Test cleanup error!')
        t.fail(err)
      }
    }
  }
  mkdirSync(tmp, { recursive: true })
  if (!existsSync(tmp)) t.fail(`Failed to create ${tmp}`)
  if (dir && !reuse) {
    if (!dir.startsWith(tmp)) t.fail(`Must specify a path within ${tmp}`)
    if (existsSync(dir)) t.fail(`Found existing tmp dir: ${dir}`)
    mkdirSync(dir, { recursive: true })
    if (!existsSync(dir)) t.fail(`Failed to create ${dir}`)

    // The Enhance Arc plugin is necessary for starting Sandbox in test runs
    let dest = options?.dest || dir
    copy(join(cwd, enhancePlugin), join(dest, enhancePlugin))
  }
}

function reset (t) {
  process.chdir(cwd)
  if (process.cwd() !== cwd) t.fail('process.cwd not correctly reset')

  process.argv = argv
  if (json(process.argv) !== json(argv)) t.fail('process.argv not correctly reset')

  capture.reset()
}

module.exports = {
  module: async (t, args, dir, reuse, options) => {
    setup(t, dir, reuse, options)
    process.chdir(dir || tmp)
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
      code: process.exitCode
    }
  },
  binary: async (t, args, dir, reuse, options) => {
    setup(t, dir, reuse, options)
    let opts = { cwd: dir || tmp, shell: true }
    let cmd = `${bin} ${args}`
    let result, code
    try {
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
