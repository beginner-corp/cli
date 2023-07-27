let names = { en: [ 'domains' ] }
let subcommands = [ 'list', 'add', 'remove', 'link', 'unlink', 'records' ]
let aliases = {
  ls: 'list',
  buy: 'add',
  check: 'add',
  subscribe: 'add',
  cancel: 'remove',
  rm: 'remove',
  alias: 'link',
  associate: 'link',
  disassociate: 'unlink',
  unalias: 'unlink',
}
let defaultCommand = 'list'
let help = require('./help').bind({})

async function action (params) {
  let { args } = params
  let { domain, env, verbose, _ } = args
  let subcommand = _[1] || defaultCommand
  let alias = Object.keys(aliases).includes(subcommand) && aliases[subcommand]
  subcommand = alias || subcommand
  env = env || args.e

  if (subcommands.includes(subcommand)) {
    let _inventory = require('@architect/inventory')
    let { getConfig, getAppID } = require('../../lib')
    let { action } = require(`./${subcommand}`)

    let config = getConfig(params)
    if (!config.access_token)
      return Error('You must be logged in, please run: begin login')

    let inventory = await _inventory()
    let appID
    try {
      appID = getAppID(inventory, args)
    }
    catch (e) {
      appID = null
    }

    return action({ config, appID, env, domain, verbose, inventory, ...params })
  }
  else {
    let err = new Error('Please specify an domains subcommand')
    if (subcommand) err = new Error(`Invalid domains subcommand: ${subcommand}`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
