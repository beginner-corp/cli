let dev = require('./dev')
let init = require('./new')
let help = require('./help')
let update = require('./update')
let version = require('./version')
let commands = [ dev, init, help, update, version ]

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

  for (let command of commands) {
    let { names, action, help } = command
    // Some help output is generated dynamically
    let getHelp = async () => typeof help === 'function' ? help(params) : help
    printer.debug(
      'command\n' +
      `  names: ${names[lang]?.join(', ')}\n` +
      `  action: ${action ? true : false}\n` +
      `  help: ${help ? Object.keys(help).join(', ') : false}`,
    )
    if (names[lang].includes(cmd) && args.help && help) {
      help = await getHelp()
      helper(params, help)
      return
    }
    else if (names[lang].includes(cmd)) {
      try {
        let result = await action(params)
        printer(result)
        return
      }
      catch (err) {
        if (err.message === '__help__' && help) {
          err.message = `Invalid parameter: ${args._[1]}`
          printer(err)
          help = await getHelp()
          helper(params, help)
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
