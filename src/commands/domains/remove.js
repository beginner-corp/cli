async function action (params) {
  let c = require('@colors/colors/safe')
  const client = require('@begin/api')
  let { config, domain } = params
  let { access_token: token, stagingAPI: _staging } = config

  const domains = await client.domains.list({ _staging, token })
  const theDomain = domains.find(d => d.domain === domain)

  if (!theDomain)
    return Error([
      `You do not subscribe to the domain "${domain}".`,
      `To subscribe, run: begin domains add ${domain}`,
    ].join('\n'))

  const { managed, domainID } = theDomain

  if (managed) {
    // TODO: create link for Stripe customer dashbaord
    return [
      c.bold(c.red('Sorry, this feature is not yet implemented')),
      c.gray('Please contact support@begin.com regarding domain subscriptions.'),
    ].join('\n')
  }
  else {
    const { Confirm } = require('enquirer')
    const prompt = new Confirm({
      name: 'remove',
      message: `Are you sure you want to remove ${c.bold(domain)}?`,
    })
    const confirm = await prompt.run()
    if (confirm) {
      await client.domains.remove({ _staging, token, domainID })
      return `External domain ${c.green(c.bold(domain))} removed!`
    }
    else {
      return `External domain ${c.green(c.bold(domain))} not removed.`
    }
  }

}

module.exports = {
  name: 'remove',
  description: 'Cancel a Begin.com domain subscription',
  action,
}
