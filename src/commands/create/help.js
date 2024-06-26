module.exports = {
  en: {
    usage: [ 'create', '[parameters] [options]' ],
    description: 'Create a Begin app or environment',
    contents: {
      header: 'Create parameters',
      items: [
        {
          name: '-a, --app <ID>',
          description: `Existing app to add a new environment to`,
          optional: true,
        },
        {
          name: '-e, --env <name|ID>',
          description: `Environment name to create`,
          optional: true,
        },
        {
          name: '--region <region>',
          description: `AWS region code in which to create the app or environment`,
          optional: true,
        },
      ],
    },
    examples: [
      {
        name: 'Create an app',
        example: 'begin create',
      },
      {
        name: `Create an app environment named 'staging'`,
        example: 'begin create --env staging',
      },
    ],
  },
}
