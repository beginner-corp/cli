module.exports = async function createEvent (params) {
  let { name, src } = params
  let { getRelativeCwd } = require('../../../../lib')

  let item = name
  if (src) {
    src = getRelativeCwd(src)
    item = `${name}
  src ${src}`
  }

  let handlers = require('./handlers')
  let addItem = require('../add-item')

  return addItem({ ...params, pragma: 'events', item, src, handlers })
}
