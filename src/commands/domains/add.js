let attempts = 3

async function checkDomain ({ domain, token, _staging }) {
  let client = require('@begin/api')
  let check = await client.domains.check({ token, domain, _staging })
  attempts--
  return check
}

async function action (params) {
  let c = require('picocolors')
  let { config, domain, verbose } = params
  let { access_token: token, stagingAPI: _staging } = config

  if (!domain)
    return Error('Please specify a domain name like: begin domains add --domain begin.com')

  let check
  let available
  let availability
  try {
    check = await checkDomain({ token, domain, _staging })
    available = check.available
    availability = check.availability
  }
  catch (error) {
    if (error.message.startsWith('unsupported_tld'))
      return `Sorry, the .${c.bold(domain.split('.')[1])} TLD is currently unsupported.`
    else throw error
  }

  let output = []
  if (available) { // domain is definitely available
    output.push(`${c.green(c.bold(domain))} is available!`)
    output.push(`Subscribe here: ${c.bold(c.cyan(check.purchaseLink))}`)
    output.push(`Learn more about domain subscriptions: ${c.cyan('https://begin.com/docs/cli/commands/domain-subscriptions')}.`)
  }
  else if (availability === 'PENDING' || availability === 'DONT_KNOW') {
    output.push(`${c.cyan(c.bold(domain))} availability is unknown, please try again.`)
    if (verbose) {
      console.log(`Availability: "${availability}". Retrying ${attempts} more times.`)
      output.push(`Availability: "${availability}"`)
    }
    if (attempts > 0) return action(params)
  }
  else {
    output.push(`Sorry, ${c.red(c.bold(domain))} is unavailable.`)
    if (check.suggestions && Array.isArray(check.suggestions)) {
      output.push(c.white('Some suggestions:'))
      check.suggestions.slice(1, 16).forEach(suggestion => {
        output.push(`  ${c.cyan(suggestion.DomainName)}`)
      })
    }
  }

  return output.join('\n')
}

module.exports = {
  name: 'add',
  description: 'Start adding a domain subscription to your Begin account',
  action,
}
