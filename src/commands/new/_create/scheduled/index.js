module.exports = async function createScheduled (params, args) {
  let { name, rate, cron, src } = args
  let { getRelativeCwd } = require('../../../../lib')

  let item = `${name} ${rate ? `rate(${rate})` : `cron(${cron})`}`
  if (src) {
    src = getRelativeCwd(src)
    item = `${name}
  ${rate ? `rate ${rate}` : `cron ${cron}`}
  src ${src}`
  }

  let defaultHandlers = require('./handlers')
  let addItem = require('../add-item')
  let handlers = { ...defaultHandlers, ...args.handlers }

  return addItem({ ...params, ...args, pragma: 'scheduled', item, src, handlers })
}
