let names = { en: [ 'gen', 'generate' ] }
let subcommands = [ 'api', 'auth', 'page', 'http', 'element', 'event', 'scaffold', 'scheduled' ]
let help = require('./help').bind({}, subcommands)

async function action (params) {
  let subcommand = params.args._[1]
  if (subcommands.includes(subcommand)) {
    let generator = require(`./generators/${subcommand}`)
    let _inventory = require('@architect/inventory')
    params.inventory = await _inventory()
    let lib = require('../../lib')
    let utils = {
      ...lib,
      create: require('./_create')(params),
      validate: require(`./_validate`)(params),
      writeFile: lib.writeFile(params),
    }
    return generator.action(params, utils, subcommand)
  }
  else {
    let err = Error('Please specify a generator to run')
    if (subcommand) err = Error(`Invalid generator type: ${subcommand}`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
