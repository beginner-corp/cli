module.exports = async function action (params /* utils */) {
  let { args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let c = require('@colors/colors/safe')

  let temporary = args.temporary || args.temp || args.t
  let tokenType = temporary ? 'personal_access_temporary' : 'personal_access'

  let client = require('@begin/api')
  let { tokenID, expires } = await client.tokens.create({ token, tokenType, _staging })

  let temp = temporary ? 'temporary ' : ''
  let string = `Created new ${temp}token: ${c.bold(tokenID)} (expires ${expires})\n` +
                `Treat this token as a secret; ${c.bold('do not share or publish it publicly')}`
  return {
    string,
    json: { tokenID, expires },
  }
}
