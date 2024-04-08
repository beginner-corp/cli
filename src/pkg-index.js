#! /usr/bin/env node

process.stderr.write('\x1b[41m\x1b[37m\x1b[1m DEPRECATION NOTICE: \x1b[0m \x1b[31m\x1b[1mThe Begin CLI is now available via npm\x1b[0m\n')
process.stderr.write('\x1b[1mPlease run "npm install -g @begin/deploy" to install the latest version\x1b[0m\n')

const begin = require('./index')
begin()
