let { existsSync } = require('fs')
let { join } = require('path')

let begin = require('./_begin')
let capture = require('./_capture')
let tmp = require('./_tmp-dir')

// Integration test runner
let bin = join(process.cwd(), 'build', `begin${process.platform.startsWith('win') ? '.exe' : ''}`)
let run = async (runTests, t) => {
  if (!process.env.BINARY_ONLY) {
    await runTests('module', t)
  }
  if (!process.env.MODULE_ONLY && existsSync(bin)) {
    await runTests('binary', t)
  }
}

module.exports = {
  begin,
  capture,
  run,
  tmp,
}
