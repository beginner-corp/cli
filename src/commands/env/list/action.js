module.exports = async function action (params, utils) {
  let { appID, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let error = require('../errors')(params, utils)

  let app = null
  try {
    app = await client.find({ token, appID, _staging })
  }
  catch (err) {
    return error([ 'no_appid_found' ])
  }
  let  { environments, name } = app

  let item = '  ├──'
  let last = '  └──'

  let output = []
  output.push(`'${name}' (app ID: ${appID})`)
  if (!environments.length) {
    output.push(`${last} (no app environments)`)
  }
  else {
    let lastEnv = environments.length - 1
    environments.forEach(({ name, envID, url, vars }, i) => {
      let draw = lastEnv === i ? last : item
      output.push(`${draw} '${name}' (env ID: ${envID}): ${url}`)
      if (!Object.keys(vars).length) {
        output.push(`  ${last} (no environment variables)`)
      }
      else {
        let keys = Object.keys(vars)
        let lastVar = keys.length - 1
        keys.forEach((key, i) => {
          let draw = lastVar === i ? last : item
          output.push(`  ${draw} ${key}=${vars[key]}`)
        })
      }
    })
  }
  return output.join('\n')
}
