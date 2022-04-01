#! /usr/bin/env node
// Entry for dev releases
let { readFileSync } = require('fs')
let { join } = require('path')

let commitFile = join(__dirname, '..', 'commit')
let version = readFileSync(commitFile).toString()

let clientIDFile = join(__dirname, '..', 'client-ids.json')
let clientIDs = JSON.parse(readFileSync(clientIDFile))

let begin = require('./')
begin({ version, clientIDs })
