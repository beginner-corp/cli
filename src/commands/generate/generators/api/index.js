module.exports = {
  name: 'api',
  description: 'Create a new API route',
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
            example: 'begin gen api --path /notes',
          },
          {
            name: 'Create a new API route with path parameter',
            example: `begin gen api --path '/notes/$id'`,
          },
        ],
      },
    }
  },
}
