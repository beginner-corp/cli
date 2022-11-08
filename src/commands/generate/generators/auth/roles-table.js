let modelName = {
  singular: 'role',
  capSingular: 'Role',
  plural: 'roles',
  capPlural: 'Roles'
}
let routeName = 'roles'

let schema = {
  'id': 'Roles',
  'type': 'object',
  'required': [
    'name'
  ],
  'properties': {
    'name': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'key': {
      'type': 'string'
    },
    'rules': {
      'type': 'object',
      'properties': {
        'action_1': {
          'type': 'string',
          'enum': [
            '',
            'create',
            'read',
            'update',
            'delete',
            'change_permissions'
          ]
        },
        'target_1': {
          'type': 'string',
          'enum': [
            '',
            'posts',
            'accounts',
            'roles'
          ]
        },
        'owner_1': {
          'type': 'string',
          'enum': [
            '',
            'SELF',
            'ALL',
            'account'
          ]
        },
        'id_1': {
          'type': 'string'
        },
        'action_2': {
          'type': 'string',
          'enum': [
            '',
            'create',
            'read',
            'update',
            'delete',
            'change_permissions'
          ]
        },
        'target_2': {
          'type': 'string',
          'enum': [
            '',
            'posts',
            'accounts',
            'roles'
          ]
        },
        'owner_2': {
          'type': 'string',
          'enum': [
            '',
            'SELF',
            'ALL',
            'account'
          ]
        },
        'id_2': {
          'type': 'string'
        },
        'action_3': {
          'type': 'string',
          'enum': [
            '',
            'create',
            'read',
            'update',
            'delete',
            'change_permissions'
          ]
        },
        'target_3': {
          'type': 'string',
          'enum': [
            '',
            'posts',
            'accounts',
            'roles'
          ]
        },
        'owner_3': {
          'type': 'string',
          'enum': [
            '',
            'SELF',
            'ALL',
            'account'
          ]
        },
        'id_3': {
          'type': 'string'
        },
        'action_4': {
          'type': 'string',
          'enum': [
            '',
            'create',
            'read',
            'update',
            'delete',
            'change_permissions'
          ]
        },
        'target_4': {
          'type': 'string',
          'enum': [
            '',
            'posts',
            'accounts',
            'roles'
          ]
        },
        'owner_4': {
          'type': 'string',
          'enum': [
            '',
            'SELF',
            'ALL',
            'account'
          ]
        },
        'id_4': {
          'type': 'string'
        }
      }
    }
  }
}

module.exports = { modelName, routeName, schema }
