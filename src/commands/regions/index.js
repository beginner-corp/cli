const names = { en: [ 'regions' ] }
const subcommands = [ 'list' ]
const aliases = { ls: 'list' }
const defaultCommand = 'list'
const help = require('./help').bind({})

async function action (params) {
  const { args } = params
  const { _ } = args
  let subcommand = _[1] || defaultCommand
  const alias = Object.keys(aliases).includes(subcommand) && aliases[subcommand]
  subcommand = alias || subcommand

  if (subcommands.includes(subcommand)) {
    const lib = require('../../lib')
    const { getConfig } = lib
    const { action } = require(`./${subcommand}`)

    const config = getConfig(params)
    return action({
      config,
      ...params,
    })
  }
  else {
    return help(params)
  }
}

module.exports = {
  names,
  action,
  help,
}
