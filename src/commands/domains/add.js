async function action (params) {
  let c = require('picocolors')
  let client = require('@begin/api')
  let { config, domain } = params
  let { access_token: token, stagingAPI: _staging } = config

  if (!domain)
    return Error('Please specify a domain name like: begin domains add --domain begin.com')

  let availability = await client.domains.check({ token, domain, _staging })
  let { available, suggestions, purchaseLink } = availability

  let output = []
  if (available) {
    output.push(`Good news! ${c.green(c.bold(domain))} is available!`)
    output.push(`Subscribe here: ${c.bold(c.cyan(purchaseLink))}.`)
    output.push(`Learn more about Begin domain subscriptions here: ${c.cyan('https://begin.com/')}.`)
  }
  else {
    output.push(`Sorry, ${c.red(c.bold(domain))} is unavailable.`)
    if (suggestions.length) {
      output.push(c.white('Some suggestions:'))
      suggestions.slice(1, 11).forEach(suggestion => {
        output.push(`  ${c.gray(suggestion.DomainName)}`)
      })
    }
  }

  return output.join('\n')
}

module.exports = {
  name: 'check',
  description: 'Check domain availability',
  action,
  help: {
    en: {
      usage: [ 'domains check' ],
      description: 'Check domain availability',
      examples: [
        {
          name: 'Check begin.com availability',
          example: 'begin domains check begin.com',
        },
      ]
    }
  }
}
