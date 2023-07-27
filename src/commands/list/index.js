let names = { en: [ 'list', 'ls' ] }
let help = require('./help')

async function action (params) {
  let { getConfig, tableStyle } = require('../../lib')
  let config = getConfig(params)
  if (!config.access_token)
    return Error('You must be logged in to list your Begin apps, please run: begin login')

  let { access_token: token, stagingAPI: _staging } = config

  let c = require('@colors/colors/safe')
  let client = require('@begin/api')
  let Table = require('cli-table3')

  let apps = await client.list({ token, _staging })
  if (!apps.length) return Error('No apps found. Create your first by running: `begin deploy`')

  let domains = await client.domains.list({ token, _staging })

  let table = new Table({
    head: [ 'App Environments', 'ID', 'URL', 'Region' ],
    ...tableStyle,
  })
  for (let { name: appName, appID, environments } of apps) {
    table.push([ c.bold(appName), appID ])

    for (let { name: envName, envID, url, location } of environments) {
      /** @type {import('cli-table3').HorizontalTableRow} */
      let envRow = [
        { content: envName, style: { 'padding-left': 4 } },
        c.dim(envID),
      ]
      let linkedDomain = domains.find(({ appLink }) =>
        appLink?.appID === appID && appLink?.envID === envID
      )

      url = c.green(url)
      envRow.push(linkedDomain ? `${c.cyan(`https://${linkedDomain.domain}`)}\n${url}` : url)
      envRow.push(location)

      table.push(envRow)
    }
  }

  return `\n${table.toString()}`
}

module.exports = {
  names,
  action,
  help,
}
