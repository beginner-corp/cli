let names = { en: [ 'app', 'apps' ] }
let subcommands = [ 'create', 'deploy', 'destroy', 'list' ]
let help = require('./help').bind({}, subcommands)

async function action (params) {
  let { args } = params
  let subcommand = args._[1]
  if (subcommands.includes(subcommand)) {
    let appAction = require(`./${subcommand}`)
    let _inventory = require('@architect/inventory')
    params.inventory = await _inventory()
    let lib = require('../../lib')
    let { checkManifest, getConfig } = lib

    let config = getConfig(params)
    if (!config.access_token) {
      let msg = 'You must be logged in to deploy to Begin, please run: begin login'
      return Error(msg)
    }

    let manifestErr = checkManifest(params.inventory)
    if (manifestErr && !appAction.manifestNotNeeded) return manifestErr

    // See if the project manifest contains an app ID
    let { begin } = params.inventory.inv._project.arc
    let appID = begin?.find(i => i[0] === 'appID' && typeof i[1] === 'string')?.[1]

    // Pass along any specified environment IDs
    let env = args.env || args.e
    let envName = env !== true && env || undefined

    let utils = {
      ...lib,
      writeFile: lib.writeFile(params),
    }
    return appAction.action({
      appID,
      config,
      envName,
      ...params
    }, utils)
  }
  else {
    let err = Error('Please specify an app subcommand')
    if (subcommand) err = Error(`Invalid app subcommand: ${subcommand}`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
