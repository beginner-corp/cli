module.exports = function pager (params, output) {
  let { args, isCI } = params
  let { debug } = args
  let c = require('picocolors')
  let banner = c.bold(c.white(`–––––––––– Press q to exit log view ––––––––––`)) + '\n\n'

  let isWin = process.platform.startsWith('win')
  if (isCI || debug) return output
  else if (isWin) {
    // Unlike *nix, Windows only comes bundled with `more` + `echo` (vs. `less` + `printf`)
    // Also: `echo` doesn't support line breaks, meaning it must be run per-line, yikes
    // Thus, the cleanest Windows implementation is to just write to disk
    let { spawnSync } = require('child_process')
    let { join } = require('path')
    let { writeFileSync } = require('fs')

    let tmp = require('tmp')
    let tmpDir = tmp.dirSync({ unsafeCleanup: true })
    let { name: dir } = tmpDir
    let file = join(dir, 'log.txt')
    let data = banner + output
    writeFileSync(file, data)
    spawnSync(`more "${file}"`, { shell: true, stdio: 'inherit' })
    tmpDir.removeCallback()
  }
  else {
    let { spawnSync } = require('child_process')
    let tidy = output
      .replace(/(["'$`\\])/g, '\\$1')
      .replace(/\%/g, '%%')
    spawnSync(`printf "${banner}${tidy}" | less -FRc`, { shell: true, stdio: 'inherit' })
  }
}
