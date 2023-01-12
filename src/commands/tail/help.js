module.exports = {
  en: {
    usage: [ 'tail <parameters>', '[options]' ],
    description: 'Tail your Begin app logs in real-time',
    contents: {
      header: 'Tail logs',
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
          optional: true,
        },
      ],
    },
    examples: [
      {
        name: 'Tail logs (from within a single environment app)',
        example: 'begin tail',
      },
      {
        name: 'Tail logs (specifying an environment name)',
        example: 'begin logs --env staging',
      },
      {
        name: 'Tail logs with filter',
        example: 'begin logs --filter "GOT HERE"',
      },
      {
        name: 'Tail logs with grep',
        example: 'begin logs | grep "GOT HERE"',
      },
    ]
  }
}
