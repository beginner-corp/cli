module.exports = async function createHttp (params, args) {
  let { method, path, src } = args
  let { getRelativeCwd } = require('../../../../lib')

  let name = `${method} ${path}`
  let item = name
  if (src) {
    src = getRelativeCwd(src)
    item = `${path}
  method ${method}
  src ${src}`
  }

  let handlers = require('./handlers')
  let addItem = require('../add-item')

  return addItem({ ...params, ...args, pragma: 'http', name, item, src, handlers })
}
