module.exports = {
  en: {
    usage: [ 'builds', '[parameters]' ],
    description: 'List your Begin apps builds',
    contents: {
      header: 'List Builds',
      items: [
        {
          name: '-a, --app <ID>',
          description: `App containing the environment`,
          optional: true,
        },
        {
          name: '-e, --env',
          description: `Environment to get builds from`,
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
