let { existsSync } = require('fs')
let { join } = require('path')
let inventory = require('@architect/inventory')

let begin = require('./_begin')
let capture = require('./_capture')
let newTmpFolder = require('./_new-tmp-folder')
let { start, shutdown, getPort } = require('./_start-shutdown')
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

let defaultNumberOfLambdas = 4

async function getInv (t, cwd) {
  try {
    return inventory({ cwd })
  }
  catch (err) {
    t.fail(err)
  }
}

module.exports = {
  begin,
  capture,
  defaultNumberOfLambdas,
  getInv,
  getPort,
  newTmpFolder,
  run,
  shutdown,
  start,
  tmp,
}
