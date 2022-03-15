let names = { en: [ 'help' ] }
let help = {
  en: {
    usage: [ 'help', '[command]' ],
    contents: {
      header: 'Commands',
      items: [
        {
          name: 'dev',
          description: 'Start the local development server',
        },
        {
          name: 'new',
          description: 'Create a new project or resource',
        },
        {
          name: 'help',
          description: 'Display help',
        },
        {
          name: 'login',
          description: 'Log in to Begin',
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
