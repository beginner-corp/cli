let { join } = require('path')
let test = require('tape')
let http = require('http')
let { readFileSync, rmSync, writeFileSync } = require('fs')
let cwd = process.cwd()
let testLib = join(cwd, 'test', 'lib')
let { newTmpFolder, getPort } = require(testLib)
let sut = join(cwd, 'src', 'lib', 'telemetry')
let telemetry = require(sut)
let reset = folder => rmSync(folder, { recursive: true, force: true })

let server = http.createServer()
let host = 'localhost'
let port

test('Set up env', async t => {
  t.plan(2)
  t.ok(telemetry, 'Telemetry lib is present')
  port = await getPort()
  t.ok(port, `Got an open port: ${port}`)
})

test('isDisabled method', t => {
  t.plan(2)
  let result
  let { isDisabled } = telemetry

  result = isDisabled({ args: { 'disable-telemetry': true } })
  t.ok(result, '--disable-telemetry argument disables telemetry')

  process.env.BEGIN_DISABLE_TELEMETRY = true
  result = isDisabled({ args: {} })
  t.ok(result, 'BEGIN_DISABLE_TELEMETRY env var disables telemetry')
  delete process.env.BEGIN_DISABLE_TELEMETRY
})

test('getEvents + updateEvents internal helper methods', t => {
  t.plan(4)
  let { getEvents, updateEvents } = telemetry

  let cliDir = newTmpFolder(t, 'getEvents')
  let file = join(cliDir, 'telemetry.json')
  let events

  getEvents({ cliDir })
  events = JSON.parse(readFileSync(file))
  t.ok(events.updated, 'New telemetry file is valid and has an updated timestamp')
  t.equal(events.events.length, 0, 'New telemetry file has an empty event array')

  // Munge the file
  writeFileSync(file, 'lolidk')
  getEvents({ cliDir })
  events = JSON.parse(readFileSync(file))
  t.equal(events.events.length, 0, 'Munged telemetry file is reset')

  let newEvents = [ { hi: 'there' }, { howdy: 'friend' } ]
  events.events.push(...newEvents)
  updateEvents(events, { cliDir })
  events = JSON.parse(readFileSync(file))
  t.deepEqual(events.events, newEvents, 'Successfully updated telemetry events')

  reset(cliDir)
})

test('telemetry.update', t => {
  t.plan(27)
  let { getEvents, update } = telemetry

  let cliDir = newTmpFolder(t, 'telemetryUpdate')
  let file = join(cliDir, 'telemetry.json')
  let events, event
  getEvents({ cliDir })

  update({ cmd: 'a', args: {}, cliDir })
  events = JSON.parse(readFileSync(file))
  event = events.events[0]
  t.equal(events.events.length, 1, 'Wrote a telemetry event')
  t.equal(event.cmd, 'a', 'Got correct command')
  t.equal(event.help, false, 'Command is not help')
  t.equal(event.args.length, 0, 'Command did not have args')
  t.notOk(event.isCI, 'isCI is falsy')
  t.equal(event.exitCode, 0, 'Exited 0')
  t.ok(event.ts && event.id, 'Got a timestamp + id')

  update({ cmd: 'b', args: { help: true }, cliDir })
  events = JSON.parse(readFileSync(file))
  event = events.events[1]
  t.equal(events.events.length, 2, 'Wrote a telemetry event')
  t.equal(event.cmd, 'b', 'Got correct command')
  t.equal(event.help, true, 'Command is help')
  t.equal(event.args[0], 'help', 'Help arg passed')

  update({ cmd: 'c', alias: 'lol', args: {}, cliDir })
  events = JSON.parse(readFileSync(file))
  event = events.events[2]
  t.equal(events.events.length, 3, 'Wrote a telemetry event')
  t.equal(event.cmd, 'c', 'Got correct command')
  t.equal(event.alias, 'lol', 'Got command alias')

  update({ cmd: 'd', args: { hello: 'friend' }, cliDir })
  events = JSON.parse(readFileSync(file))
  event = events.events[3]
  t.equal(events.events.length, 4, 'Wrote a telemetry event')
  t.equal(event.cmd, 'd', 'Got correct command')
  t.equal(event.args[0], 'hello', 'Captured argument name')
  t.notOk(JSON.stringify(event).includes('friend'), 'Did not capture argument value')

  update({ cmd: 'e', args: {}, isCI: true, cliDir })
  events = JSON.parse(readFileSync(file))
  event = events.events[4]
  t.equal(events.events.length, 5, 'Wrote a telemetry event')
  t.equal(event.cmd, 'e', 'Got correct command')
  t.ok(event.isCI, 'Got isCI flag')

  process.exitCode = 1
  update({ cmd: 'f', args: {}, cliDir })
  events = JSON.parse(readFileSync(file))
  event = events.events[5]
  t.equal(events.events.length, 6, 'Wrote a telemetry event')
  t.equal(event.cmd, 'f', 'Got correct command')
  t.equal(event.exitCode, 1, 'Got !0 exit code')
  process.exitCode = undefined

  update({ cmd: 'g', args: {}, cliDir }, Error())
  events = JSON.parse(readFileSync(file))
  event = events.events[6]
  t.equal(events.events.length, 7, 'Wrote a telemetry event')
  t.equal(event.cmd, 'g', 'Got correct command')
  t.equal(event.exitCode, 1, 'Got !0 exit code')

  reset(cliDir)
})

test('Start mock telemetry server', t => {
  t.plan(1)
  server.listen({ port, host }, err => {
    if (err) t.fail(err)
    else t.pass(`Started mock telemetry listener on port ${port}`)
  })
})

test('telemetry.send', async t => {
  t.plan(31)
  let { getEvents, send } = telemetry
  process.env.__BEGIN_TEST_URL__ = `http://${host}:${port}`

  let cliDir = newTmpFolder(t, 'telemetrySend')
  let file = join(cliDir, 'telemetry.json')
  let events, event1, event2, body = [], req, headers
  let oneDay = 60 * 60 * 24 * 1000
  events = getEvents({ cliDir }) // Generate the events file

  let staging = 'staging'
  let production = 'production'
  let basicParams = {
    args: {},
    clientIDs: { staging, production },
    cliDir,
    printer: { debug: () => {} },
    _refresh: true,
  }

  let responseHeaders = { 'content-type': 'application/json' }
  let responseBody = JSON.stringify({ ok: true })
  server.on('request', (request, res) => {
    body = []
    req = request
    headers = req.headers
    req.on('data', chunk => body.push(chunk))
    req.on('end', () => {
      if (body.length) body = JSON.parse(Buffer.concat(body))
      // console.log(`Telemetry body:`, body)
      res.writeHead(200, responseHeaders)
      res.end(responseBody)
    })
  })

  // Noop - don't send an empty event block
  await send({ cmd: 'dev', ...basicParams })
  t.notOk(req, 'Did not send request')

  event1 = { cmd: 'dev', ts: 1000 }
  events.events.push(event1)
  writeFileSync(file, JSON.stringify(events))
  events = getEvents({ cliDir })

  // Noop - some commands should never send telemetry
  await send({ cmd: 'generate', ...basicParams })
  await send({ cmd: 'telemetry', ...basicParams })
  await send({ cmd: 'version', ...basicParams })
  await send({ cmd: 'dev', ...basicParams, args: { help: true } })
  t.notOk(req, 'Did not send request')
  t.equal(events.events.length, 1, 'Telemetry queue has pending event')

  // Send a basic block of telemetry
  await send({ cmd: 'dev', ...basicParams })
  events = getEvents({ cliDir })
  t.ok(req, 'Sent telemetry request')
  t.notOk(headers.authorization, 'Did not send request with authorization header')
  t.equal(body.clientID, 'production', 'Got correct client ID')
  t.equal(body.events.length, 1, 'Got a single event')
  t.deepEqual(body.events[0], event1, 'Event matches')
  t.ok(body.device, 'Got a device ID')
  t.equal(events.events.length, 0, 'Telemetry queue is cleared')
  req = undefined
  telemetry.reset()

  // Don't send events that are too fresh
  event2 = { cmd: 'help', ts: Date.now() }
  events.events.push(event2)
  writeFileSync(file, JSON.stringify(events))

  await send({ cmd: 'dev', ...basicParams })
  events = getEvents({ cliDir })
  t.notOk(req, 'Did not send request')
  t.equal(events.events.length, 1, 'Telemetry queue has pending event')

  // Flush the queue once an event is old enough
  events.events.push(event1)
  writeFileSync(file, JSON.stringify(events))

  await send({ cmd: 'dev', ...basicParams })
  events = getEvents({ cliDir })
  t.ok(req, 'Sent telemetry request')
  t.notOk(headers.authorization, 'Did not send request with authorization header')
  t.equal(body.events.length, 2, 'Got two events')
  t.deepEqual(body.events[1], event1, 'Event matches')
  t.deepEqual(body.events[0], event2, 'Event matches')
  t.ok(body.device, 'Got a device ID')
  t.equal(events.events.length, 0, 'Telemetry queue is cleared')
  req = undefined
  telemetry.reset()

  // Only transmit approx 100KB of telemetry
  let junk = { cmd: 'help', ts: Date.now() - oneDay, junkData: 'x'.repeat(30000) }
  // Also test only keeping events fresher than 2 weeks; the last in the array below will be dropped
  events.events.push(junk, junk, junk, junk, junk, { ...junk, ts: 1000 })
  writeFileSync(file, JSON.stringify(events))

  await send({ cmd: 'dev', ...basicParams })
  events = getEvents({ cliDir })
  t.ok(req, 'Sent telemetry request')
  t.notOk(headers.authorization, 'Did not send request with authorization header')
  t.equal(body.events.length, 3, 'Got two events')
  let size = JSON.stringify(body.events).length
  t.ok(size <= 1000 * 1000, `Size is under 100KB: ${size / 1000}KB`)
  t.equal(events.events.length, 2, 'Telemetry queue has two pending events')
  req = undefined
  telemetry.reset()

  // Check token + staging config
  let config = { access_token: 'foo', stagingAPI: true }
  writeFileSync(join(cliDir, 'config.json'), JSON.stringify(config))
  events.events = [ event1 ]
  writeFileSync(file, JSON.stringify(events))

  await send({ cmd: 'dev', ...basicParams })
  events = getEvents({ cliDir })
  t.ok(req, 'Sent telemetry request')
  t.equal(headers.authorization, 'bearer foo', 'Sent request with authorization header')
  t.equal(body.clientID, 'staging', 'Got correct client ID')
  t.equal(body.events.length, 1, 'Got a single event')
  t.deepEqual(body.events[0], event1, 'Event matches')
  t.notOk(body.device, 'Did not get a device ID')
  t.equal(events.events.length, 0, 'Telemetry queue is cleared')
  req = undefined
  telemetry.reset()

  reset(cliDir)
  delete process.env.__BEGIN_TEST_URL__
})

test('Shut down', t => {
  t.plan(1)
  server.close(err => {
    if (err) t.fail(err)
    else t.pass('Closed server')
  })
})
