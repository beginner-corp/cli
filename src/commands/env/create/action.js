module.exports = async function action (params, utils) {
  let { args, token } = params
  let client = require('@begin/api')
  let error = require('../errors')(params, utils)
  let errors = []

  // App ID (required)
  let id = args.a || args.appid
  if (!id || id === true) {
    errors.push('no_appid')
  }

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

  await client.env.vars.add({ token, appID: id, envID: env, vars } )
}
