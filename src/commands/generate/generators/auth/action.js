
module.exports = async function action (params, utils, command) {
  let { args } = params
  let { writeFile, npmCommands } = utils
  let { installAwsSdk } = npmCommands
  let error = require('./errors')(params, utils)
  let project = params.inventory.inv._project
  let generate = require('../_generate')


  let plugins = project.arc.plugins
  if (plugins.includes('arc-plugin-oauth')) {
    return error('oauth_plugin_already_installed')
  }

  let authType = args.t || args.type
  if (authType === 'oauth') {
    let manifest = require('./oauth-manifest')
    generate({ manifest, command, project, utils })
  }
  else if (!authType || authType === 'magic-link') {

    const prefsFile = project.localPreferencesFile
    const { readFileSync } = require('fs')
    let prefs = readFileSync(prefsFile, 'utf8')
    if (!/@sandbox-startup/.test(prefs)) {
      prefs += `@sandbox-startup
node ./scripts/seed-users.js`
      writeFile(prefsFile, prefs)
    }

    // Install Dependencies
    installAwsSdk()

    let manifest = require('./magic-manifest')
    generate({ manifest, command, project, utils })
  }

}

/*
let { createJsonSchema,  existsJsonSchema, readSchemaFile, writeJsonSchema } = require('./jsonschema')
let { createModelName } = require('./model-utils')

module.exports = async function action (params, utils, command) {
  let { writeFile, npmCommands } = utils
  let { installAwsSdk } = npmCommands
  let { args } = params
  let error = require('./errors')(params, utils)
  let input = args._.slice(2)
  let project = params.inventory.inv._project
  let generate = require('../_generate')

  // Step 1: load manifest file
  let manifest = require('./manifest')

  // Step 2: pre generate setup
  // Create JSON Schema from input
  let schema = {}
  let file = args.f || args.file
  if (!file || file === true) {
    schema = createJsonSchema(...input)
  }
  else {
    // read JSON Schema File
    schema = await readSchemaFile(file)
  }

  const { id } = schema
  const modelName = createModelName(id)
  const routeName = modelName.plural

  if (existsJsonSchema(modelName)) {
    return error('schema_already_exists')
  }

  // write JSON Schema file
  writeJsonSchema(modelName, schema, writeFile)

  // Install Dependencies
  installAwsSdk()

  // Step 3: Run the generic generator
  generate({ manifest, replacements: { ...modelName, schema, routeName }, command, project, utils })
}

*/
