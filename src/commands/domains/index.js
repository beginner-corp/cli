let names = { en: [ 'domains' ] }
let subcommands = [ 'list', 'add', 'remove', 'link', 'unlink' ]
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
let appIdRequired = {
  list: false,
  add: false,
  remove: true,
  link: true,
  unlink: true,
}
let help = require('./help').bind({})

async function action (params) {
  let { args } = params
  let { verbose } = args
  let subcommand = args._[1] || defaultCommand
  let alias = Object.keys(aliases).includes(subcommand) && aliases[subcommand]
  subcommand = alias || subcommand

  if (subcommands.includes(subcommand)) {
    let _inventory = require('@architect/inventory')
    let { getConfig, getAppID } = require('../../lib')
    let { action } = require(`./${subcommand}`)

    let config = getConfig(params)
    if (!config.access_token)
      return Error('You must be logged in, please run: begin login')

    params.inventory = await _inventory()

    let appID = getAppID(params.inventory, args, appIdRequired[subcommand])
    let env = args.env || args.e
    let domain = args.domain

    return action({ config, appID, env, domain, verbose, ...params })
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
