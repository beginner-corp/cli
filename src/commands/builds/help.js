module.exports = {
  en: {
    usage: [ 'builds', '[parameters]' ],
    description: 'List your Begin apps builds',
    contents: {
      header: 'List Builds',
      items: [
        {
          name: '-a, --app <ID>',
          description: `App containing the environment. Not required when in the app directory.`,
          optional: true,
        },
        {
          name: '-e, --env <name|ID>',
          description: `Environment to get builds from. Only required when the app has more than one environment.`,
          optional: true,
        },
      ],
    },
    examples: [
      {
        name: 'List builds',
        example: 'begin builds --env <env-id>',
      },
    ]
  }
}
