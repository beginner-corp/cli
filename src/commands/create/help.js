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
          name: '-r, --region <name>',
          description: `Region to create the application in. Must be one of [us-east-1, us-east-2, us-west-1, us-west-2]`,
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
      {
        name: `Create an app environment named 'staging' in 'us-west-2'`,
        example: 'begin create --env staging --region us-west-2',
      },
    ]
  }
}
