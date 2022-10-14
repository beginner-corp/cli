let names = { en: [ 'logs', 'log' ] }
let help = require('./help')
let appAction = require('../app/list')

async function action (params) {
  let c = require('picocolors')
  let error = require('./errors')(params)
  let client = require('@begin/api')
  let _inventory = require('@architect/inventory')
  params.inventory = await _inventory()
  let lib = require('../../lib')
  let { checkManifest, getConfig } = lib
  let { args } = params

  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to interact with logs, please run: begin login'
    return Error(msg)
  }
  let { access_token: token, stagingAPI: _staging } = config

  let manifestErr = checkManifest(params.inventory)
  if (manifestErr && !appAction.manifestNotNeeded) return manifestErr

  // See if the project manifest contains an app ID
  let { begin } = params.inventory.inv._project.arc
  let appID = begin?.find(i => i[0] === 'appID' && typeof i[1] === 'string')?.[1]

  // Make sure the appID is valid
  let app = null
  try {
    app = await client.find({ token, appID, _staging })
  }
  catch (err) {
    return error([ 'no_appid_found' ])
  }
  let { environments, name } = app
  let last = '  └──'

  // Environment (required)
  let envID = args.e || args.env
  if (!envID || envID === true) {
    return error([ 'no_env' ])
  }

  // Filter (optional)
  let filter = args.f || args.filter
  if (!filter || filter === true) {
    filter = ''
  }

  let env = environments.find(item => item.envID === envID)
  if (!env) {
    return error([ 'invalid_env' ])
  }

  console.log(`'${name}' (app ID: ${appID})`)
  console.log(`${last} '${env.name}' (env ID: ${env.envID}): ${env.url}`)

  let logs = await client.env.logs({ token, appID, envID, query: `fields @log, @logStream, @timestamp, @message | sort @timestamp desc`, _staging })
  if (!logs.length) {
    return `  ${last} (no logs)`
  }

  return logs.filter(log => log.message.includes(filter)).reverse().map(({ timestamp, message }) => `${c.cyan(timestamp)}: ${message}`).join('\n')
}

module.exports = {
  names,
  action,
  help,
}
