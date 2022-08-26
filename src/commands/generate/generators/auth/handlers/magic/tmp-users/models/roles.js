module.exports = function () {
  return `import data from '@begin/data'
import { convertToNestedObject, validator } from '@begin/validator'
import { Role } from '../app/schemas/role.mjs'

const deleteRole = async function (key) {
  return data.destroy({ table: 'roles', key })
}

const upsertRole = async function (role) {
  return data.set({ table: 'roles', ...role })
}

const getRole = async function (key) {
  return data.get({ table: 'roles', key })
}

const getRoles = async function () {
  return data.get({ table: 'roles' })
}

const validate = {
  shared (req) {
    return validator(req, Role)
  },
  async create (req) {
    let { valid, problems, data } = validate.shared(req)
      if (req.body.key) {
        problems['key'] = { errors: '<p>should not be included on a create</p>' }
      }
      // Insert your custom validation here
      return !valid ? { problems, role: data } : { role: data }
  },
  async update (req) {
    let { valid, problems, data } = validate.shared(req)
    // Insert your custom validation here
      return !valid ? { problems, role: data } : { role: data }
  }
}


export {
    deleteRole,
    getRole,
    getRoles,
    upsertRole,
    validate
}
`
}
