async function action (params) {
  let c = require('picocolors')
  let client = require('@begin/api')
  let states = require('./_states')
  let { config, verbose } = params
  let { access_token: token, stagingAPI: _staging } = config

  let domains = await client.domains.list({ token, _staging })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  let apps = await client.list({ token, _staging })

  let presentDate = (date) => (new Date(date)).toLocaleString()
  let Table = require('cli-table3')
  let table = new Table({ head: [ 'Domain', 'Status', 'Updated' ] })
  for (const { domain, domainID, status, appLink, r53LastStatus, updatedAt } of domains) {
    if (status === states.PURCHASING) continue
    let row = [ ]

    if (verbose) row.push(`${c.bold(domain)} <${domainID}>`)
    else row.push(c.bold(domain))

    if (status === states.LINKED && appLink) {
      let { appID, envID } = appLink
      let theApp = apps.find(a => a.appID === appID)
      let theEnv = theApp.environments.find(e => e.envID === envID)

      let linkedStatus = `${c.bold(c.green(theApp.name))}`
      if (verbose) linkedStatus += ` <${appID}>`
      linkedStatus += `: "${theEnv.name}"`
      if (verbose) linkedStatus += ` <${envID}>`
      row.push(linkedStatus)
    }
    else if (status === states.REGISTERING) {
      row.push(`${c.bold(`Registration: ${r53LastStatus}`)}`)
    }
    else if (status === states.ACTIVE) {
      row.push(`${c.bold('Available to link')}`)
    }
    else if (status === states.LINKING) {
      let linkingStatus = `${c.bold('Linking to an app environment')}`
      if (verbose)
        linkingStatus += ` Last DNS check: ${c.bold(r53LastStatus)}`
      row.push(linkingStatus)
    }
    else if (status === states.UNLINKING) {
      row.push(`${c.bold('Unlinking DNS and SSL certificates')}`)
    }
    else if ([ states.LAPSED, states.CANCELLED, states.DELETED ].includes(status)) {
      row.push(`${c.bold('Inactive')} (status: ${status})`)
    }
    else {
      row.push(`${c.bold('Unknown')} (status: ${status})`)
    }

    table.push(row.concat([ presentDate(updatedAt) ]))
  }

  return table.toString()
}

module.exports = {
  name: 'list',
  description: "List your Begin account's domains",
  action,
}
