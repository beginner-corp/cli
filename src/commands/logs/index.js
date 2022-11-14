let names = { en: [ 'logs', 'log' ] }
let help = require('./help')

async function action (params) {
  let c = require('picocolors')
  let error = require('./errors')(params)
  let client = require('@begin/api')
  let { chars } = require('@architect/utils')
  let _inventory = require('@architect/inventory')
  params.inventory = await _inventory()
  let lib = require('../../lib')
  let { checkManifest, getAppID, getConfig, pager, spinner } = lib
  let { args } = params
  let { verbose } = args

  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to interact with logs, please run: begin login'
    return Error(msg)
  }
  let { access_token: token, stagingAPI: _staging } = config

  let manifestErr = checkManifest(params.inventory)
  if (manifestErr) return manifestErr

  let appID =  args.app || args.a || getAppID(params.inventory)
  if (!appID) return Error('Please specify an appID')

  // Make sure the appID is valid
  try {
    var app = await client.find({ token, appID, _staging })
  }
  catch (err) {
    if (err.message === 'app_not_found') return error(err.message)
    return err
  }
  let { environments: envs } = app

  // Environment is required if app has more than one
  let env = args.env || args.e
  if (!env && envs.length === 1) {
    var environment = envs[0]
  }
  else if (!env || env === true) {
    return error('no_env')
  }
  else if (env) {
    var environment = envs.find(({ name, envID }) => [ name, envID ].includes(env))
    if (!environment) return error('invalid_env')
  }
  let { envID, name, url } = environment

  // Filter (optional)
  let filter = args.filter || args.f
  if (!filter || filter === true) {
    filter = ''
  }

  // Send to pager
  let usePager = args.pager || args.p

  spinner(`Loading latest '${name}' logs from ${c.white(c.bold(app.name))} (${c.green(url)})`)
  let logs = await client.env.logs({ token, appID, envID, _staging })
  let logsQty = Object.keys(logs).length
  if (!logsQty) {
    spinner.done(`Loaded '${name}' log data from ${c.white(c.bold(app.name))} (${c.green(url)})`)
    return `No logs found (last 12 hours; logs may take up to a minute to appear)`
  }
  else {
    let isWin = process.platform.startsWith('win')
    let ready = isWin
      ? chars.done
      : c.green(c.dim('❤︎'))
    spinner.done(`${ready} Loaded latest '${name}' logs from ${c.white(c.bold(app.name))} (${c.green(url)})`)
  }

  let sortByTs = (a, b) => {
    if (a.start < b.start) return -1
    if (a.start > b.start) return 1
    return 0
  }

  let formatted = logs.map(log => {
    let { duration, initDuration, lambda, maxMemoryUsed, messages, start } = log
    if (!messages && !verbose) return
    let out = ''
    if (!messages && verbose) {
      out += `${c.green(c.bold(start))} (duration: ${duration})\n` +
               `[ ${lambda} invoked, nothing logged ]\n\n`
    }
    if (messages) {
      out += messages.sort(sortByTs).map(({ ts, msg }) => {
        if (filter && !msg.includes(filter)) return ''

        let date = verbose ? ts : new Date(ts).toLocaleString()
        let dur = verbose ? ` (duration: ${duration})` : ''
        let invoke = verbose
          ? c.gray(`\n[ ${lambda} invoked; init duration: ${initDuration}, max memory used: ${maxMemoryUsed} ]`)
          : ''
        let str = `${c.green(c.bold(date))}` + dur + invoke + `\n${msg.trim()}`
        return str
      }).filter(Boolean).join('\n\n')
    }
    return out
  }).filter(Boolean).join('\n\n')

  return usePager ? pager(params, formatted) : formatted
}

module.exports = {
  names,
  action,
  help,
}
