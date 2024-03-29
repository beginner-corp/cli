module.exports = async function action (params) {
  let { app, appID, args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let error = require('../errors')(params)
  let looseName = /^[a-zA-Z_][a-zA-Z0-9_]+$/

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
  if (!looseName.test(name) || name.length > 64) {
    return error('invalid_varname')
  }
  name = name.toUpperCase()

  // Value (required)
  let value = args.value || args.v
  if (!value || value === true) {
    return error('no_value')
  }

  // convert numerical values like say a port number to a string
  if (Number.isInteger(value)) {
    value = value.toString()
  }

  try {
    await client.env.vars.add({ _staging, appID, envID, token, vars: { [name]: value } })
    return `Successfully created environment variable ${name} in '${environment.name}'`
  }
  catch (err) {
    return error('create_fail')
  }
}
