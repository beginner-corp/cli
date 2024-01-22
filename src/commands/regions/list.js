async function action (params) {
  let client = require('@begin/api')
  let f = require('../../lib/format')()
  let collumns = require('../../lib/columns')
  let { config } = params
  let { access_token: token, stagingAPI: _staging } = config

  let regions = await client.regions({ token, _staging })

  if (!regions) return Error('No regions found!')

  return [
    f.bold('Available regions:'),
    collumns(Object.entries(regions).map(([ k, v ]) => [ v, k ]), 2)
  ].join('\n')
}

module.exports = {
  name: 'list',
  description: 'List Begin regions',
  action,
}
