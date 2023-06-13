module.exports = async function action (params) {
  let { app, appID, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let c = require('picocolors')
  let client = require('@begin/api')

  try {
    let result = await client.team.leave({ token, appID, _staging })
    if (result.success) {
      return `Left app ${c.bold(app.name)} (app ID: ${app.appID}). Goodbye, friend!`
    }
  }
  catch (err) {
    if (err.message === 'cannot_leave_own_app') {
      return Error(`You cannot leave an app you own`)
    }
    return err
  }
}
