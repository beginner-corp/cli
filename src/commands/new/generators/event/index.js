module.exports = {
  name: 'event',
  description: 'Create a new async event',
  action: async function () {
    // TODO: build me!
    return { stdout: 'Hi from the @events generator' }
  },
  help: {
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
        example: 'begin new event --name my-event',
      }
    ]
  }
}
