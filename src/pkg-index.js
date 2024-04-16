#! /usr/bin/env node

if (process.env.NODE_ENV !== 'testing') {
  console.log('console.log')
  console.error('console.error')
  process.stderr.write('process.stderr.write\n')
  process.stdout.write('process.stdout.write\n')

  console.error('\x1b[41m\x1b[37m\x1b[1m DEPRECATION NOTICE: \x1b[0m \x1b[31m\x1b[1mThe Begin Deploy CLI is now updated via npm\x1b[0m')
  console.error('\x1b[1mPlease run "npm install -g @begin/deploy" to install the latest version\x1b[0m\n')
}

require('./index')()
