let app = require('./app')
let create = require('./create')
let deploy = require('./deploy')
let destroy = require('./destroy')
let dev = require('./dev')
let init = require('./init')
let newResource = require('./new')
let generate = require('./generate')
let help = require('./help')
let list = require('./list')
let login = require('./login')
let update = require('./update')
let version = require('./version')
let commands = [ app, create, deploy, destroy, dev, generate, help, init, list, login, newResource, update, version ]

let helper = require('../helper')

module.exports = async function runCommand (params) {
  let { args, lang, printer } = params
  let { _ } = args
  if (_.includes('help')) {
    let i = _.findIndex(c => c === 'help')
    if (_.length > 1) _.splice(i, 1)
    args.help = true
  }
  let cmd = params.cmd = _[0]

  let { isTTY, columns, rows } = process.stdout
  printer.debug(
    `invocation\n` +
    `  which: ${process.argv[0]}\n` +
    `  args: ${JSON.stringify(args)}\n` +
    `  cmd: ${cmd}\n` +
    `  term: tty: ${!!(isTTY)}, ${columns} cols, ${rows} rows`
  )

  let getHelp = async help => typeof help === 'function' ? help(params) : help
  for (let command of commands) {
    let { names, action, help } = command
    // Some help output is generated dynamically
    if (names[lang].includes(cmd)) {
      printer.debug(
        'command\n' +
        `  names: ${names[lang]?.join(', ')}\n` +
        `  action: ${action ? true : false}\n` +
        `  help: ${help ? Object.keys(help).join(', ') : false}`,
      )
      if (args.help && help) {
        helper(params, await getHelp(help))
        return
      }
      try {
        let result = await action(params)
        printer(result)
        return
      }
      catch (err) {
        if (err.type === '__help__' && help) {
          printer(err)
          if (args.json) return
          helper(params, await getHelp(help))
          return
        }
        else throw err
      }
    }
  }
  // Fall back to main help if nothing else ran
  if (cmd) {
    printer(Error(`Unknown command: ${cmd}`))
  }
  if (!args.json) {
    helper(params)
  }
}
