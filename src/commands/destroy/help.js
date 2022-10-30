module.exports = {
  en: {
    usage: [ 'destroy', '[parameters]' ],
    description: 'Destroy a Begin app or app environment',
    contents: {
      header: 'Destroy parameters',
      items: [
        {
          name: '-a, --app',
          description: `Destroy the app and all of its environments`,
          optional: true,
        },
        {
          name: '-e, --env',
          description: `Environment name to destroy`,
          optional: true,
        },
      ],
    },
    examples: [
      {
        name: 'Destroy an app (and all of its environments)',
        example: 'begin destroy --app',
      },
      {
        name: `Destroy the app environment named 'staging'`,
        example: 'begin destroy --env staging',
      },
    ]
  }
}
