let names = { en: [ 'list', 'ls' ] }
let help = require('./help')
let { getConfig } = require('../../lib')

async function action (params) {
  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to list your Begin apps, please run: begin login'
    return Error(msg)
  }
  let { access_token: token, stagingAPI: _staging } = config

  let client = require('@begin/api')
  let apps = await client.list({ token, _staging })

  if (!apps.length) return console.error('No apps found. Create your first by running: `begin deploy`')
  let item = '  ├──'
  let last = '  └──'

  let output = []
  apps.forEach(({ name, appID, environments }) => {
    let working = params.appID === appID ? ', in this dir' : ''
    output.push(`'${name}' (app ID: ${appID}${working})`)
    if (!environments.length) {
      output.push(`${last} (no app environments)`)
    }
    else {
      // output.push()
      let lastEnv = environments.length - 1
      environments.forEach(({ name, envID, url }, i) => {
        let draw = lastEnv === i ? last : item
        output.push(`${draw} '${name}' (env ID: ${envID}): ${url}`)
      })
    }
  })
  return output.join('\n')
}

module.exports = {
  names,
  action,
  help,
}
