let looseName = /^[a-z][a-zA-Z0-9-_]+$/
let { existsSync, mkdirSync } = require('fs')
let { isAbsolute, join, normalize } = require('path')

module.exports = {
  name: 'project',
  description: 'Initialize a new project',
  action: async function (params, utils) {
    let { args } = params
    let { create, writeFile } = utils
    let error = require('./errors')(params, utils)
    let _inventory = require('@architect/inventory')

    // Project path (required)
    let path = args.p || args.path
    if (!path || path === true) {
      return error('no_path')
    }

    let projectPath = isAbsolute(path) ? path : normalize(join(process.cwd(), path))

    // Error out if folder already exists and it has an arc project already
    if (existsSync(projectPath)) {
      process.chdir(projectPath)
      let inventory = await _inventory()
      let invalid = inventory.inv._project.manifest
      if (invalid) return error('project_found')
    }
    // Create new project folder
    else if (mkdirSync(projectPath, { recursive: true })) {
      process.chdir(projectPath)
    }
    else {
      return error('folder_creation')
    }

    // App name (optional)
    let appName = args.n || args.name ? args.n || args.name  : 'begin-app'
    if (!looseName.test(appName)) {
      return error('invalid_appname')
    }

    let arc = `@app\n${appName}\n`

    // Write the new Arc project manifest
    writeFile('app.arc', arc)

    // Create a basic HTTP function
    return create.http({ method: 'get', path: '/*', runtime: 'node' })
  },
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
