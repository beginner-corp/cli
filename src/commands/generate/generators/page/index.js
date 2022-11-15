let action = require('./action')

module.exports = {
  name: 'page',
  description: 'Create a new page',
  action,
  help: () => {
    return {
      en: {
        contents: {
          header: 'Page parameters',
          items: [
            {
              name: '-p, --path',
              description: 'URI path, must start with `/`, can include catchalls and URL params',
            },
            {
              name: '-t, --type',
              description: 'One of html or javascript',
              optional: true,
            },
          ],
        },
        examples: [
          {
            name: 'Create a new page route',
            example: 'begin gen page --path /notes',
          },
          {
            name: 'Create a new page route with path parameter',
            example: `begin gen page --path '/notes/$id'`,
          }
        ]
      }
    }
  }
}
