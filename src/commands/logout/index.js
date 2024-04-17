module.exports = {
  names: { en: [ 'logout' ] },
  action,
  help: {
    en: {
      usage: [ 'logout' ],
      description: 'Log out of Begin and destroy the current access token',
    },
  },
}

async function action (params) {
  let { cliDir, clientIDs = {}, args } = params
  let { join } = require('path')
  let { existsSync, readFileSync } = require('fs')
  let writeFile = require('../../lib').writeFile(params)
  let cliFilename = args?.staging ? 'config-staging.json' : 'config.json'
  let configPath = join(cliDir, cliFilename)

  if (!existsSync(configPath)) {
    return Error('Config file not found, cannot log out of Begin session')
  }

  let config = JSON.parse(readFileSync(configPath).toString())
  let { access_token, stagingAPI } = config
  let { __BEGIN_TEST_URL__ } = process.env
  let domain = __BEGIN_TEST_URL__
    ? __BEGIN_TEST_URL__
    : `https://${stagingAPI ? 'staging-' : ''}api.begin.com`
  let clientID = stagingAPI ? clientIDs.staging : clientIDs.production

  if (!clientID && __BEGIN_TEST_URL__) {
    clientID = 'test'
  }
  if (!clientID) {
    return Error('Cannot log out without a valid client ID')
  }
  if (!access_token) {
    return Error('Cannot log out without a valid access token')
  }

  let tiny = require('tiny-json-http')
  let url = domain + `/clients/${clientID}/token/delete`
  let message = ''
  try {
    let authorization = `Bearer ${access_token}`
    await tiny.post({
      url,
      headers: { authorization },
      body: { access_token },
    })
  }
  catch (err) {
    if (err?.body?.errors?.includes('token_invalid_or_expired'))
      message = 'Could not revoke access token, it may have already expired.'
    else
      // err can be vague here; try to get a more specific message
      message = err?.body?.error || err?.body?.errors || err?.message || err || 'Unknown error'
    message += '\n'
  }
  finally {
    let now = new Date().toISOString()
    config.modified = now
    delete config.access_token
    delete config.device_code
    writeFile(configPath, JSON.stringify(config, null, 2))
    message += 'Successfully logged out!'
  }

  return message
}
