#! /usr/bin/env node
let { readFileSync } = require('fs')
let { join } = require('path')
let minimist = require('minimist')
let commands = require('./commands')
let _printer = require('./printer')

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
    if (!version) {
      let pkg = join(__dirname, '..', 'package.json')
      version = JSON.parse(readFileSync(pkg)).version
    }
    let lang = 'en' // This should / will be configurable
    let printer = _printer(args)
    let params = { args, appVersion: version, lang, printer }
    await commands(params)
  }
  catch (err) {
    _printer(args)(err)
  }
}

// Invoke to start if not running in module (test) mode
if (require.main === module) {
  begin()
}

module.exports = begin
