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
          description: `App environment to list tail logs from`,
          optional: true,
        },
        {
          name: '-f, --filter',
          description: `Filter to apply against tailed logs`,
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
        example: 'begin tail --env staging',
      },
      {
        name: 'Tail logs with filter',
        example: 'begin tail --filter "GOT HERE"',
      },
      {
        name: 'Tail logs with grep',
        example: 'begin tail | grep "GOT HERE"',
      },
    ]
  }
}
