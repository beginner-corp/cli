let action = require('./action')

module.exports = {
  name: 'list',
  description: 'List your Begin apps and environments',
  action,
  help: {
    en: {
      examples: [
        {
          name: `List all apps and environments`,
          example: 'begin app list',
        },
      ]
    }
  },
  manifestNotNeeded: true,
}
