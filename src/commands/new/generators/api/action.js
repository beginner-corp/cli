module.exports = async function action (params, utils) {
  let { args } = params
  let { create, validate } = utils
  let error = require('./errors')(params, utils)

  let invalid = await validate.project()
  if (invalid) return invalid

  // Path (required)
  let path = args.p || args.path
  if (!path || path === true) {
    return error('no_path')
  }
  if (typeof path !== 'string') {
    return error('invalid_path')
  }

  console.log('calling create API with path ', path)

  return create.api({ path, runtime: 'node' })
}
