let names = { en: [ 'domains' ] }
let help = require('./help')
let { getConfig } = require('../../lib')

async function action (params) {
  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to list your Begin domains, please run: begin login'
    return Error(msg)
  }
  let { access_token: token, stagingAPI: _staging } = config

  let c = require('picocolors')
  let client = require('@begin/api')
  let domains = await client.domains.list({ token, _staging })
  if (!domains.length) return Error('No domains found. Start by checking a name with: `begin domains check <domain>')

  let output = []
  domains.forEach(({ domain, status }) => {
    output.push(`${c.white(c.bold(domain))} (${status})`)
  })
  return output.join('\n')
}

module.exports = {
  names,
  action,
  help,
}
