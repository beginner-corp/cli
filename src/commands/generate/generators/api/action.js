module.exports = async function action (params, utils) {
  let { args } = params
  let { create, validate } = utils
  let error = require('./errors')(params)
  let { existsSync } = require('fs')
  let { join } = require('path')

  let invalid = await validate.project()
  if (invalid) return invalid

  // Path (required)
  let path = args.path || args.p
  if (!path || path === true) {
    return error('no_path')
  }
  if (typeof path !== 'string') {
    return error('invalid_path')
  }
  if (existsSync(join(process.cwd(), 'app', 'api', `${path}.mjs`))) {
    return error('api_exists')
  }

  return create.api({ path, runtime: 'node' })
}
