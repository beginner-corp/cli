let { existsSync, mkdirSync, writeFileSync } = require('fs')
let { dirname, join } = require('path')
let getRelativeCwd = require('./get-relative-cwd')

let messages = {
  en: {
    created_file: str => `Created file: ${str}`,
    updated_file: str => `Updated file: ${str}`,
  }
}

module.exports = function writeFile (params) {
  return function (path, contents) {
    if (!path.startsWith(process.cwd())) path = join(process.cwd(), path)
    let { lang, printer } = params
    let exists = existsSync(path)
    let dir = dirname(path)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(path, contents)
    let message = exists
      ? messages[lang].updated_file(getRelativeCwd(path))
      : messages[lang].created_file(getRelativeCwd(path))
    printer.verbose(message)
  }
}
