let { existsSync, mkdirSync, realpathSync, rmSync } = require('fs')
let os = require('os')
let { join } = require('path')
let { copySync } = require('fs-extra')
let tmp = require('./_tmp-dir')

let cwd = process.cwd()
let enhancePlugin = join('node_modules', '@enhance', 'arc-plugin-enhance')

let folderName = name => `${name || 'tmp'}` + '-' + `${Date.now()}`.substr(5)

// Unlike *nix systems, Windows mysteriously keeps file handles open (EBUSY) after completing fs mutations, so we have to rely on semi-random folders
module.exports = function newTmpFolder (t, dest, options = {}) {
  let { copy } = options
  let slowMode = process.env.__SLOW__
  let tmpDir = slowMode ? realpathSync(os.tmpdir()) : tmp
  let dir = join(tmpDir, folderName(dest))

  if (!slowMode) {
    // Best effort to clean up the tmp dir; Windows + Node.js 18 mysteriously breaks
    try {
      rmSync(tmpDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 })
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

  if (existsSync(dir)) t.fail(`Found existing tmp dir: ${dir}`)
  mkdirSync(dir, { recursive: true })
  if (!existsSync(dir)) t.fail(`Failed to create tmp dir: ${dir}`)

  // The Enhance Arc plugin is necessary for starting Sandbox in test runs
  let copyDest = copy ? join(dir, copy) : dir
  copySync(join(cwd, enhancePlugin), join(copyDest, enhancePlugin))

  return dir
}
