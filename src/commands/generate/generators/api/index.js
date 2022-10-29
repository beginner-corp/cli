let action = require('./action')

module.exports = {
  name: 'api',
  description: 'Create a new API route',
  action,
  help: () => {
    return {
      en: {
        contents: {
          header: 'API parameters',
          items: [
            {
              name: '-p, --path',
              description: 'URI path, must start with `/`, can include catchalls and URL params',
            },
          ],
        },
        examples: [
          {
            name: 'Create a new API route',
            example: 'begin new api --path /notes',
          },
          {
            name: 'Create a new API route with path parameter',
            example: `begin new api --path '/notes/$id'`,
          }
        ]
      }
    }
  }
}
