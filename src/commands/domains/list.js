async function action (params) {
  let c = require('picocolors')
  let { domains, config } = params
  let { access_token: token, stagingAPI: _staging } = config

  let ownedDomains = await domains.list({ token, _staging })
  if (!ownedDomains.length)
    return Error('No domains found. Start by checking a name with: `begin domains check <domain>')

  let output = []
  ownedDomains.forEach(({ domain, status }) => {
    output.push(`${c.white(c.bold(domain))} (${status})`)
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
