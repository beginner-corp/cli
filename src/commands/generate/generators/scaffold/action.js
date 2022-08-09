let { mkdirSync,  readFileSync, writeFileSync } = require('fs')
let { createJsonSchema, existsJsonSchema, writeJsonSchema } = require('./jsonschema')
let { createModelName } = require('./model-utils')

let crud = require('./crud')

function addRouteSource ({ manifest, routeName, replacements }) {
  let path = require('path')
  const { sourceFiles } = manifest
  sourceFiles.forEach(file => {
    let dirname = path.dirname(file.target).replace('<ROUTE_NAME>', routeName)
    mkdirSync(dirname, { recursive: true })
    // eslint-disable-next-line
    let source = require(file.src)
    writeFileSync(file.target.replace('<ROUTE_NAME>', routeName), source(replacements))
  })
}

module.exports = async function action (params, utils) {
  let { mutateArc, writeFile, npmCommands } = utils
  let { installDependencies } = npmCommands
  let { args } = params
  let error = require('./errors')(params, utils)
  let input = args._.slice(2)
  let project = params.inventory.inv._project
  let raw = project.raw

  // Create JSON Schema from input
  let schema = {}
  if (input[0] === '-f' || input[0] === '--file') {
    // read JSON Schema File
    schema = JSON.parse(readFileSync(input[1]))
  }
  else {
    schema = createJsonSchema(...input)
  }

  const { id } = schema
  const modelName = createModelName(id)
  const routeName = modelName.plural

  if (existsJsonSchema(modelName)) {
    return error('schema_already_exists')
  }

  // write JSON Schema file
  writeJsonSchema(modelName, schema)

  // add routes to arcfile
  crud.routes.forEach(route => raw = mutateArc.upsert({ item: route.replace('<ROUTE_NAME>', routeName), pragma: 'http', raw }))

  // Write the arcfile to disk
  await writeFile(project.manifest, raw)

  // Copy source code
  addRouteSource({ manifest: crud, routeName, replacements: modelName })

  // Install Dependencies
  installDependencies(crud.dependencies)
}
