let names = { en: [ 'team', 'teams' ] }
let subcommands = [ 'list', 'invite', 'revoke', 'remove', 'role', 'accept', 'decline', 'leave' ]
let aliases = {
  ls: 'list',
}
let help = require('./help')

async function action (params) {
  let { args } = params
  let subcommand = args._[1]
  let alias = Object.keys(aliases).includes(subcommand) && aliases[subcommand]
  subcommand = alias || subcommand

  if (subcommands.includes(subcommand)) {
    let appAction = require(`./${subcommand}`)
    let _inventory = require('@architect/inventory')
    let client = require('@begin/api')
    params.inventory = await _inventory()
    let lib = require('../../lib')
    let { getAppID, getConfig } = lib

    let config = getConfig(params)
    if (!config.access_token) {
      let msg = 'You must be logged in to manage your team and team invites, please run: begin login'
      return Error(msg)
    }
    let { access_token: token, stagingAPI: _staging } = config

    let appID = getAppID(params.inventory, args)

    // Make sure the appID is valid
    try {
      var app
      // You can't find an app you haven't yet joined!
      let notYetJoined = [ 'accept', 'decline' ]
      if (!notYetJoined.includes(subcommand)) {
        app = await client.find({ token, appID, _staging })
      }
    }
    catch (err) {
      if (err.message === 'app_not_found') return Error(err.message)
      return err
    }

    let utils = { ...lib }
    return appAction({
      app,
      appID,
      config,
      ...params
    }, utils)
  }
  else {
    let err = Error('Please specify a team subcommand')
    if (subcommand) err = Error(`Invalid team subcommand: ${subcommand}`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
