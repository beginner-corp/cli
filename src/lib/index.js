let backtickify = a => a.map(s => '`' + s + '`').join(', ')

function checkManifest (inventory) {
  let c = require('picocolors')
  if (!inventory.inv._project.manifest) {
    let message = `No Begin project found! To create one, run: ${c.white(c.bold('begin new project'))}`
    return Error(message)
  }
  let { parse } = require('path')
  let { base, ext } = parse(inventory.inv._project.manifest)
  if (base !== '.arc' && ext !== '.arc') {
    let message = `Begin CLI only supports app.arc and .arc project manifests`
    return Error(message)
  }
}

// See if the project manifest contains an app ID
function getAppID (inventory) {
  let { begin } = inventory.inv._project.arc
  let appID = begin?.find(i => i[0] === 'appID' && typeof i[1] === 'string')?.[1]
  return appID
}

let config
// Get Begin API creds and related config
function getConfig (params, print = true) {
  if (config && !params._refresh) return config

  function done (via) {
    if (print && config.stagingAPI) printer(`Begin staging enabled`)
    if (print && config.access_token) printer.debug(`Using Begin token via ${via}`)
    return config
  }

  let { existsSync, readFileSync } = require('fs')
  let { join } = require('path')
  let { cliDir, printer } = params
  let configPath = join(cliDir, 'config.json')

  // Local config file wins over env vars
  if (!existsSync(configPath)) {
    let { BEGIN_TOKEN, BEGIN_STAGING_API } = process.env
    let result = {
      access_token: BEGIN_TOKEN,
      stagingAPI: BEGIN_STAGING_API ? true : undefined,
    }
    config = result.access_token ? result : {}
    return done('environment variable')
  }
  try {
    let result = JSON.parse(readFileSync(configPath))
    config = result
    return done('config file')
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

let mutateArc = require('./mutate-arc')

let npmCommands = require('./npm-commands')

let pager = require('./pager')

let runtimes = [ 'node', 'deno', 'ruby', 'python' ]

let spinner = require('./spinner')

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
  getAppID,
  getConfig,
  getRelativeCwd,
  httpMethods,
  mutateArc,
  npmCommands,
  pager,
  runtimes,
  spinner,
  writeFile,
}
