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

  let c = require('picocolors')
  let client = require('@begin/api')
  let apps = await client.list({ token, _staging })
  if (!apps.length) return Error('No apps found. Create your first by running: `begin deploy`')
  let domains = await client.domains.list({ token, _staging })

  let item = '├──'
  let last = '└──'

  let output = []
  apps.forEach(({ name, appID, environments }) => {
    output.push(`${c.bold(name)} (app ID: ${appID})`)
    if (!environments.length) {
      output.push(`${last} (no app environments)`)
    }
    else {
      let lastEnv = environments.length - 1
      environments.forEach(({ name, envID, url, location }, i) => {
        let draw = lastEnv === i ? last : item
        let linkedDomain = domains.find(({ appLink }) => appLink?.appID === appID && appLink?.envID === envID)
        output.push([
          `${draw} ${name}:`,
          `${linkedDomain ? ` ${c.cyan(`https://${linkedDomain.domain}`)} |` : ''}`,
          ` ${c.green(url)}`,
          ` (env ID: ${envID}, region: ${location})`,
        ].join(''))
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
