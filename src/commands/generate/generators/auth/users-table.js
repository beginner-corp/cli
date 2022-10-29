let modelName = {
  singular: 'user',
  capSingular: 'User',
  plural: 'users',
  capPlural: 'Users'
}
let routeName = 'users'
let schema = {
  id: 'User',
  type: 'object',
  required: [ 'email' ],
  properties: {
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    email: {
      type: 'string',
      format: 'email'
    },
    roles: {
      type: 'object',
      properties: {
        role1: {
          type: 'string',
          enum: [
            '',
            'admin',
            'member'
          ]
        },
        role2: {
          type: 'string',
          enum: [
            '',
            'admin',
            'member'
          ]
        },
        role3: {
          type: 'string',
          enum: [
            '',
            'admin',
            'member'
          ]
        }
      }
    }
  }
}

module.exports = { modelName, routeName, schema }
