async function action (params) {
  const client = require('@begin/api')
  const states = require('./_states')
  const f = require('../../lib/format')()
  const spinner = require('../../lib/spinner')
  const { config, domain } = params
  const { access_token: token, stagingAPI: _staging } = config

  if (!domain || (typeof domain === 'string' && domain.length === 0))
    return Error('Please specify a domain to validate.')

  let domains = await client.domains.list({ token, _staging })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  const theDomain = domains.find(d => d.domain === domain)
  if (!theDomain)
    return Error([
      `You do not subscribe to the domain "${domain}".`,
      `To subscribe, run: begin domains add ${domain}`,
    ].join('\n'))

  if (theDomain.managed)
    return Error(`Domain ${f.d.managed(domain)} is managed by Begin.`)
  if (theDomain.status === states.ACTIVE)
    return Error(`Domain ${f.d.external(domain)} is already validated.`)

  const { domainID } = theDomain
  spinner(`Requesting validation for ${f.d.external(domain)} ${f.ID(domainID)}`)
  let validated
  let validationRecord
  try {
    const response = await client.domains.validate({ token, domainID, _staging })
    validated = response.validated
    validationRecord = response.validationRecord
  }
  catch (error) {
    return error
  }
  spinner.done()
  if (validated)
    return [
      `Domain ${f.d.external(domain)} is validated!`,
      'You can now use "begin domains link" to link your app to this domain.',
    ].join('\n')
  return [
    `Add a CNAME record to ${f.d.external(domain)} with the following name and value:`,
    `Name:  ${f.name(validationRecord.Name)}`,
    `Value: ${f.name(validationRecord.Value)}`,
    `Once the record is added, run: begin domains validate --domain ${domain}`,
    'It may take several minutes for the DNS record to propagate. Continue to check with this command.',
  ].join('\n')
}

module.exports = {
  name: 'validate',
  description: 'Validate an external domain with DNS entries',
  action,
}
