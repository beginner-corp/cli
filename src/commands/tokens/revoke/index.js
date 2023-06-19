module.exports = async function action (params) {
  let { appID, args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let tokenID = args._[2]

  try {
    await client.tokens.revoke({ token, appID, tokenID, _staging })
    return {
      string: `Revoked token ${tokenID}`,
      json: { tokenID }
    }
  }
  catch (err) {
    return err
  }
}
