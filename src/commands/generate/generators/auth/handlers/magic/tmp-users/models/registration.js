module.exports = function () {
  return `import data from '@begin/data'
import { convertToNestedObject, validator } from '@begin/validator'
import { Registration } from '../app/schemas/registration.mjs'

const validate = {
  shared (req) {
    return validator(req, Registration)
  },
  async create (req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.key) {
      problems['key'] = { errors: '<p>should not be included on a create</p>' }
    }
    // Insert your custom validation here
    return !valid ? { problems, user: data } : { user: data }
  }
}


export {
  validate
}
`
}
