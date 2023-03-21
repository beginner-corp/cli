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
  let mark = c.gray('└──')
  let arrow = c.cyan('└─→')
  let output = []
  domains.forEach(({ domain, domainID, status, appLink, r53LastStatus, updatedAt }) => {
    let domainLine = `${c.underline(c.cyan(domain))}`
    if (verbose) domainLine += ` <${domainID}> ${c.bold(status)} [updated: ${presentDate(updatedAt)}]`
    output.push(domainLine)

    if (status === states.LINKED && appLink) {
      let { appID, envID } = appLink
      let theApp = apps.find(a => a.appID === appID)
      let theEnv = theApp.environments.find(e => e.envID === envID)

      let linkLine = `${arrow} ${c.bold(c.green(theApp.name))}`
      if (verbose) linkLine += ` <${appID}>`
      linkLine += ` → "${theEnv.name}"`
      if (verbose) linkLine += ` <${envID}>`
      output.push(linkLine)
    }
    else if (status === states.PURCHASING) {
      if (verbose) output.push(`${mark} ${c.bold('Ready to purchase')}`)
      else output = []
    }
    else if (status === states.REGISTERING) {
      output.push(`${mark} ${c.bold('Registering')}`)
    }
    else if (status === states.ACTIVE) {
      output.push(`${mark} ${c.bold('Available to link with "begin domains link"')}`)
    }
    else if (status === states.LINKING) {
      output.push(`${mark} ${c.bold('Linking to an app environment')}`)
      if (verbose)
        output.push(`  ${mark} Last DNS check: ${c.bold(r53LastStatus)}`)
    }
    else if (status === states.UNLINKING) {
      output.push(`${mark} ${c.bold('Unlinking DNS and SSL certificates')}`)
    }
    else if ([ states.LAPSED, states.CANCELLED, states.DELETED ].includes(status)) {
      output.push(`${mark} ${c.bold('Inactive')} (status: ${status})`)
    }
  })

  return output.join('\n')
}

module.exports = {
  name: 'list',
  description: "List your Begin account's domains",
  action,
  help: {
    en: {
      usage: [ 'domains' ],
      description: 'List your Begin account domain names',
      examples: [
        {
          name: 'List all domains',
          example: 'begin domains',
        },
      ]
    }
  }
}
