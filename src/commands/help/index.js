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
          name: 'new',
          description: 'Locally create a new project or resource',
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
