let started = false
let done = false

module.exports = {
  // Core methods
  update, send, end,
  // Exported for testing
  isDisabled, getEvents, updateEvents, reset,
}

function update (params, err) {
  if (isDisabled(params)) return

  let exitCode = process.exitCode ?? 0
  if (!exitCode && err) exitCode = 1

  let { getConfig } = require('./')
  let { collectBasicTelemetry } = getConfig(params, false)
  if (collectBasicTelemetry === false) return

  let events = getEvents(params)
  let { randomUUID } = require('crypto')
  let { cmd, alias, isCI } = params
  let args = Object.keys(params.args).filter(a => a !== '_')
  let help = params.args.help ? true : false

  events.updated = new Date().toISOString()
  events.events.push({
    cmd,
    alias,
    help,
    args,
    isCI,
    ts: Date.now(),
    exitCode,
    id: randomUUID(),
  })

  updateEvents(events, params)
}

// Optimistically send telemetry data
// No need to await this, because it should run in the background and be killed if necessary
async function send (params) {
  if (isDisabled(params)) return

  let { getConfig } = require('./')
  let { access_token, collectBasicTelemetry, stagingAPI } = getConfig(params, false)
  if (collectBasicTelemetry === false) return

  let doNotSendOnCmds = [ 'generate', 'telemetry', 'version' ]
  if (doNotSendOnCmds.includes(params.cmd) || params.args.help) return

  let { printer, clientIDs } = params
  let clientID = stagingAPI ? clientIDs.staging : clientIDs.production
  let base = getBase(stagingAPI)

  let events = getEvents(params)
  if (!events.events.length) return

  let oneDay = 60 * 60 * 24 * 1000
  let now = Date.now()
  let readyToSend = events.events.some(({ ts }) => (now - ts) >= (oneDay / 4))
  if (!readyToSend) return

  started = true

  // There's a max payload size of 6MB, so we have to stay within that
  // But just to keep things snappy, let's cap it at 100KB
  let sending = []
  let keeping = []
  let maxPayload = 1000 * 100
  let reachedMax = false
  let payloadSize = 0
  events.events.forEach(event => {
    if (reachedMax) return keeping.push(event)

    let newPayload = JSON.stringify(event).length
    if ((payloadSize + newPayload) >= maxPayload) {
      reachedMax = true
      keeping.push(event)
    }
    else {
      payloadSize += newPayload
      sending.push(event)
    }
  })

  let headers = undefined
  let body = { clientID, events: sending }
  headers = { 'content-type': 'application/json' }
  if (access_token) {
    headers.authorization = `bearer ${access_token}`
  }
  else {
    let { machineId } = require('node-machine-id')
    try {
      body.device = await machineId()
    }
    catch (err) {
      // We can't transmit without a unique ID, so bail
      printer.debug('Telemetry machine ID error')
      printer.debug(err)
      started = false
      return
    }
  }

  printer.debug(`Transmitting ${sending.length} telemetry events to Begin`)

  let tiny = require('tiny-json-http')
  await tiny.post({ url: base + '/telemetry', headers, body })
    .then(() => {
      // Filter out stale events; unlikely, but possible
      events.events = keeping.filter(({ ts }) => (now - ts) < (oneDay * 14))
      updateEvents(events, params)
      done = true
    })
    .catch(err => {
      done = true
      printer.debug('Telemetry error')
      printer.debug(err)
    })
}

// Since Promises aren't cancelable, force-exit the process if telemetry hasn't heard back yet
function end (params) {
  let { cmd, help, isCI } = params
  let isDev = cmd === 'dev' && !help
  if (started && !done && !isDev && !isCI) {
    process.exit()
  }
}

/**
 * Helper methods
 */
function isDisabled (params) {
  let { args } = params
  if (args['disable-telemetry']) return true
  if (process.env.BEGIN_DISABLE_TELEMETRY) return true
  return false
}

function getEvents (params) {
  let { cliDir } = params
  let { existsSync, readFileSync, writeFileSync } = require('fs')
  let { join } = require('path')

  let file = join(cliDir, 'telemetry.json')
  function createNewEventsFile () {
    let newEvents = {
      updated: new Date().toISOString(),
      events: [],
    }
    writeFileSync(file, JSON.stringify(newEvents, null, 2))
    return newEvents
  }

  if (!existsSync) {
    return createNewEventsFile()
  }
  else {
    try {
      let contents = JSON.parse(readFileSync(file))
      let { updated, events } = contents
      if (!updated || !events) throw ReferenceError('Missing telemetry properties')
      return contents
    }
    // JSON is munged, start the telemetry file over
    catch {
      return createNewEventsFile()
    }
  }
}

function updateEvents (events, params) {
  let { cliDir } = params
  let { writeFileSync } = require('fs')
  let { join } = require('path')

  // TODO we should probably do some file locking around here
  let file = join(cliDir, 'telemetry.json')
  writeFileSync(file, JSON.stringify(events, null, 2))
}

function getBase (isStaging) {
  let { __BEGIN_TEST_URL__ } = process.env
  if (__BEGIN_TEST_URL__) return __BEGIN_TEST_URL__

  return `https://${isStaging ? 'staging-' : ''}api.begin.com/v1`
}

// Only used for testing
function reset () {
  started = done = false
}
