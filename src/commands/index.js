let dev = require('./dev')
let init = require('./new')
let help = require('./help')
let version = require('./version')
let commands = [ dev, init, help, version ]

let helper = require('../helper')
let printer = require('../printer')

module.exports = async function runCommand (params) {
  let { args } = params
  let { _ } = args
  if (_.includes('help')) {
    let i = _.findIndex(c => c === 'help')
    if (_.length > 1) _.splice(i, 1)
    args.help = true
  }
  let cmd = params.cmd = _[0]

  let { isTTY, columns, rows } = process.stdout
  printer.debug(params,
    `invocation\n` +
    `  which: ${process.argv[0]}\n` +
    `  args: ${JSON.stringify(args)}\n` +
    `  cmd: ${cmd}\n` +
    `  term: tty: ${!!(isTTY)}, ${columns} cols, ${rows} rows`
  )

  let ran = false
  for (let command of commands) {
    let { names, action, help } = command
    // Some help output is generated dynamically
    if (typeof help === 'function') {
      help = help(params)
    }
    printer.debug(params,
      'command\n' +
      `  names: ${names ? names.join(', ') : false}\n` +
      `  action: ${action ? true : false}\n` +
      `  help: ${help ? Object.keys(help).join(', ') : false}`,
    )
    if (names.includes(cmd) && args.help && help) {
      helper(params, help)
      ran = true
      break
    }
    else if (names.includes(cmd)) {
      try {
        let result = await action(params)
        if (result) printer(params, result)
        ran = true
        break
      }
      catch (err) {
        if (err.message === '__help__' && help) {
          ran = true
          helper(params, help)
          break
        }
        else throw err
      }
    }
  }
  // Fall back to main help if nothing else ran
  if (!ran) {
    if (cmd) {
      process.exitCode = 1
      let error = `Unknown command: ${cmd}`
      printer(params, {
        stderr: error,
        json: { error }
      })
      if (args.json) return
    }
    helper(params)
  }
}
