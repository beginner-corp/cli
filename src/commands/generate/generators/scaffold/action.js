let { mkdirSync,  readFileSync } = require('fs')
let { createJsonSchema, existsJsonSchema, writeJsonSchema } = require('./jsonschema')
let { createModelName } = require('./model-utils')

/*
function addRouteSource ({ manifest, routeName, replacements, writeFile }) {
  let path = require('path')
  const { sourceFiles } = manifest
  sourceFiles.forEach(file => {
    let dirname = path.dirname(file.target).replace('<ROUTE_NAME>', routeName)
    mkdirSync(dirname, { recursive: true })
    // eslint-disable-next-line
    let source = require(file.src)
    writeFile(file.target.replace('<ROUTE_NAME>', routeName), source(replacements))
  })
}
*/

function addElements (elements, writeFile) {
  let path = require('path')
  elements.forEach(element => {
    let dirname = path.dirname('app/elements')
    mkdirSync(dirname, { recursive: true })
    // eslint-disable-next-line
    let source = require('./handlers/element.js')
    writeFile(`app/elements/${element.tagName}.mjs`, source(element))
  })
}

module.exports = async function action (params, utils, command) {
  let { mutateArc, writeFile, npmCommands, addRouteSource } = utils
  let { installAwsSdk, installDependencies } = npmCommands
  let { args } = params
  let error = require('./errors')(params, utils)
  let input = args._.slice(2)
  let project = params.inventory.inv._project
  let raw = project.raw

  let manifest = require('./manifest')

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

  // add routes to arcfile
  manifest.routes.forEach(route => raw = mutateArc.upsert({ item: route.replace('<ROUTE_NAME>', routeName), pragma: 'http', raw }))

  // Write the arcfile to disk
  writeFile(project.manifest, raw)

  // Copy source code
  addRouteSource({ manifest, routeName, replacements: { ...modelName, schema }, writeFile, command })

  // Write elements
  addElements(manifest.elements, writeFile)

  // Install Dependencies
  installAwsSdk()
  installDependencies(manifest.dependencies)
}
