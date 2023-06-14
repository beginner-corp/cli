module.exports = async function action (params, utils) {
  let { app, appID, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let { list } = utils
  let client = require('@begin/api')
  let c = require('picocolors')

  let { teammates, invites } = await client.team.list({ token, appID, _staging })
  let longestUsername = teammates
    .reduce((acc, cur) => acc.username.length >= cur.username.length ? acc : cur)
    .username.length

  console.error(`${c.bold(app.name)} (app ID: ${appID})`)
  let output = [ 'Active teammates' ]
  let last = teammates.length - 1
  teammates.forEach(({ /* name, */ username, role }, i) => {
    let draw = last === i ? list.last : list.item
    output.push([
      `${draw} ${username.padEnd(longestUsername + 2)}`,
      `(${role})`,
    ].join(''))
  })

  if (invites.length) {
    output.push('\nGenerated invite codes')
    let last = invites.length - 1
    invites.forEach(({ inviteID, /* created, createdBy, */ expires, role }, i) => {
      if (Date.now() > expires) return
      let draw = last === i ? list.last : list.item
      output.push([
        `${draw} ${inviteID} (${role}, expires: ${new Date(expires).toISOString()})`,
      ].join(''))
    })
  }

  return output.join('\n')
}
