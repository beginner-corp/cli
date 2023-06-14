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

  let appID = getAppID(params.inventory, args)

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

  spinner(`Loading latest '${name}' logs from ${c.bold(app.name)} (${c.green(url)})`)
  let logs = await client.env.logs({ token, appID, envID, _staging })
  let logsQty = Object.keys(logs).length
  if (!logsQty) {
    spinner.done(`Loaded '${name}' log data from ${c.bold(app.name)} (${c.green(url)})`)
    return `No logs found (last 12 hours; logs may take up to 10 seconds to appear)`
  }
  else {
    let isWin = process.platform.startsWith('win')
    let ready = isWin
      ? chars.done
      : c.green(c.dim('❤︎'))
    spinner.done(`${ready} Loaded latest '${name}' logs from ${c.bold(app.name)} (${c.green(url)})`)
  }

  let formatDate = str => '\n' + c.green(c.bold(str))
  let formatted = logs
    .sort((a, b) => {
      if (a.created < b.created) return -1
      if (a.created > b.created) return 1
      return 0
    })
    .map(log => {
      let { created, msg, name, pos, pragma, requestID } = log
      if (!msg && !verbose) return
      let out

      let start = created.split('_')[0]
      let lambda = `@${pragma} ${name}`
      let requestHeader = c.gray(`\n[ ${lambda} request ID ${requestID} ]`)

      if (!msg && verbose) {
        out = `${formatDate(start)}${requestHeader}\n(nothing logged)`
      }
      else if (filter && !msg.includes(filter)) return
      else {
        let date = verbose ? start : new Date(start).toLocaleString()
        let invoke = verbose ? requestHeader : ''
        let ts = pos ? '' : `${formatDate(date)}${invoke}\n`
        out = ts + msg.trim()
      }
      return out
    })
    .filter(Boolean).join('\n')

  return usePager ? pager(params, formatted) : formatted
}

module.exports = {
  names,
  action,
  help,
}
