module.exports = {
  en: {
    usage: [ 'logs' ],
    description: 'List your Begin app logs',
    contents: {
      header: 'List Logs',
      items: [
        {
          name: '-a, --app <ID>',
          description: `App containing the environment`,
          optional: true,
        },
        {
          name: '-e, --env',
          description: `Environment to get logs from`,
        },
        {
          name: '-f, --filter',
          description: `Filter to apply against logs`,
        },
      ],
    },
    examples: [
      {
        name: 'List logs',
        example: 'begin logs --env <env-id>',
      },
      {
        name: 'List logs with filter',
        example: 'begin logs --env <env-id> --filter "BAD REQUEST"',
      },
    ]
  }
}
