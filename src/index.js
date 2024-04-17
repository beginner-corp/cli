#! /usr/bin/env node
let { existsSync, readFileSync } = require('fs')
let { join } = require('path')
let { homedir } = require('os')
let minimist = require('minimist')
let commands = require('./commands')
let _printer = require('./printer')
let telemetry = require('./lib/telemetry')

async function begin (params = {}) {
  let { version } = params
  let alias = {
    debug: 'd',
    help: 'h',
    quiet: 'q',
    verbose: 'v',
  }
  let args = minimist(process.argv.slice(2), { alias })
  if (process.env.DEBUG) args.debug = true
  try {
    let clientIDs
    let clientIDFile = join(__dirname, '..', 'client-ids.json')
    if (existsSync(clientIDFile)) {
      clientIDs = JSON.parse(readFileSync(clientIDFile))
    }

    if (!version) {
      let pkg = join(__dirname, '..', 'package.json')
      version = JSON.parse(readFileSync(pkg)).version
    }

    let lang = 'en' // This should / will be configurable
    let printer = _printer(args)
    let cliDir = process.env.BEGIN_INSTALL || join(homedir(), '.begin')
    let isCI = args.input === false || (process.env.CI || !process.stdout.isTTY) || false
    let params = { args, appVersion: version, cliDir, clientIDs, isCI, lang, printer }
    if (!isCI && process.env.BEGIN_CLI_TYPE === 'BINARY') {
      printer('IMPORTANT')
      printer('\x1b[41m\x1b[37m\x1b[1m DEPRECATION NOTICE: \x1b[0m \x1b[31m\x1b[1mThe Begin Deploy CLI is now updated via npm\x1b[0m')
      printer('\x1b[1mPlease run "npm install -g @begin/deploy" to install the latest version\x1b[0m\n')
    }
    await commands(params)
    telemetry.end(params)
  }
  catch (err) {
    _printer(args)(err)
  }
}

// Invoke to start if not running in module (test) mode
if (require.main === module) {
  begin()
}

// Do this in case we have a running spinner that hid the cursor
process.on('SIGINT', () => {
  require('restore-cursor')()
  process.stderr.write('\n')
  process.exit()
})

module.exports = begin
