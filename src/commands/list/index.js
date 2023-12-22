let names = { en: [ 'list', 'ls' ] }
let help = require('./help')

async function action (params) {
  let { getConfig } = require('../../lib')
  let config = getConfig(params)
  if (!config.access_token)
    return Error('You must be logged in to list your Begin apps, please run: begin login')

  let { access_token: token, stagingAPI: _staging } = config

  let c = require('@colors/colors/safe')
  let client = require('@begin/api')

  let apps = await client.list({ token, _staging })
  if (!apps.length) return Error('No apps found. Create your first by running: `begin deploy`')

  let domains = await client.domains.list({ token, _staging })
  let rows = []
  for (let { name: appName, appID, environments } of apps) {
    rows.push([
      c.bold(appName),
      `<${appID}>`,
    ].join(' '))

    for (let { name: envName, envID, url, location } of environments) {
      let envRow = [
        ' ',
        c.bold(envName),
        `<${envID}>`,
        c.dim(location),
      ]
      let linkedDomain = domains.find(({ appLink }) =>
        appLink?.appID === appID && appLink?.envID === envID
      )

      let appUrl = c.green(url)
      envRow.push(
        linkedDomain
          ? `\n    ├─ ${c.cyan(`https://${linkedDomain.domain}`)}\n    └─ ${appUrl}`
          : `\n    └─ ${appUrl}`
      )

      rows.push(envRow.join(' '))
    }
    rows.push('')
  }

  return `\n${rows.join('\n')}`
}

module.exports = {
  names,
  action,
  help,
}
