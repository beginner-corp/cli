module.exports = async function action (params) {
  let { appID, args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let inviteID = args._[2]

  try {
    let result = await client.team.revoke({ token, appID, _staging, inviteID })
    if (result.success) {
      return `Revoked invite code ${inviteID}`
    }
  }
  catch (err) {
    if (err.message === 'missing_inviteID') {
      return Error(`Missing invite code`)
    }
    if (err.message === 'inviteID_not_found') {
      return Error(`Invite code not found`)
    }
    if (err.message === 'invalid_request') {
      return Error(`Invalid request`)
    }
    return err
  }
}
