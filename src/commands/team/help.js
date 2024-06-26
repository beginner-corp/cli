module.exports = {
  en: {
    usage: [ 'team <action> <parameters>', '[options]' ],
    description: 'Manage team membership for yourself and your Begin apps',
    contents: {
      header: 'Team management actions',
      items: [
        {
          name: 'list',
          description: 'View teammates and their permissions',
        },
        {
          name: 'invite [--role]',
          description: 'Generate an app invite code',
        },
        {
          name: 'revoke <code>',
          description: 'Revoke a previously generated app invite code',
        },
        {
          name: 'remove <username>',
          description: 'Remove a teammate from an app',
        },
        {
          name: 'role <username:role>',
          description: 'Assign a new role to a teammate; must be either `admin` or `collaborator`',
        },
        {
          name: 'accept <code>',
          description: 'Accept an app invite code',
        },
        {
          name: 'decline <code>',
          description: 'Decline an app invite code',
        },
        {
          name: 'leave',
          description: 'Remove yourself from an app',
        },
      ],
    },
    examples: [
      {
        name: `Generate a shareable invite for a new admin teammate`,
        example: 'begin team invite admin',
      },
      {
        name: `Revoke a not-yet-accepted invite code`,
        example: 'begin team revoke $invitecode',
      },
      {
        name: `Assign a collaborator teammate the role of admin`,
        example: 'begin team role $username:admin',
      },
      {
        name: `Remove a teammate from an app`,
        example: 'begin team remove $username',
      },
    ],
  },
}
