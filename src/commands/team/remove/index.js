module.exports = async function action (params) {
  let { app, args, appID, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let c = require('@colors/colors/safe')
  let client = require('@begin/api')
  let username = args._[2]
  if (!username) return Error('Please specify a username to remove')

  try {
    let { teammates } = await client.team.list({ token, appID, _staging })
    let user = teammates.find(t => t.username === username)
    if (!user) return Error('Username not found in this app')
    let { accountID } = user
    let result = await client.team.remove({ token, appID, _staging, accountID })
    if (result.success) {
      return `Successfully removed ${username} from ${c.bold(app.name)} (app ID: ${app.appID})`
    }
  }
  catch (err) {
    if (err.message === 'accountID_not_found') {
      return Error(`User ${username} not found in this app`)
    }
    if (err.message === 'not_authorized') {
      return Error(`You are not authorized to remove users from this app; if you are trying to remove yourself, please use the \`begin team leave\` command`)
    }
    return err
  }
}
