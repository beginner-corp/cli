let action = require('./action')

module.exports = {
  name: 'create',
  description: 'Create a Begin app or environment',
  action,
  help: {
    en: {
      contents: {
        header: 'Create parameters',
        items: [
          {
            name: '-e, --env',
            description: `Environment name to create`,
            optional: true,
          },
        ],
      },
      examples: [
        {
          name: 'Create an app',
          example: 'begin app create',
        },
        {
          name: `Create an app environment named 'staging'`,
          example: 'begin app create --env staging',
        },
      ]
    }
  }
}
