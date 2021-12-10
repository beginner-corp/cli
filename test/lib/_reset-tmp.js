let { existsSync } = require('fs')
let { sync: rm } = require('rimraf')

let tmp = require('./_tmp-dir')

module.exports = function resetTmp (t) {
  rm(tmp)
  if (existsSync(tmp)) t.fail(`${tmp} not destroyed`)
}
