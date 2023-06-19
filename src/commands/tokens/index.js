let names = { en: [ 'tokens', 'token' ] }
let subcommands = [ 'list', 'create', 'revoke', ]
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
    params.inventory = await _inventory()
    let lib = require('../../lib')
    let { getConfig } = lib

    let config = getConfig(params)
    if (!config.access_token) {
      let msg = 'You must be logged in to manage your tokens, please run: begin login'
      return Error(msg)
    }

    let utils = { ...lib }
    return appAction({
      config,
      ...params
    }, utils)
  }
  else {
    let err = Error('Please specify a token subcommand')
    if (subcommand) err = Error(`Invalid token subcommand: ${subcommand}`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
