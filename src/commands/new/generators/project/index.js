let action = require('./action')

module.exports = {
  name: 'project',
  description: 'Initialize a new project',
  action,
  help: function () {
    return {
      en: {
        contents: {
          header: 'New project parameters',
          items: [
            {
              name: '-p, --path',
              description: 'Path for the project',
            },
            {
              name: '-n, --name',
              description: 'Project name, must be: [a-z0-9-_]',
              optional: true,
            },
          ],
        },
        examples: [
          {
            name: 'Create a new project',
            example: 'begin new project -p ./my-proj',
          },
          {
            name: 'Create a new project with name',
            example: 'begin new project -p ./my-proj -n my-app',
          },
        ]
      },
    }
  }
}
