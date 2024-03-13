let names = { en: [ 'deploy' ] }
let help = require('./help')

async function action (params) {
  let { args } = params
  let deploy = require('./action')
  let _inventory = require('@architect/inventory')
  params.inventory = await _inventory()
  let lib = require('../../lib')
  let { checkManifest, getAppID, getConfig } = lib

  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to deploy to Begin, please run: begin login'
    console.log(msg)
    return Error(msg)
  }
  console.log('got access token')

  let manifestErr = checkManifest(params.inventory)
  if (manifestErr) return manifestErr
  console.log('manifest fine')

  let appID
  try {
    appID = getAppID(params.inventory, args)
    console.log('appID', appID)
  }
  catch (error) {
    console.log('no appID', error)
    appID = null
  }

  // Pass along any specified environment IDs
  let env = args.env || args.e
  let envName = env !== true && env || undefined

  console.log('call deploy')

  let utils = {
    ...lib,
    writeFile: lib.writeFile(params),
  }
  return deploy({
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
