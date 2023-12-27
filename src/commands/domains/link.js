async function action (params) {
  const client = require('@begin/api')
  const c = require('@colors/colors/safe')
  const { Confirm, Select } = require('enquirer')
  const spinner = require('../../lib/spinner')
  const states = require('./_states')
  let { domain, appID, env, yes } = params
  const { access_token: token, stagingAPI: _staging } = params.config

  const domains = await client.domains.list({ _staging, token })
  if (!domains.length)
    return Error('No domains found. Start by running: begin domains add --domain <domain>')

  if (!domain || (typeof domain === 'string' && domain.length === 0)){
    const prompt = new Select({
      name: 'domain',
      message: 'Select a domain',
      choices: domains.filter(d => d.status === states.ACTIVE).map(d => d.domain),
    })
    domain = await prompt.run()
  }

  const theDomain = domains.find(d => d.domain === domain)
  if (!theDomain)
    return Error([
      `You do not subscribe to the domain "${domain}".`,
      `To subscribe, run: begin domains add ${domain}`,
    ].join('\n'))

  if (!appID || (typeof appID === 'string' && appID.length === 0)){
    spinner('Fetching apps')
    const apps = await client.list({ _staging, token })
    spinner.done()
    const prompt = new Select({
      name: 'appID',
      message: 'Select an app',
      choices: apps.map(a => ({ name: a.name, value: a.appID })),
      result (a) { return this.map(a)[a] },
    })
    appID = await prompt.run()
  }

  spinner('Fetching app environments')
  const theApp = await client.find({ _staging, token, appID })
  spinner.done()
  if (!theApp)
    return Error(`Unable to find App with id <${appID}>`)

  if (!env || (typeof env === 'string' && env.length === 0)){
    const prompt = new Select({
      name: 'env',
      message: 'Select an environment',
      choices: theApp.environments.map(e => ({ name: e.name, value: e.envID })),
      result (a) { return this.map(a)[a] },
    })
    env = await prompt.run()
  }

  const theEnv = theApp.environments.find(({ name, envID }) => [ name, envID ].includes(env))
  if (!theEnv)
    return Error(`App <${appID}> does not have an environment "${env}"`)

  if (!yes){
    const prompt = new Confirm({
      name: 'confirm',
      message: `Link ${c.underline(c.cyan(domain))} to ${c.bold(theApp.name)}'s "${theEnv.name}" env?`,
    })
    const confirmed = await prompt.run()

    if (!confirmed) return Error('Domain link cancelled')
  }

  const result = await client.domains.link({
    _staging,
    token,
    domainID: theDomain.domainID,
    appID: theApp.appID,
    envID: theEnv.envID,
  })

  if (result.success)
    return [
      `${c.underline(c.cyan(domain))} is being linked to the ${c.bold(theApp.name)} app's "${theEnv.name}" env`,
      'This may take a several minutes as we provision DNS and SSL certificates.',
      'Check progress with: begin domains list',
    ].join('\n')
  else
    return Error('Unable to link domain. Please try again later.')
}

module.exports = {
  name: 'link',
  description: 'Associate a domain from your Begin account to an app',
  action,
}
