module.exports = {
  name: 'scheduled',
  description: 'Create a new scheduled event',
  action: async function () {
    // TODO: build me!
    return 'Hi from the @scheduled generator'
  },
  help: {
    contents: {
      header: 'Scheduled event parameters',
      items: [
        {
          name: '-n, --name',
          description: 'Event name, must be: [a-z0-9-_]',
        },
        {
          name: '--value',
          description: 'Invocation frequency of the interval (integer)',
        },
        {
          name: '--interval',
          description: 'Interval of invocation, one of: `hour`, `day`, `week`, `month`',
        },
      ],
    },
    examples: [
      {
        name: 'Create a new scheduled event',
        example: 'begin new scheduled --name my-task --value 1 --interval day',
      }
    ]
  }
}
