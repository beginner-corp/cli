module.exports = async function action (params) {
  let { app, appID, args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let client = require('@begin/api')
  let c = require('@colors/colors/safe')
  let { role = 'collaborator' } = args

  try {
    let invite = await client.team.invite({ token, appID, _staging, role })
    let { inviteID, expires } = invite

    let message =
      `The following unique, single-use invite code grants \`${role}\` permissions ` +
      `for ${c.bold(app.name)} (app ID: ${appID}), and expires on: ${expires}\n` +
      `Send these instructions (privately) to your new teammate: ` +
      `\`${c.bold(c.blue(`begin team accept ${inviteID} --app ${appID}`))}\``

    return {
      string: message,
      json: invite
    }
  }
  catch (err) {
    if (err.message === 'invalid_role') {
      return Error(`Invalid role: '${role}'`)
    }
    return err
  }
}
