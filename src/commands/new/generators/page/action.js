function isValidPageType (type) {
  let pageTypes = [ [ 'html' ], [ 'javascript', 'js' ] ]
  return !!(pageTypes.filter(x => x.includes(type)).length)
}

module.exports = async function action (params, utils) {
  let { args } = params
  let { create, validate } = utils
  let error = require('./errors')(params, utils)
  let { existsSync } = require('fs')
  let { join } = require('path')

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

  // Type (optional)
  let type = args.t || args.type
  if (!type || type === true) {
    type = 'html'
  }
  if (typeof type !== 'string' || !isValidPageType(type)) {
    return error('invalid_type')
  }
  type = type.toLowerCase()
  type = type === 'js' ? 'javascript' : type

  let ext = type === 'javascript' ? '.mjs' : '.html'
  if (existsSync(join(process.cwd(), 'app/pages', `${path}${ext}`))) {
    return error('page_exists')
  }

  return create.page({ path, runtime: type })
}
