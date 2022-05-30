let looseName = /^[a-z][a-zA-Z0-9-_]+$/

module.exports = {
  name: 'project',
  description: 'Initialize a new project',
  action: async function (params, utils) {
    let { args, inventory } = params
    let { create, runtimes, writeFile } = utils
    let error = require('./errors')(params, utils)

    let invalid = inventory.inv._project.manifest
    if (invalid) return error('project_found')

    // App name (optional)
    let appName = args.n || args.name ? args.n || args.name  : 'begin-app'
    if (!looseName.test(appName)) {
      return error('invalid_appname')
    }

    // Runtime (optional)
    let runtime = args.r || args.runtime
    if (runtime && !runtimes.includes(runtime?.toLowerCase())) {
      return error('invalid_runtime')
    }

    let arc = `@app\n${appName}\n`
    if (runtime) arc += `\n@aws\nruntime ${runtime}\n`

    // Write the new Arc project manifest
    writeFile('app.arc', arc)

    // Create a basic HTTP function
    return create.http({ method: 'get', path: '/*', runtime })
  },
  help: function (params, utils) {
    let { backtickify, runtimes } = utils
    return {
      en: {
        contents: {
          header: 'New project parameters',
          items: [
            {
              name: '-n, --name',
              description: 'Project name, must be: [a-z0-9-_]',
              optional: true,
            },
            {
              name: '-r, --runtime',
              description: `Runtime, one of: ${backtickify(runtimes)}`,
              optional: true,
            },
          ],
        },
        examples: [
          {
            name: 'Create a new project (runs Node.js by default)',
            example: 'begin new project',
          },
          {
            name: 'Create a new project with name',
            example: 'begin new project -n my-app',
          },
          {
            name: 'Create a new project running Python',
            example: 'begin new project -r python',
          },
        ]
      },
    }
  }
}
