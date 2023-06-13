module.exports = async function action (params, utils) {
  let { app, appID, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let { list } = utils
  let client = require('@begin/api')
  let c = require('picocolors')

  let { teammates } = await client.team.list({ token, appID, _staging })
  let longestUsername = teammates
    .reduce((acc, cur) => acc.username.length >= cur.username.length ? acc : cur)
    .username.length

  console.error(`${c.bold(app.name)} (app ID: ${appID})`)
  let output = [ 'Active teammates' ]
  teammates.forEach(({ /* name, */ username, role }, i) => {
    let lastEnv = teammates.length - 1
    let draw = lastEnv === i ? list.last : list.item
    output.push([
      `${draw} ${username.padEnd(longestUsername + 2)}`,
      `(${role})`,
    ].join(''))
  })

  // TODO list active invite codes

  return output.join('\n')
}
