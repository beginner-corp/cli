let names = { en: [ 'create' ] }
let help = require('./help')

async function action (params) {
  let { args } = params
  let action = require('./action')
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
  if (manifestErr) return manifestErr

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
  return action({
    appID,
    envName,
    config,
    ...params
  }, utils)
}

module.exports = {
  names,
  action,
  help,
}
