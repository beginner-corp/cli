let help = require('./help')
let names = { en: [ 'domains' ] }
let subcommands = [ 'list', 'check', 'link', 'unlink' ]
let aliases = {
  add: 'check',
  associate: 'link',
  disassociate: 'unlink',
  ls: 'list',
}
let defaultCommand = 'list'

async function action (params) {
  let { args } = params
  let subcommand = args._[1] || defaultCommand
  let alias = Object.keys(aliases).includes(subcommand) && aliases[subcommand]
  subcommand = alias || subcommand

  if (subcommands.includes(subcommand)) {
    let _inventory = require('@architect/inventory')
    let { domains } = require('@begin/api')
    let { getConfig } = require('../../lib')
    let { action } = require(`./${subcommand}`)

    let inventory = await _inventory()

    let config = getConfig(params)
    if (!config.access_token)
      return Error('You must be logged in, please run: begin login')

    return action({ domains, config, inventory, ...params })
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
