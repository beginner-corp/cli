let names = { en: [ 'init' ] }
let help = require('./help')
let lib = require('../../lib')
let generator = require('../new/generators/project')
let _inventory = require('@architect/inventory')

async function action (params) {
  params.inventory = await _inventory()
  let utils = {
    create: require('../new/_create')(params),
    validate: require(`../new/_validate`)(params),
    ...lib,
    writeFile: lib.writeFile(params),
  }
  return generator.action(params, utils)
}

module.exports = {
  names,
  action,
  help,
}
