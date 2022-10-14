let names = { en: [ 'list' ] }
let help = require('./help')
let appAction = require('../app/list')
let { getConfig } = require('../../lib')

async function action (params) {

  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to list your Begin apps, please run: begin login'
    return Error(msg)
  }

  return appAction.action({
    config
  })
}

module.exports = {
  names,
  action,
  help,
}
