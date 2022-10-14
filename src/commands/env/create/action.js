module.exports = async function action (params, utils) {
  let { appID, args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let error = require('../errors')(params, utils)
  let errors = []

  // Environment (required)
  let env = args.e || args.env
  if (!env || env === true) {
    errors.push('no_env')
  }

  // Key (required)
  let key = args.k || args.key
  if (!key || key === true) {
    errors.push('no_key')
  }

  // Value (required)
  let value = args.v || args.value
  if (!value || value === true) {
    errors.push('no_value')
  }

  if (errors.length) {
    return error(errors)
  }

  let vars = {}
  vars[key] = value

  try {
    let { name, environments } = await client.find({ token, appID, _staging })
    let environment = environments.find(item => item.envID === env)
    await client.env.vars.add({ token, appID, envID: env, vars, _staging } )
    console.log(`Successfully created environment variable ${key} in '${name}' (app ID: ${appID})' '${environment.name}' (env ID: ${env})`)
  }
  catch (err) {
    return error([ 'create_fail' ])
  }
}
