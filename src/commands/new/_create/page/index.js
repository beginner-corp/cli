module.exports = async function createPage (params, args) {
  let { lang } = params
  let { path, runtime } = args
  let addItem = require('../add-begin-item')

  let handlers = require('./handlers')

  let handler = typeof handlers[runtime] === 'function'
    ? handlers[runtime](lang)
    : handlers[runtime]

  return addItem({ path, prefix: 'app/pages', handler, lang, runtime }, params)
}
