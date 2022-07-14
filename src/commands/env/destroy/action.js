module.exports = async function action (params, utils) {
  let { appID, args, token } = params
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

  if (errors.length) {
    return error(errors)
  }

  try {
    let { name, environments } = await client.find({ token, appID })
    let environment = environments.find(item => item.envID === env)
    await client.env.vars.remove({ token, appID, envID: env, vars: [ key ] } )
    console.log(`Successfully destroyed environment variable ${key} in '${name}' (app ID: ${appID})' '${environment.name}' (env ID: ${env})`)
  }
  catch (err) {
    return error([ 'destroy_fail' ])
  }
}
