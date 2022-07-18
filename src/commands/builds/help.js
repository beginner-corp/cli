module.exports = {
  en: {
    usage: [ 'builds' ],
    description: 'List your Begin apps builds',
    contents: {
      header: 'List Builds',
      items: [
        {
          name: '-e, --env',
          description: `Environment to get builds from`,
          optional: false,
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
