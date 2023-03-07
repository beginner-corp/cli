async function action (params) {
  let c = require('picocolors')
  let { domains, config } = params
  let { args } = params
  let { access_token: token, stagingAPI: _staging } = config

  let domain = args.domain || args._[2]

  if (!domain)
    return Error('Please specify a domain name like: begin domains check begin.com')

  let availability = await domains.check({ token, domain, _staging })
  let { available, suggestions, purchaseLink } = availability

  let output = []
  if (available) {
    output.push(`Good news! ${c.green(c.bold(domain))} is available!`)
    output.push(`  Subscribe here: ${c.bold(c.cyan(purchaseLink))}.`)
    output.push(`  Learn more about Begin domain subscriptions here: ${c.cyan('https://begin.com/')}.`)
  }
  else {
    output.push(`Sorry, ${c.red(c.bold(domain))} is not available.`)
    if (suggestions.length) {
      output.push(c.white('  Some suggestions:'))
      suggestions.slice(1, 11).forEach(suggestion => {
        output.push(`    ${c.gray(suggestion.DomainName)}`)
      })
    }
  }

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
