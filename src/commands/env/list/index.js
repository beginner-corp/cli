let action = require('./action')

module.exports = {
  name: 'list',
  description: `List an environment's variables`,
  action,
  help: {
    en: {
      contents: {
        header: 'List parameters',
        items: [
          {
            name: '-e, --env',
            description: 'Environment to list variables of',
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
