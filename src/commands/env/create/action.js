module.exports = async function action (params) {
  let { app, appID, args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let error = require('../errors')(params)
  let errors = []

  // Environment (required)
  let env = args.env || args.e
  if (!env || env === true) {
    errors.push('no_env')
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
    errors.push('no_name')
  }

  // Value (required)
  let value = args.value || args.v
  if (!value || value === true) {
    errors.push('no_value')
  }

  if (errors.length) {
    return error(errors)
  }

  try {
    await client.env.vars.add({ _staging, appID, envID, token, vars: { [name]: value } })
    return `Successfully created environment variable ${name} in '${environment.name}'`
  }
  catch (err) {
    return error('create_fail')
  }
}
