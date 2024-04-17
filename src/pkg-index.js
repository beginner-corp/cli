#! /usr/bin/env node

if (process.stdin.isTTY) {
  process.stderr.write('\n\x1b[41m\x1b[37m\x1b[1m DEPRECATION NOTICE: \x1b[0m \x1b[31m\x1b[1mThe Begin Deploy CLI is now updated via npm\x1b[0m\n')
  process.stderr.write('\x1b[1mPlease run "npm install -g @begin/deploy" to install the latest version\x1b[0m\n\n')
}

require('./index')()
