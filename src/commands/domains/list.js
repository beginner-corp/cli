async function action (params) {
  let c = require('picocolors')
  let client = require('@begin/api')
  let { config } = params
  let { access_token: token, stagingAPI: _staging } = config

  let domains = await client.domains.list({ token, _staging })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  let output = domains.map(({ domain, status, domainID }) =>
    `${c.underline(c.cyan(domain))} - ${status} <${domainID}>`
  )

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
