let names = { en: [ 'dev', 'sandbox', 'start' ] }
let help = require('./help')
let c = require('picocolors')

async function action (params) {
  let { appVersion, args } = params

  let _inventory = require('@architect/inventory')
  let inventory = await _inventory()
  if (!inventory.inv._project.manifest) {
    let message = `No Begin project found! To create one, run: ${c.white(c.bold('begin new app'))}`
    return Error(message)
  }

  let { cli } = require('@architect/sandbox')
  let { debug, quiet, verbose } = args
  // TODO: output Sandbox start via printer
  let logLevel = debug ? 'debug' : undefined || verbose ? 'verbose' : undefined
  console.error(c.blue(c.bold(`Begin dev server (${appVersion})`) + '\n'))
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
