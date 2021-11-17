let names = { en: [ 'dev', 'sandbox', 'start' ] }
let help = require('./help')
let c = require('chalk')

async function action (params) {
  let { appVersion, args } = params

  let _inventory = require('@architect/inventory')
  let inventory = await _inventory()
  let { inv } = inventory
  if (!inv._project.manifest) {
    process.exitCode = 1
    let error = `No Begin project found! To create one, run: ${c.white.bold('begin new app')}`
    return error
  }

  let { cli } = require('@architect/sandbox')
  let { debug, quiet, verbose } = args
  // TODO: output Sandbox start via printer
  let logLevel = debug ? 'debug' : undefined || verbose ? 'verbose' : undefined
  console.error(c.blue.bold(`Begin dev server (${appVersion})`) + '\n')
  await cli({
    disableBanner: true,
    inventory,
    logLevel,
    needsValidCreds: false,
    quiet,
    runtimeCheck: 'warn',
    symlink: args['disable-symlinks'],
  })
}

module.exports = {
  names,
  action,
  help,
}
