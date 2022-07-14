let action = require('./action')

module.exports = {
  name: 'destroy',
  description: 'Delete an environment variable',
  action,
  help: {
    en: {
      contents: {
        header: 'Delete parameters',
        items: [
          {
            name: '-a, --appid',
            description: `App to delete the variable from`,
            optional: false,
          },
          {
            name: '-e, --env',
            description: `Environment to delete the variable from`,
            optional: false,
          },
          {
            name: '-k, --key',
            description: `Variable name to delete`,
            optional: false,
          },
        ],
      },
      examples: [
        {
          name: 'Delete a variable',
          example: 'begin env destroy',
        },
        {
          name: `Delete a variable named 'foo' in the environment named 'staging'`,
          example: 'begin env destroy --env staging --name foo',
        },
      ]
    }
  }
}
