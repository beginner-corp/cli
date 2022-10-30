module.exports = {
  en: {
    usage: [ 'create', '[parameters] [options]' ],
    description: 'Create a Begin app or environment',
    contents: {
      header: 'Create parameters',
      items: [
        {
          name: '-e, --env',
          description: `Environment name to create`,
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
    ]
  }
}
