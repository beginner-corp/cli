let modelName = {
  singular: 'account',
  capSingular: 'Account',
  plural: 'accounts',
  capPlural: 'Accounts'
}
let routeName = 'accounts'
let schema = {
  id: 'Accounts',
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
