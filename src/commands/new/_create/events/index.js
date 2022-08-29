module.exports = async function createEvent (params, args) {
  let { name, src } = args
  let { getRelativeCwd } = require('../../../../lib')

  let item = name
  if (src) {
    src = getRelativeCwd(src)
  }
  else {
    src = getRelativeCwd(`jobs/events/${name}`)
  }

  // Event arc
  item = `
${name}
  src ${src}`

  let defaultHandlers = require('./handlers')
  let addItem = require('../add-item')
  let handlers = { ...defaultHandlers, ...args.handlers }

  return addItem({ ...params, ...args, pragma: 'events', item, src, handlers })
}
