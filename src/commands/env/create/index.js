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
            name: '-a, --appid',
            description: `App to create the variable in`,
            optional: false,
          },
          {
            name: '-e, --env',
            description: `Environment to create the variable in`,
            optional: false,
          },
          {
            name: '-k, --key',
            description: `Variable name to create`,
            optional: false,
          },
          {
            name: '-v, --value',
            description: `Variable value to create`,
            optional: false,
          },
        ],
      },
      examples: [
        {
          name: 'Create a variable',
          example: 'begin env create',
        },
        {
          name: `Create a variable in the environment named 'staging'`,
          example: 'begin env create --env staging --name foo --value bar',
        },
      ]
    }
  }
}
