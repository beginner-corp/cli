let names = { en: [ 'help' ] }
let help = {
  en: {
    usage: [ 'help', '[command]' ],
    contents: [
      {
        header: 'Local development',
        items: [
          {
            name: 'dev',
            description: 'Start the local development server',
          },
          {
            name: 'generate',
            description: 'Locally generate new code and project resources',
          },
          {
            name: 'new',
            description: 'Locally create a new project',
          },
        ],
      },
      {
        header: 'App & environment management',
        items: [
          // TODO remove ↓
          {
            name: 'app',
            description: 'Manage Begin apps',
          },
          {
            name: 'builds',
            description: 'View build logs from app deployments',
          },
          {
            name: 'deploy',
            description: 'Deploy an app to Begin',
          },
          {
            name: 'env',
            description: `List your Begin app's environment variables`,
          },
          {
            name: 'login',
            description: 'Log into Begin',
          },
          {
            name: 'logout',
            description: 'Log out of Begin',
          },
          {
            name: 'logs',
            description: 'Retrieve logs from Begin',
          },
        ],
      },
      {
        header: 'Other',
        items: [
          {
            name: 'help',
            description: 'Display help',
          },
          {
            name: 'update',
            description: 'Update Begin to the latest version',
          },
          {
            name: 'version',
            description: 'Output app version',
          },
        ],
      },
    ],
    examples: [
      {
        name: 'Get general Begin help',
        example: 'begin help',
      },
      {
        name: 'Get help for a Begin command (`generate`)',
        example: 'begin help generate',
      },
    ],
  }
}

module.exports = {
  names,
  help,
}
