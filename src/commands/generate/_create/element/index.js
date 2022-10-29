module.exports = async function createElement (params, args) {
  let { lang } = params
  let { name, runtime } = args
  let addItem = require('../add-begin-item')

  let handlers = require('./handlers')

  let handler = typeof handlers[runtime] === 'function'
    ? handlers[runtime](lang)
    : handlers[runtime]

  return addItem({ path: name, prefix: 'app/elements', handler, lang, runtime }, params)
}
