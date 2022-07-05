let names = { en: [ 'deploy' ] }
let help = require('./help')
let appAction = require('../app/deploy')
let _inventory = require('@architect/inventory')
let lib = require('../../lib')

async function action (params) {
  let { args } = params
  params.inventory = await _inventory()
  let { checkManifest, getCreds } = lib

  let token = getCreds(params)
  if (!token) {
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
    envName,
    token,
    ...params
  }, utils)
}

module.exports = {
  names,
  action,
  help,
}
