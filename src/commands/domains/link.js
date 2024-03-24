async function action (params) {
  const client = require('@begin/api')
  const { Confirm, Select } = require('enquirer')
  const f = require('../../lib/format')()
  const spinner = require('../../lib/spinner')
  const states = require('./_states')

  const { yes, config } = params
  const { access_token: token, stagingAPI: _staging } = config
  let { domain: domainName, appID, env } = params

  const domains = await client.domains.list({ _staging, token })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  if (!domainName || (typeof domainName === 'string' && domainName.length === 0)){
    const prompt = new Select({
      name: 'domain',
      message: 'Select a domain',
      choices: domains.filter(d => states.canLink.includes(d.status)).map(d => d.domain),
    })
    domainName = await prompt.run()
  }

  const theDomain = domains.find(d => d.domain === domainName)
  if (!theDomain)
    return Error([
      `You do not subscribe to the domain "${domainName}".`,
      `To subscribe, run: begin domains add ${domainName}`,
    ].join('\n'))

  const fDomain = f.d[theDomain.managed ? 'managed' : 'external'](domainName)

  // * Determine if a call to the API should be made
  if (!theDomain.managed) {
    const { status, cloudFront, appLink } = theDomain

    let message = []
    let send = false
    switch (status) {
    case states.ACTIVE:
      // first step in linking - continue if cloudFront exists
      if (!cloudFront) {
        return Error(`Domain "${domainName}" is not validated. Run: begin domains validate --domain ${domainName}`)
      }
      message.push(`${fDomain} is externally managed. We'll provide 2 additional DNS records to link it to an app`)
      send = true
      break
    case states.LINKING:
      // created API Gateway, waiting on DNS. provide CNAME record
      message.push(`${fDomain} is currently being linked to an app`)
      if (appLink) {
        if (appLink.apiG?.certDnsValidationRecord) {
          message.push(...[
            'Please add the following CNAME record to your DNS settings:',
            `Add a CNAME record to ${fDomain} with the following name and value:`,
            `Name:  ${f.name(appLink.apiG.certDnsValidationRecord.Name)}`,
            `Value: ${f.name(appLink.apiG.certDnsValidationRecord.Value)}`,
            '',
            'Then run the following command to get an additional DNS validation record:',
            `begin domains link --domain ${domainName}`,
          ])
        }
        await client.domains.link({
          _staging,
          token,
          domainID: theDomain.domainID,
          appID: appLink.appID,
          envID: appLink.envID,
        })
        return message.join('\n')
      }
      break
    case states.UNKNOWN:
      // errored
      message.push(`${fDomain} is in an unknown state. Please contact support@begin.com`)
      break
    case states.LINKED:
      // already linked, provide ALIAS record
      message.push(`${fDomain} is linked!`)
      if (appLink?.dnsAliasTarget) {
        message.push('Please add the following ALIAS record to your DNS settings:')
        message.push(...[
          `Add an ALIAS record to ${fDomain}'s root with the following value:`,
          f.name(appLink.dnsAliasTarget.DNSName),
        ])
      }
      break
    default:
      break
    }

    if (send) console.log(message.join('\n'))
    else return message.join('\n')
  }

  if (!appID || (typeof appID === 'string' && appID.length === 0)){
    spinner('Fetching apps')
    const apps = await client.list({ _staging, token })
    spinner.done()
    const prompt = new Select({
      name: 'appID',
      message: 'Select an app',
      choices: apps.map(a => ({ name: a.name, value: a.appID })),
      result (a) { return this.map(a)[a] },
    })
    appID = await prompt.run()
  }

  spinner('Fetching app environments')
  const theApp = await client.find({ _staging, token, appID })
  spinner.done()
  if (!theApp)
    return Error(`Unable to find App with id <${appID}>`)

  if (!env || (typeof env === 'string' && env.length === 0)){
    const prompt = new Select({
      name: 'env',
      message: 'Select an environment',
      choices: theApp.environments.map(e => ({ name: e.name, value: e.envID })),
      result (a) { return this.map(a)[a] },
    })
    env = await prompt.run()
  }

  const theEnv = theApp.environments.find(({ name, envID }) => [ name, envID ].includes(env))
  if (!theEnv)
    return Error(`App <${appID}> does not have an environment "${env}"`)

  if (!yes){
    const prompt = new Confirm({
      name: 'confirm',
      message: `Link ${fDomain} to ${f.app.name(theApp.name)}'s "${f.env.name(theEnv.name)}" env?`,
    })
    const confirmed = await prompt.run()

    if (!confirmed) return Error('Domain link cancelled')
  }

  const result = await client.domains.link({
    _staging,
    token,
    domainID: theDomain.domainID,
    appID: theApp.appID,
    envID: theEnv.envID,
  })

  if (result.success) {
    const message = [ `${fDomain} is being linked to the ${f.app.name(theApp.name)} app's "${f.env.name(theEnv.name)}" env` ]
    if (theDomain.managed) {
      message.push('This may take a several minutes as we provision DNS and SSL certificates.')
      message.push('Check progress with: begin domains list')
    }
    else {
      message.push('In a few minutes, run the following command to get an additional DNS validation record:')
      message.push(`begin domains link --domain ${domainName}`)
    }

    return message.join('\n')
  }
  else
    return Error('Unable to link domain. Please try again later.')
}

module.exports = {
  name: 'link',
  description: 'Associate a domain from your Begin account to an app',
  action,
}
