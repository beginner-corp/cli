const pluralize = require('pluralize')

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

function createModelName (modelName) {
  const name = modelName.toLowerCase()
  return {
    singular: pluralize.singular(name),
    capSingular: capitalize(pluralize.singular(name)),
    plural: pluralize.plural(name),
    capPlural: capitalize(pluralize.plural(name))
  }
}

module.exports = {
  capitalize,
  createModelName
}
