module.exports = {
  name: 'app',
  description: 'Initialize a new app',
  action: async function (params, utils) {
    let { args, inventory } = params
    let { create, runtimes, writeFile } = utils
    let error = require('./errors')(params, utils)

    let invalid = inventory.inv._project.manifest
    if (invalid) return error('app_found')

    // Runtime (optional)
    let runtime = args.r || args.runtime
    if (runtime && !runtimes.includes(runtime?.toLowerCase())) {
      return error('invalid_runtime')
    }

    let arc = `@app\nbegin-app\n`
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
          header: 'New app parameters',
          items: [
            {
              name: '-r, --runtime',
              description: `Runtime, one of: ${backtickify(runtimes)}`,
              optional: true,
            },
          ],
        },
        examples: [
          {
            name: 'Create a new app (runs Node.js by default)',
            example: 'begin new app',
          },
          {
            name: 'Create a new app running Python',
            example: 'begin new app -r python',
          },
        ]
      },
    }
  }
}
