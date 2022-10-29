let action = require('./action')

module.exports = {
  name: 'scheduled',
  description: 'Create a new scheduled event',
  action,
  help: {
    en: {
      contents: {
        header: 'Scheduled event parameters',
        items: [
          {
            name: '-n, --name',
            description: 'Event name, must be: [a-z0-9-_]',
          },
          {
            name: '-r, --rate',
            description: 'Invocation frequency of the event by rate expression',
          },
          {
            name: '-c, --cron',
            description: 'Invocation frequency of the event by cron expression',
          },
          {
            name: '-s, --src',
            description: 'Custom path to handler source',
            optional: true,
          },
        ],
      },
      examples: [
        {
          name: 'Create a new scheduled event that runs every day',
          example: 'begin new scheduled --name my-task --rate "1 day"',
        },
        {
          name: 'Create a new scheduled event that runs every 15 minutes',
          example: 'begin new scheduled --name my-task --rate "15 minutes"',
        },
        {
          name: 'Create a new scheduled event that runs at 10:15 AM (UTC) every day',
          example: 'begin new scheduled --name my-task --cron "15 10 * * ? *"',
        },
        {
          name: 'Create a new scheduled event that runs at 6:00 PM Monday through Friday',
          example: 'begin new scheduled --name my-task --cron "0 18 ? * MON-FRI *"',
        }
      ]
    }
  }
}
