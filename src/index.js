#! /usr/bin/env node
let { readFileSync } = require('fs')
let { join } = require('path')
let minimist = require('minimist')
let commands = require('./commands')
let { DEBUG } = process.env

function begin (a) {
  try {
    let alias = {
      debug: [ 'd', 'debug' ],
      help: [ 'h', 'help' ],
      quiet: [ 'q', 'quiet' ],
      verbose: [ 'v', 'verbose' ],
    }
    let args = minimist(a, { alias })
    let pkg = join(__dirname, '..', 'package.json')
    let appVersion = JSON.parse(readFileSync(pkg)).version
    args.debug = DEBUG || args.debug

    let params = { args, appVersion }
    return commands(params)
  }
  catch (err) {
    console.log(err)
    process.exitCode = 1
  }
}

// Invoke to start if not running in module (test) mode
if (require.main === module) {
  begin(process.argv.slice(2))
}

module.exports = begin
