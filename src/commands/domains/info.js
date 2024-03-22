async function action (params) {
  const dns = require('dns/promises')
  const client = require('@begin/api')
  // const states = require('./_states')
  const f = require('../../lib/format')()
  const { config, domain } = params
  const { access_token: token, stagingAPI: _staging } = config

  if (!domain || (typeof domain === 'string' && domain.length === 0))
    return Error('Please specify a domain to validate.')

  const domains = await client.domains.list({ token, _staging })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  const theDomain = domains.find(d => d.domain === domain)
  if (!theDomain)
    return Error([
      `You do not subscribe to the domain "${domain}".`,
      `To subscribe, run: begin domains add ${domain}`,
    ].join('\n'))

  const { domainID, status, cloudFront, appLink } = theDomain
  const fDomain = theDomain.managed ? f.d.managed(domain) : f.d.external(domain)

  const message = [ `Domain ${fDomain} ${f.ID(domainID)} is "${f.italic(status)}"` ]
  const checks = []
  if (theDomain.managed)
    message.push(`${fDomain} is managed by Begin.`)
  else
    message.push(`${fDomain} is managed externally.`)

  if (cloudFront) {
    message.push(`${fDomain} has a "CloudFront" record`)
    if (cloudFront.distributionID)
      message.push(`  Distribution: ${f.ID(cloudFront.distributionID)}`)
    if (cloudFront.certArn)
      message.push(`  Certificate: ${f.ID(cloudFront.certArn)}`)
    if (cloudFront.certDnsValidationRecord) {
      message.push('  Validation:')
      message.push(`    Name: ${f.italic(cloudFront.certDnsValidationRecord.Name)}`)
      message.push(`    Value: ${f.italic(cloudFront.certDnsValidationRecord.Value)}`)
      checks.push({
        type: cloudFront.certDnsValidationRecord.Type,
        host: cloudFront.certDnsValidationRecord.Name,
        value: cloudFront.certDnsValidationRecord.Value,
      })
    }
  }

  if (appLink) {
    message.push(`${fDomain} has an "app link" record`)
    message.push(`  App: ${f.ID(appLink.appID)}`)
    message.push(`  Env: ${f.ID(appLink.envID)}`)

    if (appLink.apiG) {
      message.push('  API Gateway:')
      message.push(`    ID: ${f.ID(appLink.apiG.apiGID)}`)
      message.push(`    Mapping: ${f.ID(appLink.apiG.mappingID)}`)
      message.push(`    Certificate: ${f.ID(appLink.apiG.certificateArn)}`)

      if (appLink.apiG.certDnsValidationRecord) {
        message.push('  Validation:')
        message.push(`    Name: ${f.italic(appLink.apiG.certDnsValidationRecord.Name)}`)
        message.push(`    Value: ${f.italic(appLink.apiG.certDnsValidationRecord.Value)}`)
        checks.push({
          type: appLink.apiG.certDnsValidationRecord.Type,
          host: appLink.apiG.certDnsValidationRecord.Name,
          value: appLink.apiG.certDnsValidationRecord.Value,
        })
      }
    }

    if (appLink.dnsAliasTarget) {
      message.push(`  DNS Alias: ${f.italic(appLink.dnsAliasTarget.DNSName)}`)
      checks.push({
        type: 'ALIAS',
        host: domain,
        value: appLink.dnsAliasTarget.DNSName,
      })
    }
  }

  if (checks.length > 0) {
    message.push('DNS Checks (local to this machine):')
    for (const check of checks) {
      const { type, host, value } = check
      if (type === 'ALIAS') {
        const hostARecords = await dns.resolve(host, 'A')
        const valueARecords = await dns.resolve(value, 'A')
        if (hostARecords.sort().join(';') === valueARecords.sort().join(';')) {
          message.push([
            `  ${f.green('✓')} ${f.bold(type)} record: ${f.italic(host)}`,
            `    ${f.italic(value)}`,
          ].join('\n'))
        }
        else {
          message.push([
            `  ${f.red('x')} ${f.bold(type)} record: ${f.italic(host)}`,
            `    ${f.italic(value)}`,
          ].join('\n'))
        }
      }
      else {
        try {
          const checkPart = value.split('.')[0]
          const records = await dns.resolve(host, type)
          const found = records.some(r => r.startsWith(checkPart))
          message.push([
            `  ${found ? f.green('✓') : f.red('x')} ${f.bold(type)} record: ${f.italic(host)} `,
            `    ${f.italic(value)}`,
          ].join('\n'))
        }
        catch (e) {
          message.push([
            `  ${f.red('x')} ${f.bold(type)} record: ${f.italic(host)}`,
            `    ${f.italic(value)}`,
          ].join('\n'))
        }
      }
    }
  }

  return message.join('\n')
}

module.exports = {
  name: 'info',
  description: 'Get information about a domain',
  action,
}
