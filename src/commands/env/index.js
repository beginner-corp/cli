let names = { en: [ 'env' ] }
let subcommands = [ 'create', 'destroy', 'list' ]
let aliases = {
  delete: 'destroy',
  remove: 'destroy',
  ls: 'list',
}
let help = require('./help').bind({}, subcommands)

async function action (params) {
  let { args } = params
  let subcommand = args._[1]
  let alias = Object.keys(aliases).includes(subcommand) && aliases[subcommand]
  subcommand = alias || subcommand

  if (subcommands.includes(subcommand)) {
    let appAction = require(`./${subcommand}`)
    let _inventory = require('@architect/inventory')
    let client = require('@begin/api')
    let error = require('./errors')(params)
    params.inventory = await _inventory()
    let lib = require('../../lib')
    let { checkManifest, getAppID, getConfig } = lib

    let config = getConfig(params)
    if (!config.access_token) {
      let msg = 'You must be logged in to interact with environment variables, please run: begin login'
      return Error(msg)
    }
    let { access_token: token, stagingAPI: _staging } = config

    let manifestErr = checkManifest(params.inventory)
    if (manifestErr && !appAction.manifestNotNeeded) return manifestErr

    let appID = args.app || args.a || getAppID(params.inventory)
    if (!appID) return Error('Please specify an appID')

    // Make sure the appID is valid
    try {
      var app = await client.find({ token, appID, _staging })
    }
    catch (err) {
      if (err.message === 'app_not_found') return error(err.message)
      return err
    }

    let utils = {
      ...lib,
      writeFile: lib.writeFile(params),
    }
    return appAction.action({
      app,
      appID,
      config,
      ...params
    }, utils)
  }
  else {
    let err = Error('Please specify an env subcommand')
    if (subcommand) err = Error(`Invalid env subcommand: ${subcommand}`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
