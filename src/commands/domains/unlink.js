async function action (params) {
  const client = require('@begin/api')
  const c = require('@colors/colors/safe')
  const { Confirm, Select } = require('enquirer')
  const spinner = require('../../lib/spinner')
  const states = require('./_states')
  let { domain, yes } = params
  const { access_token: token, stagingAPI: _staging } = params.config

  const domains = await client.domains.list({ _staging, token })

  if (!domain || (typeof domain === 'string' && domain.length === 0)) {
    const prompt = new Select({
      name: 'domain',
      message: 'Select a domain to unlink',
      choices: domains.filter(d => d.status === states.LINKED).map(d => d.domain),
    })
    domain = await prompt.run()
  }

  const theDomain = domains.find(d => d.domain === domain)
  if (!theDomain)
    return Error(`Unable to find domain "${domain}"`)

  const { appLink } = theDomain
  if (!appLink)
    return Error(`Domain "${domain}" is not correctly linked to an app. Contact support@begin.com`)

  spinner('Verifying app')
  const theApp = await client.find({ _staging, token, appID: appLink.appID })
  spinner.done()
  if (!theApp)
    return Error(`Unable to find App with id <${appLink.appID}>`)

  const theEnv = theApp.environments.find(({ envID }) => envID === appLink.envID)
  if (!theEnv)
    return Error(`App <${appLink.appID}> does not have an environment "${appLink.envID}"`)

  if (!yes) {
    const prompt = new Confirm({
      name: 'confirm',
      message: `Unlink ${c.underline(c.cyan(domain))} from ${c.bold(theApp.name)}'s "${theEnv.name}" env?`,
    })
    const confirmed = await prompt.run()

    if (!confirmed) return Error('Domain unlink cancelled')
  }

  const result = await client.domains.unlink({
    _staging,
    token,
    domainID: theDomain.domainID,
    appID: theApp.appID,
    envID: theEnv.envID,
  })

  if (result.success)
    return [
      `${c.cyan(domain)} is being unlinked`,
      `It may take several minutes before ${c.cyan(domain)} is available to re-link.`,
    ].join('\n')
  else
    return Error('Unable to unlink domain. Please try again later.')
}

module.exports = {
  name: 'unlink',
  description: 'Dissociate a domain from an app environment.',
  action,
}
