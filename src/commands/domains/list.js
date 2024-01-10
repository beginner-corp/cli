async function action (params) {
  let f = require('../../lib/format')()
  let client = require('@begin/api')
  let states = require('./_states')
  let { config, verbose } = params
  let { access_token: token, stagingAPI: _staging } = config

  let domains = await client.domains.list({ token, _staging })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  let apps

  const rows = []
  for (const domain of domains) {
    const { domain: domainName, domainID, managed, status, appLink, r53LastStatus, updatedAt } = domain

    if (status === states.PURCHASING) continue
    let row = []

    const domainTitle = [
      f.domain[managed ? 'managed' : 'external'](domainName),
      managed ? '' : f.dim(' (external)'),
    ].join('')

    if (verbose) row.push(`${domainTitle} ${f.ID(domainID)}`)
    else row.push(domainTitle)

    if (verbose ){
      row.push(`\n  Updated: ${f.date(updatedAt)}`)
      row.push(f.dim(`\n  Status: ${f.bold(status)} `))
    }

    row.push('\n  ')

    if (status === states.LINKED && appLink) {
      if (!apps) apps = await client.list({ token, _staging })
      let { appID, envID } = appLink
      let theApp = apps.find(a => a.appID === appID)
      let theEnv = theApp.environments.find(e => e.envID === envID)

      let linkedStatus = f.app.name(theApp.name)
      if (verbose) linkedStatus += ` ${f.ID(appID)}`
      linkedStatus += ` ${theEnv.name}`
      if (verbose) linkedStatus += ` ${f.ID(envID)}`
      row.push(linkedStatus)
    }
    else if (status === states.LINKED) {
      row.push('Linked to an unknown app')
    }
    else if (status === states.REGISTERING && r53LastStatus) {
      row.push(`${f.italic(`Registration: ${r53LastStatus}`)}`)
    }
    else if (status === states.ACTIVE) {
      row.push('Available to link')
    }
    else if (status === states.LINKING) {
      let linkingStatus = 'Linking to an app environment'
      if (verbose && r53LastStatus)
        linkingStatus += ` Last DNS check: ${f.italic(r53LastStatus)}`
      row.push(linkingStatus)
    }
    else if (status === states.UNLINKING) {
      row.push('Unlinking DNS and SSL certificates')
    }
    else if ([ states.LAPSED, states.CANCELLED, states.DELETED ].includes(status)) {
      row.push(`Inactive (${status})`)
    }
    else {
      row.push(`Unknown (${status})`)
    }

    rows.push(row.join(''))
    rows.push('')
  }

  return `\n${rows.join('\n')}`
}

module.exports = {
  name: 'list',
  description: "List your Begin account's domains",
  action,
}
