module.exports = {
  en: {
    usage: [ 'tokens <action> <parameters>', '[options]' ],
    description: `View and manage your account's tokens. Tokens expire if not regularly used; temporary tokens always expire after one day.`,
    contents: {
      header: 'Token management actions',
      items: [
        {
          name: 'list [--display]',
          description: 'View all outstanding tokens; use --display flag to view full tokens',
        },
        {
          name: 'create [--temp]',
          description: 'Generate a new token',
        },
        {
          name: 'revoke <token>',
          description: 'Revoke a token',
        },
      ],
    },
    examples: [
      {
        name: `Generate a personal access token (PAT)`,
        example: 'begin tokens create',
      },
      {
        name: `Generate a temporary PAT that expires in one day`,
        example: 'begin tokens create --temp',
      },
      {
        name: `Revoke a token`,
        example: 'begin tokens revoke $token',
      },
    ]
  }
}
