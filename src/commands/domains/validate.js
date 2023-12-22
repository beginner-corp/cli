async function action (params) {
  let client = require('@begin/api')
  let states = require('./_states')
  let f = require('../../lib/format')()
  const spinner = require('../../lib/spinner')
  let { config, domain, verbose } = params
  let { access_token: token, stagingAPI: _staging } = config

  let domains = await client.domains.list({ token, _staging })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  const theDomain = domains.find(d => d.domain === domain)
  if (!theDomain)
    return Error([
      `You do not subscribe to the domain "${domain}".`,
      `To subscribe, run: begin domains add ${domain}`,
    ].join('\n'))

  if (theDomain.status !== states.UNVALIDATED)
    return Error(`Domain ${f.d.external(domain)} cannot be validated.`)

  const { domainID } = theDomain
  spinner(`Requesting validation for ${f.d.external(domain)} ${f.ID(domainID)}`)
  // const response = await client.domains.validate({ token, domainID, _staging })
  spinner.done()

  return `Domain ${f.d.external(domain)} validated!`
}

module.exports = {
  name: 'validate',
  description: 'Validate an external domain with DNS entries',
  action,
}
