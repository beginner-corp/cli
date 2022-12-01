let { existsSync, mkdirSync, rmSync } = require('fs')
let { join } = require('path')
let { copySync: copy } = require('fs-extra')
let tmp = require('./_tmp-dir')

let cwd = process.cwd()
let enhancePlugin = join('node_modules', '@enhance', 'arc-plugin-enhance')

module.exports = function setup (t, dir, reuse, options) {
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
