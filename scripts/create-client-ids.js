#! /usr/bin/env node

const process = require('node:process')
const { join } = require('node:path')
const { writeFileSync } = require('node:fs')

const {
  BEGIN_CLI_CLIENT_ID_STAGING: staging,
  BEGIN_CLI_CLIENT_ID_PRODUCTION: production,
} = process.env

if (!staging || !production) {
  throw ReferenceError('Missing staging and/or production client ID')
}

const clientIDFile = join(__dirname, '..', 'client-ids.json')
const clientIDs = JSON.stringify({ staging, production })
writeFileSync(clientIDFile, clientIDs)
