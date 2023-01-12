let names = { en: [ 'tail' ] }
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
  let { debug, verbose } = args

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

  let querystring = require('querystring')
  let WebSocket = require('ws')

  let stage = _staging ? 'staging-' : ''
  let wssUrl = `wss://ws.${stage}api.begin.com`
  let query = querystring.stringify({ token, appID, envID })
  let ws

  function connect () {
    try {
      ws = new WebSocket(`${wssUrl}?${query}`)
    }
    catch (err) {
      console.error('Error connecting:', err)
      process.exit(1)
    }
  }
  connect()

  let interval
  let lastPing
  let lastPong = Date.now()
  let printed = false

  // We don't want to print this stuff should the client reconnect in the background, so just do it once here
  function print () {
    let mode = ''
    if (verbose) mode = ' - verbose mode'
    if (debug) mode = ' - debug mode'
    console.error(`Tailing latest '${name}' logs from ${c.white(c.bold(app.name))} (${c.green(url)})${mode}`)
    if (filter) console.error(`Filtering: '${filter}'`)
    printed = true
  }
  ws.on('open', function open () {
    if (!printed) print()

    // Connection keepalive with pings at 30s intervals
    interval = setInterval(() => {
      ws.ping()
      lastPing = Date.now()
      // Assume if the last pong is more than 35s ago the connection has gone stale
      if ((lastPing - lastPong) >= (35 * 1000)) {
        ws.terminate()
        clearInterval(interval)
        connect()
      }
    }, 30000)
  })

  ws.on('pong', () => lastPong = Date.now())

  ws.on('message', function message (data) {
    let raw = JSON.parse(data)
    if (!raw.length) return

    let dates = []
    let logs = raw.sort((a, b) => {
      if (a.created > b.created) return 1
      return -1
    })
    logs.forEach(log => {
      let { batch, created, msg, name, pos, pragma, requestID } = log
      if (!msg || !msg.trim() || !msg.includes(filter)) return
      let ts = created.split('_')[0]
      let date = verbose ? ts : new Date(ts).toLocaleString()
      if (debug) {
        console.log({ ts, batch, pragma, name, requestID, pos, msg })
        return
      }
      let lambdaDate = `${pragma}:${name}:${date}`
      let newDate = !dates.includes(lambdaDate)
      if (newDate) {
        dates.push(lambdaDate)
        let from = verbose ? c.gray(` [ @${pragma} '${name}' invoked ]`) : ''
        console.log(`\n${c.green(c.bold(date))}${from}\n${msg}`)
      }
      else {
        console.log(msg)
      }
    })
  })

  ws.on('close', () => {
    clearInterval(interval)
    connect()
  })

  ws.on('error', err => {
    clearInterval(interval)
    console.error('Socket connection error:', err)
    console.error('Reconnecting')
    connect()
  })

  // Gracefully terminate the WebSocket if possible
  process.on('exit', () => {
    clearInterval(interval)
    if (ws) {
      if (debug) console.error('Terminating WebSocket connection')
      ws.terminate()
    }
  })
}

module.exports = {
  names,
  action,
  help,
}
