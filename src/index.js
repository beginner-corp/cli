#! /usr/bin/env node
let { readFileSync } = require('fs')
let { join } = require('path')
let minimist = require('minimist')
let commands = require('./commands')
let printer = require('./printer')
let { DEBUG } = process.env

async function begin (appVersion) {
  let alias = {
    debug: [ 'd', 'debug' ],
    help: [ 'h', 'help' ],
    quiet: [ 'q', 'quiet' ],
    verbose: [ 'v', 'verbose' ],
  }
  let args = minimist(process.argv.slice(2), { alias })
  if (DEBUG || args.debug) args.debug = DEBUG || args.debug
  try {
    if (!appVersion) {
      let pkg = join(__dirname, '..', 'package.json')
      appVersion = JSON.parse(readFileSync(pkg)).version
    }
    let lang = 'en' // This should / will be configurable
    let params = { args, appVersion, lang, printer }
    commands(params)
  }
  catch (err) {
    printer({ args }, err)
  }
}

// Invoke to start if not running in module (test) mode
if (require.main === module) {
  begin()
}

module.exports = begin
