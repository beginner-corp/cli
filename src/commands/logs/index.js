let names = { en: [ 'logs', 'log' ] }
let help = require('./help')

async function action (params) {
  let c = require('picocolors')
  let error = require('./errors')(params)
  let client = require('@begin/api')
  let _inventory = require('@architect/inventory')
  params.inventory = await _inventory()
  let lib = require('../../lib')
  let { checkManifest, getAppID, getConfig } = lib
  let { args } = params

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
  let last = '└──'

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

  console.error(`${c.white(c.bold(app.name))} (app ID: ${appID})`)
  console.error(`${last} ${name} (env ID: ${envID}): ${c.green(url)}`)

  let query = `fields @log, @logStream, @timestamp, @message | sort @timestamp desc`
  let logs = await client.env.logs({ token, appID, envID, query, _staging })
  if (!logs.length) {
    return `    ${last} (no logs)`
  }

  let isFiltered = ({ message }) => message?.includes(filter)
  let format = ({ timestamp, message }) => `${c.cyan(timestamp)}:\n${message.trim()}`
  let output = logs.filter(isFiltered).reverse().map(format).join('\n')
  return output
}

module.exports = {
  names,
  action,
  help,
}
