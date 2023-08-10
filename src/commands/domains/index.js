const names = { en: [ 'domains' ] }
const subcommands = [ 'list', 'add', 'remove', 'link', 'unlink', 'records' ]
const aliases = {
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
const defaultCommand = 'list'
const help = require('./help').bind({})

async function action (params) {
  const { args } = params
  let { domain, env, verbose, yes, _ } = args
  let subcommand = _[1] || defaultCommand
  const alias = Object.keys(aliases).includes(subcommand) && aliases[subcommand]
  subcommand = alias || subcommand
  env = env || args.e
  yes = yes || args.y

  if (subcommands.includes(subcommand)) {
    const _inventory = require('@architect/inventory')
    const { getConfig, getAppID } = require('../../lib')
    const { action } = require(`./${subcommand}`)

    const config = getConfig(params)
    if (!config.access_token)
      return Error('You must be logged in, please run: begin login')

    const inventory = await _inventory()
    let appID
    try {
      appID = getAppID(inventory, args)
    }
    catch (e) {
      appID = null
    }

    return action({ config, appID, env, domain, verbose, yes, inventory, ...params })
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
