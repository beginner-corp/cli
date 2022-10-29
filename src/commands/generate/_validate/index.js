function project (params) {
  return async function () {
    let { lang } = params
    let { parse } = require('path')
    let errors = require('./errors')
    let _inventory = require('@architect/inventory')
    let inventory = await _inventory()
    let { inv } = inventory
    if (!inv._project.manifest) return errors(lang, 'no_project')

    let { base: manifest } = parse(inv._project.manifest)
    if (manifest !== 'app.arc' && manifest !== '.arc') return errors(lang, 'only_app_dot_arc')
  }
}

module.exports = function validate (params) {
  return {
    project: project(params)
  }
}
