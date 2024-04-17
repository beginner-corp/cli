let inventory = require('@architect/inventory')

let begin = require('./_begin')
let capture = require('./_capture')
let newTmpFolder = require('./_new-tmp-folder')
let { start, shutdown, getPort } = require('./_start-shutdown')
let tmp = require('./_tmp-dir')

let defaultNumberOfLambdas = 5

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
  shutdown,
  start,
  tmp,
}
