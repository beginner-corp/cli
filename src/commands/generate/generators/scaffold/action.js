module.exports = async function action (params, utils, command) {
  let { createJsonSchema,  existsJsonSchema, readSchemaFile, writeJsonSchema } = require('./jsonschema')
  let { writeOpenAPI } = require('./openapi')
  let { createModelName } = require('./model-utils')
  let { writeFile, npmCommands, validate } = utils
  let { installAwsSdk } = npmCommands
  let { args } = params
  let error = require('./errors')(params)
  let input = args._.slice(2)
  let project = params.inventory.inv._project
  let generate = require('../_generate')

  let invalid = await validate.project()
  if (invalid) return invalid

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

  let { id } = schema
  let modelName = createModelName(id)
  let routeName = modelName.plural

  if (existsJsonSchema(modelName)) {
    return error('schema_already_exists')
  }

  // Write JSON Schema file
  writeJsonSchema(modelName, schema, writeFile)

  // Write OpenAPI file
  if (args.openapi) {
    writeOpenAPI(modelName, schema, writeFile)
    // Don't double add plugin
    if (!project.arc.plugins.includes(`enhance/arc-plugin-openapi`)) {
      manifest.arcMutations.push({
        pragma: 'plugins',
        item: `enhance/arc-plugin-openapi`
      })
    }
    manifest.dependencies.push('@enhance/arc-plugin-openapi')
  }

  // Install dependencies
  await installAwsSdk(params)

  // Step 3: Run the generic generator
  await generate(params, {
    command,
    manifest,
    project,
    replacements: { ...modelName, schema, routeName },
    utils
  })
}
