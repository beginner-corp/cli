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
            name: '-e, --env',
            description: 'Environment in which to delete the variable',
          },
          {
            name: '-n, --name',
            description: 'Env variable name; alternately use -k, --key',
          },
        ],
      },
      examples: [
        {
          name: `Delete a variable named 'foo' in 'staging'`,
          example: 'begin env destroy --env staging --name foo',
        },
      ]
    }
  }
}
