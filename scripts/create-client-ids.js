#! /usr/bin/env node

const { join } = require('node:path')
const { writeFileSync } = require('node:fs')

const staging = process.env.BEGIN_CLI_CLIENT_ID_STAGING
const production = process.env.BEGIN_CLI_CLIENT_ID_PRODUCTION

if (!staging || !production) {
  throw ReferenceError('Missing staging and/or production client ID')
}

const clientIDFile = join(__dirname, '..', 'client-ids.json')
const clientIDs = JSON.stringify({ staging, production })
writeFileSync(clientIDFile, clientIDs)
