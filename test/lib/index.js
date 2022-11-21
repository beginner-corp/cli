let { existsSync } = require('fs')
let { join } = require('path')
let inventory = require('@architect/inventory')

let begin = require('./_begin')
let capture = require('./_capture')
let sandbox = require('./_sandbox')
let tmp = require('./_tmp-dir')

// Unlike *nix systems, Windows mysteriously kept file handles open (EBUSY) after completing fs mutations
// So we have to rely on semi-random folders
let newFolder = name => join(tmp, `${name || 'tmp'}` + '-' + `${Date.now()}`.substr(5))

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
  defaultNoOfLambdas: 4,
  getInv,
  newFolder,
  run,
  sandbox,
  tmp,
}
