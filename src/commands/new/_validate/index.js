let { parse } = require('path')
let errors = require('./errors')

function project (inventory, lang) {
  return function () {
    let { inv } = inventory
    if (!inv._project.manifest) return errors(lang, 'no_project')

    let { base: manifest } = parse(inv._project.manifest)
    if (manifest !== 'app.arc') return errors(lang, 'only_app_dot_arc')
  }
}

module.exports = function validate (inventory, lang) {
  return {
    project: project(inventory, lang)
  }
}
