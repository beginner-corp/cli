let { resolve } = require('path')
let cwd = process.cwd()

module.exports = async function action (params, utils) {
  let { args, inventory, lang } = params
  let { create, validate, httpMethods, runtimes } = utils
  let error = require('./errors')

  let invalid = validate.project()
  if (invalid) {
    process.exitCode = 1
    return invalid
  }

  // Method (required)
  let method = args.m || args.method
  if (!method || method === true) {
    return error(lang, 'no_method')
  }
  if (typeof method !== 'string' ||
      !httpMethods.includes(method.toLowerCase())) {
    return error(lang, 'invalid_method')
  }
  method = method.toLowerCase()

  // Path (required)
  let path = args.p || args.path
  if (!path || path === true) {
    return error(lang, 'no_path')
  }
  if (typeof path !== 'string') {
    return error(lang, 'invalid_path')
  }
  if (!path.startsWith('/')) {
    return error(lang, 'path_starts_with_slash')
  }

  // Runtime (optional)
  let runtime = args.r || args.runtime
  if (runtime && !runtimes.includes(runtime?.toLowerCase())) {
    return error(lang, 'invalid_runtime')
  }

  // Source dir (optional)
  let src = args.s || args.src
  if (src && !resolve(src).startsWith(cwd)) {
    return error(lang, 'src_must_be_in_project')
  }

  return create.http({
    // Function stuff:
    method, path, runtime, src,
    // Meta
    args, inventory, lang,
  })
}
