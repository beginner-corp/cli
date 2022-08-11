const reservedNames = new Set([
  'annotation-xml',
  'color-profile',
  'font-face',
  'font-face-src',
  'font-face-uri',
  'font-face-format',
  'font-face-name',
  'missing-glyph'
])

/*
 * validateElementName adapted from https://github.com/sindresorhus/validate-element-name
 * MIT License
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 */
function validateElementName (name) {
  const isPotentialCustomElementName = require('is-potential-custom-element-name')

  if (/[A-Z]/.test(name)) {
    return false
  }

  if (!name.includes('-')) {
    return false
  }

  if (/^\d/i.test(name)) {
    return false
  }

  if (/^-/i.test(name)) {
    return false
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#prod-potentialcustomelementname
  if (!isPotentialCustomElementName(name)) {
    return false
  }

  if (reservedNames.has(name)) {
    return false
  }

  return true
}

module.exports = async function action (params, utils) {
  let { args } = params
  let { create, validate } = utils
  let error = require('./errors')(params, utils)

  let invalid = await validate.project()
  if (invalid) return invalid

  // Name (required)
  let name = args.n || args.name
  if (!name || name === true) {
    return error('no_name')
  }
  if (typeof name !== 'string' || !validateElementName(name)) {
    return error('invalid_name')
  }

  return create.element({ name, runtime: 'node' })
}
