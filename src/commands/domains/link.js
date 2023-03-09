async function action (params) {
  let c = require('picocolors')
  let client = require('@begin/api')
  let { config, domain, appID, env } = params
  let { access_token: token, stagingAPI: _staging } = config

  if (!domain || (typeof domain === 'string' && domain.length === 0))
    return Error('Please specify a domain with --domain')
  if (!appID || (typeof appID === 'string' && appID.length === 0))
    return Error('Please specify an app ID with --app')
  if (!env || (typeof env === 'string' && env.length === 0))
    return Error('Please specify an environment with --env')

  let theApp = await client.find({ token, _staging, appID })
  if (!theApp)
    return Error(`Unable to find App with id <${appID}>`)

  let theEnv = theApp.environments.find(({ name, envID }) => [ name, envID ].includes(env))
  if (!theEnv)
    return Error(`App <${appID}> does not have an environment named "${env}"`)

  let domains = await client.domains.list({ token, _staging })
  let theDomain = domains.find(d => d.domain === domain)

  if (!theDomain)
    return Error([
      `You do not subscribe to the domain "${domain}".`,
      `To subscribe, run: begin domains check ${domain}`,
    ].join('\n'))

  let result = await client.domains.associate({
    token,
    _staging,
    domainID: theDomain.domainID,
    appID: theApp.appID,
    envID: theEnv.envID,
  })

  if (result.success)
    return [
      `${c.underline(c.cyan(domain))} is being linked to the ${c.bold(theApp.name)} app's "${theEnv.name}" env`,
      'This may take a several minutes as we provision DNS and SSL certificates.',
      'Check progress with: begin domains list',
    ].join('\n')
  else
    return Error('Unable to link domain. Please try again later.')
}

module.exports = {
  name: 'link',
  description: 'Associate a domain from your Begin account to an app',
  action,
  help: {
    en: {
      usage: [ 'domains link' ],
      description: 'Link a domain to an app',
      examples: [
        {
          name: 'Link begin.com to an app',
          example: 'begin domains link --domain begin.com --env <name|ID> --app [ID]',
        },
      ]
    }
  }
}
