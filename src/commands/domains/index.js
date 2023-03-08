let help = require('./help')
let names = { en: [ 'domains' ] }
let subcommands = [ 'list', 'add', 'remove', 'link', 'unlink' ]
let aliases = {
  ls: 'list',
  check: 'add',
  rm: 'remove',
  cancel: 'remove',
  alias: 'link',
  associate: 'link',
  unalias: 'unlink',
  disassociate: 'unlink',
}
let defaultCommand = 'list'

async function action (params) {
  let { args } = params
  let subcommand = args._[1] || defaultCommand
  let alias = Object.keys(aliases).includes(subcommand) && aliases[subcommand]
  subcommand = alias || subcommand

  if (subcommands.includes(subcommand)) {
    let _inventory = require('@architect/inventory')
    let { getConfig, getAppID } = require('../../lib')
    let { action } = require(`./${subcommand}`)

    let inventory = await _inventory()

    let config = getConfig(params)
    if (!config.access_token)
      return Error('You must be logged in, please run: begin login')

    let appID = args.app || args.a || getAppID(inventory)
    let env = args.env || args.e
    let domain = args.domain

    return action({ config, inventory, appID, env, domain, ...params })
  }
  else {
    let err = Error('Please specify an domains subcommand')
    if (subcommand) err = Error(`Invalid domains subcommand: ${subcommand}`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
