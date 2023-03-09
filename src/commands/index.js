let builds = require('./builds')
let create = require('./create')
let deploy = require('./deploy')
let destroy = require('./destroy')
let dev = require('./dev')
let domains = require('./domains')
let envVar = require('./env')
let logs = require('./logs')
let generate = require('./generate')
let help = require('./help')
let list = require('./list')
let login = require('./login')
let logout = require('./logout')
let newProj = require('./new')
let tail = require('./tail')
let telemetry = require('./telemetry')
let update = require('./update')
let version = require('./version')
let commands = [
  builds, create, deploy, destroy, dev, domains, envVar, generate, help,
  list, login, logout, logs, newProj, tail, telemetry, update, version,
]

let helper = require('../helper')
let _telemetry = require('../lib/telemetry')

module.exports = async function runCommand (params) {
  let { args, isCI, lang, printer } = params
  let { _ } = args
  if (_.includes('help')) {
    let i = _.findIndex(c => c === 'help')
    if (_.length > 1) _.splice(i, 1)
    args.help = true
  }
  let cmd = params.cmd = _[0]

  let { isTTY, columns, rows } = process.stdout
  let { versions: vers } = process
  printer.debug(
    `invocation\n` +
    `  which: ${process.argv[0]}\n` +
    `  args: ${JSON.stringify(args)}\n` +
    `  cmd: ${cmd}\n` +
    `  vers: node: ${vers.node}, v8: ${vers.v8}\n` +
    `  term: tty: ${!!(isTTY)}, ${columns} cols, ${rows} rows, ci: ${isCI}`
  )

  let getHelp = async help => typeof help === 'function' ? help(params) : help
  for (let command of commands) {
    let { names, action, help } = command
    // Some help output is generated dynamically
    if (names[lang].includes(cmd)) {
      if (names[lang][0] !== cmd) {
        params.alias = cmd
        cmd = params.cmd = names[lang][0]
      }
      printer.debug(
        'command\n' +
        `  names: ${names[lang]?.join(', ')}\n` +
        `  action: ${action ? true : false}\n` +
        `  help: ${help ? Object.keys(help).join(', ') || '[function]' : false}`,
      )

      if (args.help && help) {
        helper(params, await getHelp(help))
        _telemetry.update(params)
        return
      }
      try {
        _telemetry.send(params)
        let result = await action(params)
        printer(result)
        _telemetry.update(params)
        return
      }
      catch (err) {
        if (err?.type === '__help__' && help) {
          args.help = true
          printer(err)
          if (args.json) return
          helper(params, await getHelp(help))
          _telemetry.update(params)
          return
        }
        else if (err) {
          _telemetry.update(params, err)
          throw err
        }
        process.exitCode = 1 // Rejecting without an error is probably a failed build
        return
      }
    }
  }
  // Fall back to main help if nothing else ran
  if (cmd) {
    _telemetry.update(params)
    printer(Error(`Unknown command: ${cmd}`))
  }
  if (!args.json) {
    helper(params)
  }
}
