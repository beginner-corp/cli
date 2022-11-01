let names = { en: [ 'destroy' ] }
let help = require('./help')

async function action (params) {
  let { args } = params
  let action = require('./action')
  let _inventory = require('@architect/inventory')
  let lib = require('../../lib')
  let { getAppID, getConfig } = lib
  params.inventory = await _inventory()

  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to deploy to Begin, please run: begin login'
    return Error(msg)
  }

  // Populate any specified app / environment IDs
  let appID = args.app || args.a || getAppID(params.inventory)
  appID = appID !== true && appID || undefined
  let env = args.env || args.e

  if (!appID) return Error('Please specify an app ID to destroy')

  let utils = {
    ...lib,
    writeFile: lib.writeFile(params),
  }
  return action({
    appID,
    env,
    config,
    ...params
  }, utils)
}

module.exports = {
  names,
  action,
  help,
}
