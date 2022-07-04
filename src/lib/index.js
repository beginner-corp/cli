let backtickify = a => a.map(s => '`' + s + '`').join(', ')

function checkManifest (inventory) {
  let c = require('picocolors')
  if (!inventory.inv._project.manifest) {
    let message = `No Begin project found! To create one, run: ${c.white(c.bold('begin new project'))}`
    return Error(message)
  }
  let { parse } = require('path')
  let { ext } = parse(inventory.inv._project.manifest)
  if (ext !== '.arc') {
    let message = `Begin CLI only supports app.arc project manifests`
    return Error(message)
  }
}

function getCreds (params) {
  let { existsSync, readFileSync } = require('fs')
  let { join } = require('path')
  let { cliDir, printer } = params
  let configPath = join(cliDir, 'config.json')
  if (!existsSync(configPath)) return false
  try {
    let { access_token } = JSON.parse(readFileSync(configPath))
    if (!access_token) return false
    return access_token
  }
  catch (err) {
    printer(err)
  }
}

function getRelativeCwd (path) {
  let { sep } = require('path')
  path = path.replace(process.cwd(), '')
  path = path.startsWith(sep) ? path.substr(1) : path
  return path
}

let httpMethods = [ 'get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'any' ]

let runtimes = [ 'node', 'deno', 'ruby', 'python' ]

let mutateArc = require('./mutate-arc')

function writeFile (params) {
  let { existsSync, mkdirSync, writeFileSync } = require('fs')
  let { dirname, isAbsolute, join } = require('path')
  let messages = {
    en: {
      created_file: str => `Created file: ${str}`,
      updated_file: str => `Updated file: ${str}`,
    }
  }

  return function (path, contents) {
    if (!isAbsolute(path)) path = join(process.cwd(), path)
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

module.exports = {
  backtickify,
  checkManifest,
  getCreds,
  getRelativeCwd,
  httpMethods,
  mutateArc,
  runtimes,
  writeFile,
}
