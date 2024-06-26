module.exports = {
  name: 'event',
  description: 'Create a new async event',
  help: () => {
    return {
      en: {
        contents: {
          header: 'Event parameters',
          items: [
            {
              name: '-n, --name',
              description: 'Event name, must be: [a-z0-9-_]',
            },
          ],
        },
        examples: [
          {
            name: 'Create a new async event',
            example: 'begin gen event --name my-event',
          },
        ],
      },
    }
  },
}
