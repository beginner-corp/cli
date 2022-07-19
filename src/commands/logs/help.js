module.exports = {
  en: {
    usage: [ 'logs' ],
    description: 'List your Begin apps logs',
    contents: {
      header: 'List Logs',
      items: [
        {
          name: '-e, --env',
          description: `Environment to get logs from`,
          optional: false,
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
