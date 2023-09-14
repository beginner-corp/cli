let names = { en: [ 'dev', 'sandbox', 'start' ] }
let help = require('./help')
let { action } = require('@enhance/cli/src/commands/dev/index')

module.exports = {
  names,
  action,
  help,
}
