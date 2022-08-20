let { readFileSync } = require('fs')
let { createJsonSchema, existsJsonSchema, writeJsonSchema } = require('./jsonschema')
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
    schema = JSON.parse(readFileSync(file))
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
  generate({ manifest, routeName, replacements: { ...modelName, schema }, command, project, utils })
}
