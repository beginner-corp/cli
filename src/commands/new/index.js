let names = { en: [ 'new', 'gen' ] }
let subcommands = [ 'project', 'http', 'event', 'scheduled' ]
let help = require('./help').bind({}, subcommands)
let { existsSync, mkdirSync } = require('fs')
let { join } = require('path')

async function runAction (actionName, params) {
  let generator = require(`./generators/${actionName}`)
  let _inventory = require('@architect/inventory')
  params.inventory = await _inventory()
  let lib = require('../../lib')
  let utils = {
    create: require('./_create')(params),
    validate: require(`./_validate`)(params),
    ...lib,
    writeFile: lib.writeFile(params),
  }
  return generator.action(params, utils)
}

async function action (params) {
  let subcommand = params.args._[1]
  if (subcommands.includes(subcommand)) {
    return runAction(subcommand, params)
  }
  else if (subcommand) {
    // Error out if folder already exists
    if (existsSync(subcommand)) {
      let err = Error('Please specify a new folder to create a project in')
      if (subcommand) err = Error(`Invalid folder: ${subcommand} already exists`)
      err.type = '__help__'
      throw err
    }

    // Create new project
    let cwd = process.cwd()
    let projectDir = join(cwd, subcommand)
    if (mkdirSync(projectDir, { recursive: true })) {
      process.chdir(subcommand)
      return runAction('project', params)
    }
    else {
      let err = Error('Unable to create project folder')
      if (subcommand) err = Error(`Unable to create project folder: ${subcommand}`)
      err.type = '__help__'
      throw err
    }
  }
  else {
    let err = Error('Please specify a resource type to create')
    if (subcommand) err = Error(`Please specify a resource type to create`)
    err.type = '__help__'
    throw err
  }
}

module.exports = {
  names,
  action,
  help,
}
