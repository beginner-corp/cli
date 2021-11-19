#! /usr/bin/env node
let { readFileSync } = require('fs')
let { join } = require('path')
let minimist = require('minimist')
let commands = require('./commands')
let printer = require('./printer')
let { DEBUG } = process.env

async function begin (a) {
  let alias = {
    debug: [ 'd', 'debug' ],
    help: [ 'h', 'help' ],
    quiet: [ 'q', 'quiet' ],
    verbose: [ 'v', 'verbose' ],
  }
  let args = minimist(a, { alias })
  if (DEBUG || args.debug) args.debug = DEBUG || args.debug
  try {
    let pkg = join(__dirname, '..', 'package.json')
    let appVersion = JSON.parse(readFileSync(pkg)).version

    let lang = 'en' // This should / will be configurable
    let params = { args, appVersion, lang, printer }
    await commands(params)
  }
  catch (err) {
    printer({ args }, err)
  }
}

// Invoke to start if not running in module (test) mode
if (require.main === module) {
  begin(process.argv.slice(2))
}

module.exports = begin
