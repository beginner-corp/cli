module.exports = function () {
  return `import data from '@begin/data'
import { convertToNestedObject, validator } from '@begin/validator'
import { User } from '../app/schemas/user.mjs'

const deleteUser = async function (key) {
  return data.destroy({ table: 'users', key })
}

const upsertUser = async function (user) {
  return data.set({ table: 'users', ...user })
}

const getUser = async function (key) {
  return data.get({ table: 'users', key })
}

const getUsers = async function () {
  return data.get({ table: 'users' })
}

const validate = {
  shared (req) {
    return validator(req, User)
  },
  async create (req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.key) {
      problems['key'] = { errors: '<p>should not be included on a create</p>' }
    }
    // Insert your custom validation here
    return !valid ? { problems, user: data } : { user: data }
  },
  async update (req) {
    let { valid, problems, data } = validate.shared(req)
    // Insert your custom validation here
    return !valid ? { problems, user: data } : { user: data }
  }
}


export {
  deleteUser,
  getUser,
  getUsers,
  upsertUser,
  validate
}
`
}
