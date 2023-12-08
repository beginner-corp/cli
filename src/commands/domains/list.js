async function action (params) {
  let c = require('@colors/colors/safe')
  let client = require('@begin/api')
  let states = require('./_states')
  let { config, verbose } = params
  let { access_token: token, stagingAPI: _staging } = config

  let domains = await client.domains.list({ token, _staging })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  let apps = await client.list({ token, _staging })

  let presentDate = (date) => (new Date(date)).toLocaleString()
  let { tableStyle } = require('../../lib')
  let Table = require('cli-table3')
  let table = new Table({
    head: [ 'Domain', 'Status', 'Updated' ],
    ...tableStyle,
  })
  for (const { domain, domainID, managed, status, appLink, r53LastStatus, updatedAt } of domains) {
    if (status === states.PURCHASING) continue
    /** @type {import('cli-table3').HorizontalTableRow} */
    let row = []

    const firstCell = `${c.bold(domain)}${managed ? '' : ' (external)'}`
    if (verbose) row.push(`${firstCell} <${domainID}>`)
    else row.push(firstCell)

    if (status === states.LINKED && appLink) {
      let { appID, envID } = appLink
      let theApp = apps.find(a => a.appID === appID)
      let theEnv = theApp.environments.find(e => e.envID === envID)

      let linkedStatus = c.green(theApp.name)
      if (verbose) linkedStatus += ` <${appID}>`
      linkedStatus += `: "${theEnv.name}"`
      if (verbose) linkedStatus += ` <${envID}>`
      row.push(linkedStatus)
    }
    else if (status === states.REGISTERING) {
      row.push(`${c.italic(`Registration: ${r53LastStatus}`)}`)
    }
    else if (status === states.ACTIVE) {
      row.push('Available to link')
    }
    else if (status === states.LINKING) {
      let linkingStatus = 'Linking to an app environment'
      if (verbose)
        linkingStatus += ` Last DNS check: ${c.italic(r53LastStatus)}`
      row.push(linkingStatus)
    }
    else if (status === states.UNLINKING) {
      row.push('Unlinking DNS and SSL certificates')
    }
    else if ([ states.LAPSED, states.CANCELLED, states.DELETED ].includes(status)) {
      row.push(`Inactive (status: ${status})`)
    }
    else {
      row.push(`Unknown (status: ${status})`)
    }

    table.push(row.concat([ presentDate(updatedAt) ]))
  }

  return `\n${table.toString()}`
}

module.exports = {
  name: 'list',
  description: "List your Begin account's domains",
  action,
}
