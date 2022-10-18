let names = { en: [ 'help' ] }
let help = {
  en: {
    usage: [ 'help', '[command]' ],
    contents: {
      header: 'Commands',
      items: [
        {
          name: 'app',
          description: 'Manage and deploy Begin apps',
        },
        {
          name: 'dev',
          description: 'Start the local development server',
        },
        {
          name: 'env',
          description: `List your Begin app's environment variables`,
        },
        {
          name: 'generate',
          description: 'A code generator for common functionality',
        },
        {
          name: 'help',
          description: 'Display help',
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
        {
          name: 'new',
          description: 'Locally create a new project or resource',
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
    examples: [
      {
        name: 'Get general Begin help',
        example: 'begin help',
      },
      {
        name: 'Get help for a Begin command (`new`)',
        example: 'begin help new',
      },
    ],
  }
}

module.exports = {
  names,
  help,
}
