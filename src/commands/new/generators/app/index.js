let printer = require('../../../../printer')
let { backtickify, runtimes } = require('../../../../lib')

module.exports = {
  name: 'app',
  description: 'Initialize a new app',
  action: async function (params, utils) {
    let { args, inventory, lang } = params
    let { create, runtimes } = utils
    let error = require('./errors')

    let invalid = inventory.inv._project.manifest
    if (invalid) return error(lang, 'app_found')

    // Runtime (optional)
    let runtime = args.r || args.runtime
    if (runtime && !runtimes.includes(runtime?.toLowerCase())) {
      return error(lang, 'invalid_runtime')
    }

    let arc = `@app\nbegin-app\n`
    if (runtime) arc += `\n@aws\nruntime ${runtime}\n`

    // Write the new Arc project manifest
    let { writeFileSync } = require('fs')
    let { join } = require('path')
    writeFileSync(join(process.cwd(), 'app.arc'), arc)
    let messages = require('./messages')
    printer.verbose(params, messages[lang].created_file('app.arc manifest'))

    // Refresh inventory for Lambda creation
    let _inventory = require('@architect/inventory')
    inventory = await _inventory()

    return create.http({
      // Function stuff:
      method: 'get', path: '/*', runtime,
      // Meta
      args, inventory, lang,
    })
  },
  help: {
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
