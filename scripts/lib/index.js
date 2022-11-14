let { join } = require('path')
let { readFile } = require('fs/promises')
let { execSync } = require('child_process')

let region = 'us-west-2'

async function getVersion () {
  let { DEPLOY } = process.env
  let isProd = DEPLOY === 'prod'

  if (isProd) {
    let pkg = join(__dirname, '..', '..', 'package.json')
    let version = JSON.parse(await readFile(pkg)).version
    if (!version.match(/^\d+.\d+.\d+$/)) {
      let msg = `Only production major, minor, or patch releases can be shipped (got: ${version})`
      throw ReferenceError(msg)
    }
    return version
  }
  else {
    let cmd = 'git rev-parse HEAD'
    let sha = execSync(cmd)
    let version = `main-${sha.toString().substr(0, 7)}`
    return version
  }
}

module.exports = {
  getVersion,
  region,
}
