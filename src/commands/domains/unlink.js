async function action (params) {
  let c = require('picocolors')
  let client = require('@begin/api')
  let { config, domain, appID, env } = params
  let { access_token: token, stagingAPI: _staging } = config

  if (!domain || (typeof domain === 'string' && domain.length === 0))
    return Error('Please specify a domain with --domain')

  let domains = await client.domains.list({ token, _staging })
  let theDomain = domains.find(d => d.domain === domain)

  if (!theDomain) return Error(`Unable to find domain "${domain}"`)

  let envID
  if (appID && env) {
    let theApp = await client.find({ token, _staging, appID })
    let theEnv = theApp.environments.find(({ name, envID }) => [ name, envID ].includes(env))
    envID = theEnv.envID
  }

  // TODO: confirm with user; it can take time to unlink a domain

  let result = await client.domains.unlink({
    token,
    _staging,
    domainID: theDomain.domainID,
    appID,
    envID,
  })

  if (result.success)
    return [
      `${c.cyan(domain)} is being unlinked`,
      `It may take several minutes before ${c.cyan(domain)} is available to re-link.`,
    ].join('\n')
  else
    return Error('Unable to unlink domain. Please try again later.')
}

module.exports = {
  name: 'unlink',
  description: 'Dissociate a domain from an app environment.',
  action,
  help: {
    en: {
      usage: [ 'domains unlink' ],
      description: 'Unlink from a domain',
      examples: [
        {
          name: 'unlink a domain',
          example: 'begin domains unlink --domain begin.com',
        },
      ]
    }
  }
}
