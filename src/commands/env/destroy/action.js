module.exports = async function action (params) {
  let { app, appID, args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let error = require('../errors')(params)

  // Environment (required)
  let env = args.env || args.e
  if (!env || env === true) {
    return error('no_env')
  }
  else {
    let envs = app.environments
    var environment = envs.find(({ name, envID }) => [ name, envID ].includes(env))
    if (!environment) return Error(`Environment ${env} not found`)
  }
  let { envID } = environment

  // Name (required)
  let name = args.name || args.n || args.key || args.k
  if (!name || name === true) {
    return error('no_name')
  }
  name = name.toUpperCase()

  try {
    await client.env.vars.remove({ _staging, appID, envID, token, vars: [ name ] })
    return `Successfully destroyed environment variable ${name} in '${environment.name}'`
  }
  catch (err) {
    return error('destroy_fail')
  }
}
