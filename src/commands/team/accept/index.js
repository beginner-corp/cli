module.exports = async function action (params) {
  let { appID, args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let inviteID = args._[2]

  try {
    let result = await client.team.accept({ token, appID, _staging, inviteID })
    if (result.success) {
      return `Accepted invite code ${inviteID}`
    }
  }
  catch (err) {
    if (err.message === 'cannot_join_own_app') {
      return Error(`You cannot accept an invite for an app you own`)
    }
    return err
  }
}
