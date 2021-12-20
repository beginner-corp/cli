let { resolve } = require('path')
let cwd = process.cwd()

module.exports = async function action (params, utils) {
  let { args } = params
  let { create, validate, runtimes } = utils
  let error = require('./errors')(params, utils)

  let invalid = await validate.project()
  if (invalid) return invalid

  // Name (required)
  let name = args.n || args.name
  if (!name || name === true) {
    return error('no_name')
  }
  if (typeof name !== 'string') {
    return error('invalid_name')
  }

  // Runtime (optional)
  let runtime = args.r || args.runtime
  if (runtime && !runtimes.includes(runtime?.toLowerCase())) {
    return error('invalid_runtime')
  }

  // Source dir (optional)
  let src = args.s || args.src
  if (src && !resolve(src).startsWith(cwd)) {
    return error('src_must_be_in_project')
  }

  return create.events({ name, runtime, src })
}
