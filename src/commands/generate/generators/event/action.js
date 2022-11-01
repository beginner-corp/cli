let { resolve } = require('path')
let cwd = process.cwd()

module.exports = async function action (params, utils) {
  let { args } = params
  let { create, validate } = utils
  let error = require('./errors')(params, utils)

  let invalid = await validate.project()
  if (invalid) return invalid

  // Name (required)
  let name = args.name || args.n
  if (!name || name === true) {
    return error('no_name')
  }
  if (typeof name !== 'string') {
    return error('invalid_name')
  }

  // Source dir (optional)
  let src = args.src || args.s
  if (src && !resolve(src).startsWith(cwd)) {
    return error('src_must_be_in_project')
  }

  return create.events({ name, runtime: 'node', src })
}
