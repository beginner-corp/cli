let names = { en: [ 'generate', 'gen' ] }
let subcommands = [ 'api', 'auth', 'element', 'event', 'http', 'page', 'scaffold', 'scheduled' ]
let help = require('./help').bind({}, subcommands)
let { action } = require('@enhance/cli/src/commands/generate/index')

module.exports = {
  names,
  action,
  help,
}
