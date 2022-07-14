let action = require('./action')

module.exports = {
  name: 'list',
  description: 'List an environment variables',
  action,
  help: {
    en: {
      contents: {
        header: 'List parameters',
        items: [
          {
            name: '-e, --env',
            description: `Environment to create the variable in`,
          },
        ],
      },
      examples: [
        {
          name: 'List variables',
          example: 'begin env list',
        },
      ]
    }
  }
}
