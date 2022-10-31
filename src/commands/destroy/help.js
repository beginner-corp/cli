module.exports = {
  en: {
    usage: [ 'destroy <parameters>', '[options]' ],
    description: 'Destroy a Begin app or app environment',
    contents: {
      header: 'Destroy parameters',
      items: [
        {
          name: '-a, --app <ID>',
          description: `If used without the \`env\` flag: destroy an app and all its environments. If used with the \`env\` flag: destroy a single app environment`
        },
        {
          name: '-e, --env [name|ID]',
          description: `Select an app environment to destroy; optionally specify the environment name or ID to destroy`,
          optional: true,
        },
        {
          name: '--force',
          description: `Immediately destroy without prompting for confirmation`,
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
