let action = require('./action')

module.exports = {
  name: 'create',
  description: 'Create an environment variable',
  action,
  help: {
    en: {
      contents: {
        header: 'Create parameters',
        items: [
          {
            name: '-e, --env',
            description: 'Environment in which to create the variable',
          },
          {
            name: '-n, --name',
            description: 'Env variable name; alternately use -k, --key',
          },
          {
            name: '-v, --value',
            description: `Env variable value`,
          },
        ],
      },
      examples: [
        {
          name: `Create a variable named 'foo' in 'staging'`,
          example: 'begin env create --env staging --name foo --value bar',
        },
      ]
    }
  }
}
