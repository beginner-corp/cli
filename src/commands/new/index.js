let names = [ 'new', 'gen', 'init' ]
let subcommands = [ 'app', 'http', 'event', 'scheduled' ]
let help = require('./help').bind({}, subcommands)

async function action (params) {
  let { args } = params
  let subcommand = args._[1]
  if (subcommands.includes(subcommand)) {
    let generator = require(`./generators/${subcommand}`)
    return generator.action(params)
  }
  else throw Error('__help__')
}

module.exports = {
  names,
  action,
  help,
}
