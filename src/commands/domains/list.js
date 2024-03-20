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
      row.push(`\n  Status: ${status} `)
    }

    row.push('\n  ')

    switch (status) {
    case states.PURCHASING:
      // already handled
      break
    case states.REGISTERING:
      row.push('Registering...')
      if (verbose && r53LastStatus) row.push(`${f.italic(`Registration: ${r53LastStatus}`)}`)
      break
    case states.UNVALIDATED:
      row.push(`Unvalidated. To start validation, run: ${f.italic(`begin domains validate --domain ${domainName}`)}`)
      if (verbose) row.push('')
      break
    case states.VALIDATING:
      row.push(`Validating. To continue validation, run: ${f.italic(`begin domains validate --domain ${domainName}`)}`)
      if (verbose) row.push('')
      break
    case states.ACTIVE:
      row.push(`Available to link. Use: ${f.italic(`begin domains link --domain ${domainName}`)}`)
      if (verbose) row.push('')
      break
    case states.LINKING: {
      let linkingStatus = 'Linking to an app environment...'
      if (verbose && r53LastStatus)
        linkingStatus += ` Last DNS check: ${f.italic(r53LastStatus)}`
      row.push(linkingStatus)
      break
    }
    case states.LINKED: {
      if (appLink) {
        if (!apps) apps = await client.list({ token, _staging })
        let { appID, envID } = appLink
        let theApp = apps.find(a => a.appID === appID)

        if (theApp) {
          let theEnv = theApp.environments.find(e => e.envID === envID)
          let linkedStatus = f.a.name(theApp.name)

          if (verbose) linkedStatus += ` ${f.ID(appID)}`
          linkedStatus += ` ${f.e.name(theEnv.name)}`
          if (verbose) linkedStatus += ` ${f.ID(envID)}`
          row.push(linkedStatus)
        }
        else {
          row.push('Linked to an unknown app')
        }
      }
      else {
        row.push('Linked to an unknown app')
      }
      break
    }
    case states.UNLINKING:
      row.push('Unlinking DNS and SSL certificates')
      break
    case states.UNKNOWN:
      row.push('Unknown')
      break
    case states.LAPSED:
      row.push('Lapsed')
      break
    case states.CANCELLED:
      row.push('Cancelled')
      break
    case states.DELETED:
      row.push('Deleted')
      break
    default:
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
