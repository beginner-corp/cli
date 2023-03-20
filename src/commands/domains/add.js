async function action (params) {
  let c = require('picocolors')
  let client = require('@begin/api')
  let { config, domain } = params
  let { access_token: token, stagingAPI: _staging } = config

  if (!domain)
    return Error('Please specify a domain name like: begin domains add --domain begin.com')

  let { available, suggestions, purchaseLink } = await client.domains.check({ token, domain, _staging })

  let output = []
  if (available) {
    output.push(`Good news! ${c.green(c.bold(domain))} is available!`)
    output.push(`Subscribe here: ${c.bold(c.cyan(purchaseLink))}.`)
    output.push(`Learn more about Begin domain subscriptions here: ${c.cyan('https://begin.com/docs/')}.`)
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
  name: 'add',
  description: 'Start adding a domain subscription to your Begin account',
  action,
  help: {
    en: {
      usage: [ 'domains add' ],
      description: 'Check domain availability',
      examples: [
        {
          name: 'Check begin.com availability',
          example: 'begin domains add --domain begin.com',
        },
      ]
    }
  }
}
