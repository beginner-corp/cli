module.exports = {
  en: {
    usage: [ 'team', '[options]' ],
    description: 'Manage team membership for yourself and your Begin apps',
    contents: {
      header: 'Team management options',
      items: [
        {
          name: 'list [appID]',
          description: 'View teammates and their permissions',
          optional: true,
        },
        {
          name: 'invite [role]',
          description: 'Generate an app invite code',
          optional: true,
        },
        {
          name: 'revoke <code>',
          description: 'Revoke a previously generated app invite code',
          optional: true,
        },
        {
          name: 'remove <username>',
          description: 'Remove a teammate from an app',
          optional: true,
        },
        {
          name: 'role <username:role>',
          description: 'Assign a new role to a teammate; must be either `admin` or `collaborator`',
          optional: true,
        },
        {
          name: 'accept <code>',
          description: 'Accept an app invite code',
          optional: true,
        },
        {
          name: 'decline <code>',
          description: 'Decline an app invite code',
          optional: true,
        },
        {
          name: 'leave',
          description: 'Remove yourself from an app',
          optional: true,
        },
      ],
    },
    examples: [
      {
        name: `Generate a shareable invite for a new admin teammate`,
        example: 'begin invite admin',
      },
      {
        name: `Revoke a not-yet-accepted invite code`,
        example: 'begin revoke $invitecode',
      },
      {
        name: `Assign a collaborator teammate the role of admin`,
        example: 'begin role $username:admin',
      },
      {
        name: `Remove a teammate from an app`,
        example: 'begin remove $username',
      },
    ]
  }
}
