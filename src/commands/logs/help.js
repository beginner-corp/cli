module.exports = {
  en: {
    usage: [ 'logs <parameters>', '[options]' ],
    description: 'List your Begin app logs',
    contents: {
      header: 'List logs',
      items: [
        {
          name: '-a, --app <ID>',
          description: `App containing the environment`,
          optional: true,
        },
        {
          name: '-e, --env <name|ID>',
          description: `App environment to list logs from`,
          optional: true,
        },
        {
          name: '-f, --filter',
          description: `Filter to apply against logs`,
        },
      ],
    },
    examples: [
      {
        name: 'List logs (from within a single environment app)',
        example: 'begin logs',
      },
      {
        name: 'List logs (specifying an environment name)',
        example: 'begin logs --env staging',
      },
      {
        name: 'List logs with filter',
        example: 'begin logs --env staging --filter "GOT HERE"',
      },
    ]
  }
}
