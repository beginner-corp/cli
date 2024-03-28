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
            description: 'Env variable value',
          },
        ],
      },
      examples: [
        {
          name: "Create a variable named 'FOO' in 'staging'",
          example: 'begin env create --env staging --name FOO --value "bar"',
        },
        {
          name: "Create a variable named 'FOO' in 'staging' with escaped special characters (Mac/Linux)",
          example: 'begin env create --env staging --name FOO --value "bar\\!"',
        },
        {
          name: "Create a variable named 'FOO' in 'staging' with special characters (Windows)",
          example: 'begin env create --env staging --name FOO --value "bar!"',
        },
      ],
    },
  },
}
