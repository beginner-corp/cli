let names = { en: [ 'new', 'gen' ] }
let subcommands = [ 'project', 'http', 'event', 'scheduled' ]
let help = require('./help').bind({}, subcommands)

async function runAction (actionName, params) {
  let generator = require(`./generators/${actionName}`)
  let _inventory = require('@architect/inventory')
  params.inventory = await _inventory()
  let lib = require('../../lib')
  let utils = {
    create: require('./_create')(params),
    validate: require(`./_validate`)(params),
    ...lib,
    writeFile: lib.writeFile(params),
  }
  return generator.action(params, utils)
}

async function action (params) {
  let subcommand = params.args._[1]
  if (subcommands.includes(subcommand)) {
    return runAction(subcommand, params)
  }
  else {
    let err = Error('Please specify a resource type to create')
    if (subcommand) err = Error(`Please specify a resource type to create`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
