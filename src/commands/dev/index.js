let names = { en: [ 'dev', 'sandbox', 'start' ] }
let help = require('./help')
let c = require('picocolors')

async function action (params) {
  let { appVersion, args } = params
  let { checkManifest } = require('../../lib')

  let _inventory = require('@architect/inventory')
  let inventory = await _inventory()
  let manifestErr = checkManifest(inventory)
  if (manifestErr) return manifestErr

  let cli = require('@architect/sandbox/src/cli')
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
