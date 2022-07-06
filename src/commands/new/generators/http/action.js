let { resolve } = require('path')
let cwd = process.cwd()

module.exports = async function action (params, utils) {
  let { args } = params
  let { create, validate, httpMethods, runtimes } = utils
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
  if (!path.startsWith('/')) {
    return error('path_starts_with_slash')
  }

  // Method (optional)
  let method = args.m || args.method
  if (!method || method === true) {
    method = 'any'
  }
  if (typeof method !== 'string' ||
      !httpMethods.includes(method.toLowerCase())) {
    return error('invalid_method')
  }
  method = method.toLowerCase()

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

  return create.http({ method, path, runtime, src })
}
