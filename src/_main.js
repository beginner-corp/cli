#! /usr/bin/env node
// Entry for dev releases
let { readFileSync } = require('fs')
let { join } = require('path')
let commit = join(__dirname, '..', 'commit')
let appVersion = readFileSync(commit).toString()
let begin = require('./')
begin(appVersion)
