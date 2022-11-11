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
        },
        {
          name: '-e, --env <name|ID>',
          description: `Environment to get builds from`,
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
