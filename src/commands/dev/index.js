let names = [ 'dev', 'sandbox', 'start' ]
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
    return {
      stderr: error,
      json: { error }
    }
  }

  let { cli } = require('@architect/sandbox')
  let { debug, quiet, verbose } = args
  // TODO: output Sandbox start via printer
  let logLevel = debug ? 'debug' : undefined || verbose ? 'verbose' : undefined
  console.log(c.blue.bold(`Begin dev server (${appVersion})`) + '\n')
  await cli({
    inventory,
    logLevel,
    quiet,
    symlink: args['disable-symlinks'],
    disableBanner: true,
  })
}

module.exports = {
  names,
  action,
  help,
}
