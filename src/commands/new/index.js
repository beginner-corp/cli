let names = { en: [ 'new', 'gen', 'init' ] }
let subcommands = [ 'app', 'http', 'event', 'scheduled' ]
let help = require('./help').bind({}, subcommands)

async function action (params) {
  let { args, lang } = params
  let subcommand = args._[1]
  if (subcommands.includes(subcommand)) {
    let generator = require(`./generators/${subcommand}`)
    let _inventory = require('@architect/inventory')
    params.inventory = await _inventory()
    let lib = require('../../lib')
    let utils = {
      create: require('./_create'),
      validate: require(`./_validate`)(params.inventory, lang),
      ...lib,
      writeFile: lib.writeFile(params),
    }
    return generator.action(params, utils)
  }
  else throw Error('__help__')
}

module.exports = {
  names,
  action,
  help,
}
