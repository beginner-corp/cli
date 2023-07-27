module.exports = async function action (params) {
  let { app, args, appID, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let c = require('@colors/colors/safe')
  let client = require('@begin/api')
  let tuple = args._[2]
  if (!tuple) return Error('Please specify a username:role pair to assign')
  let bits = tuple.split(':')
  let username = bits[0]
  let role = bits[1]

  try {
    let { teammates } = await client.team.list({ token, appID, _staging })
    let user = teammates.find(t => t.username === username)
    if (!user) return Error('Username not found in this app')
    let { accountID } = user
    let result = await client.team.role({ token, appID, _staging, accountID, role })
    if (result.success) {
      return `Successfully updated role of ${username} to ${role} in ${c.bold(app.name)} (app ID: ${app.appID})`
    }
  }
  catch (err) {
    if (err.message === 'accountID_not_found') {
      return Error(`User ${username} not found in this app`)
    }
    if (err.message === 'new_role_is_same') {
      return Error(`User ${username} already has the role ${role}`)
    }
    if (err.message === 'invalid_role') {
      return Error(`Invalid role: ${role}`)
    }
    return err
  }
}
