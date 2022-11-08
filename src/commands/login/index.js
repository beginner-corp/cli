module.exports = {
  names: { en: [ 'login' ] },
  action,
  help: {
    en: {
      usage: [ 'login' ],
      description: 'Log into Begin to create and administer your apps',
    }
  }
}

async function action (params) {
  let { appVersion, cliDir, clientIDs = {}, printer } = params
  let { join } = require('path')
  let { existsSync, readFileSync } = require('fs')
  let writeFile = require('../../lib').writeFile(params)
  let configFile = join(cliDir, 'config.json')
  let now = new Date().toISOString()
  let headers = { 'content-type': 'application/x-www-form-urlencoded' }

  let config
  function writeConfig () {
    if (!config) return
    writeFile(configFile, JSON.stringify(config, null, 2))
  }

  if (!existsSync(configFile)) {
    config = {
      '// Begin config': `you can edit this file, just be sure to keep your 'access_token' secret (if you have one)`,
      created: now,
      createdVer: appVersion,
      modified: now,
    }
    writeConfig()
  }
  else {
    config = JSON.parse(readFileSync(configFile))
  }
  let { access_token, device_code, stagingAPI } = config
  let { __BEGIN_TEST_URL__ } = process.env
  let domain = __BEGIN_TEST_URL__
    ? __BEGIN_TEST_URL__
    : `https://${stagingAPI ? 'staging-' : ''}api.begin.com`
  let clientID = stagingAPI ? clientIDs.staging : clientIDs.production

  // User is logged in
  if (access_token && device_code) {
    return 'You are already logged in, yay!'
  }
  // User did not complete login, reset the codes + tokens and start again
  else if (!access_token) {
    if (device_code) {
      console.error('Found incomplete login, trying again')
      delete config.device_code
    }
    config.modified = now
    writeConfig()
    let tiny = require('tiny-json-http')
    let url = domain + '/devicecode'
    try {
      let { body } = await tiny.post({
        url,
        headers,
        data: { client_id: clientID }
      })

      let expired = Date.now() + (30 * 1000) // 30 minute TTL
      let { device_code, user_code, verification_uri } = body
      Object.entries({ device_code, user_code, verification_uri }).forEach(([ name, value ]) => {
        if (!value) throw ReferenceError(`Login did not receive ${name} from login endpoint`)
      })

      config = { ...config, device_code }
      writeConfig()
      console.error(`Please authenticate by visiting: ${verification_uri}?user_code=${user_code}`)
      console.error('Awaiting authentication...')

      // Begin polling
      let access_token = await getAccessToken({ clientID, device_code, domain, expired, headers, printer, tiny })
      config = { ...config, access_token }
      writeConfig()
      return 'Successfully logged in!'
    }
    catch (err) {
      return err
    }
  }
}

async function getAccessToken (params) {
  let { clientID, device_code, domain, expired, headers, printer, tiny } = params
  let timeout = 3 * 1000
  let tries = 0
  return new Promise((res, rej) => {
    async function poll () {
      printer.debug(`Polling token API (${tries})...`)
      tries++
      if (Date.now() > expired) return rej('Timed out')
      try {
        let { body } = await tiny.post({
          url: domain + '/token',
          headers,
          data: {
            client_id: clientID,
            device_code,
          }
        })
        if (body.access_token) res(body.access_token)
        else throw ReferenceError('Expected access_token')
      }
      catch (err) {
        if (err?.body?.error === 'authorization_pending') setTimeout(poll, timeout)
        else rej(err)
      }
    }
    poll()
  })
}
