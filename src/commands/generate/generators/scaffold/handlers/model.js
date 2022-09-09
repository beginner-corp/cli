module.exports = function ({ plural, capPlural, singular, capSingular }) {
  return `import data from '@begin/data'
import { validator } from '@begin/validator'
import { ${capSingular} } from '../app/schemas/${singular}.mjs'

const delete${capSingular} = async function (key) {
  return data.destroy({ table: '${plural}', key })
}

const upsert${capSingular} = async function (${singular}) {
  return data.set({ table: '${plural}', ...${singular} })
}

const get${capSingular} = async function (key) {
  return data.get({ table: '${plural}', key })
}

const get${capPlural} = async function () {
  return data.get({ table: '${plural}' })
}

const validate = {
  shared (req) {
    return validator(req, ${capSingular})
  },
  async create (req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.key) {
      problems['key'] = { errors: '<p>should not be included on a create</p>' }
    }
    // Insert your custom validation here
    return !valid ? { problems, ${singular}: data } : { ${singular}: data }
  },
  async update (req) {
    let { valid, problems, data } = validate.shared(req)
    // Insert your custom validation here
    return !valid ? { problems, ${singular}: data } : { ${singular}: data }
  }
}

export {
  delete${capSingular},
  get${capSingular},
  get${capPlural},
  upsert${capSingular},
  validate
}
`
}
