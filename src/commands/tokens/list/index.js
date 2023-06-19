module.exports = async function action (params, utils) {
  let { args, config } = params
  let { access_token: token, stagingAPI: _staging } = config
  let { list } = utils
  let { display } = args
  let sort = (a, b) => a.created < b.created ? -1 : 1
  let part = str => Math.floor(str.length * .8)
  let sanitize = str => display ? str : new Array(part(str)).join('*') + str.substring(part(str))

  let client = require('@begin/api')
  let { clientTokens, personalTokens } = await client.tokens.list({ token, _staging })
  let space = ''.padStart(list.item.length, ' ')

  console.error(`Client tokens`)
  let output = []
  let last = clientTokens.length - 1
  function addTokens ({ tokenID, created, lastUsed, expires, temporary }, i) {
    let draw = last === i ? list.last : list.item
    let line = last === i ? ' ' : list.line
    let temp = temporary ? ' (temporary)' : ''
    output.push([
      `${draw} ${sanitize(tokenID)}${temp}`,
      `${line}${space}${list.item} created:   ${created}`,
      `${line}${space}${list.item} last used: ${lastUsed}`,
      `${line}${space}${list.last} expires:   ${expires}`,
    ].join('\n'))
  }

  clientTokens.sort(sort)
  clientTokens.forEach(addTokens)

  if (personalTokens.length) {
    output.push('\nPersonal tokens')
    last = personalTokens.length - 1
    personalTokens.sort(sort)
    personalTokens.forEach(addTokens)
  }

  return {
    string: output.join('\n'),
    json: { clientTokens, personalTokens },
  }
}
