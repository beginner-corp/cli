let names = { en: [ 'gen', 'generate' ] }
let subcommands = [ 'scaffold', 'auth' ]
let help = require('./help').bind({}, subcommands)

async function action (params) {
  let subcommand = params.args._[1]
  if (subcommands.includes(subcommand)) {
    let generator = require(`./generators/${subcommand}`)
    let _inventory = require('@architect/inventory')
    params.inventory = await _inventory()
    let lib = require('../../lib')
    let utils = {
      // create: require('./_create')(params),
      // validate: require(`./_validate`)(params),
      ...lib,
      writeFile: lib.writeFile(params),
    }
    return generator.action(params, utils)
  }
  else {
    let err = Error('Please specify a generator type to run')
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
