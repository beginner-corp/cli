let action = require('./action')

module.exports = {
  name: 'deploy',
  description: 'Deploy an app environment to Begin',
  action,
  help: {
    en: {
      contents: {
        header: 'Deployment parameters',
        items: [
          {
            name: '-e, --env',
            description: `Environment name to deploy`,
            optional: true,
          },
        ],
      },
      examples: [
        {
          name: `Deploy an app's only environment`,
          example: 'begin app deploy',
        },
        {
          name: `Deploy the app environment named 'staging'`,
          example: 'begin app deploy --env staging',
        },
      ]
    }
  }
}
