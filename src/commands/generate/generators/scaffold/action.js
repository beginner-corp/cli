let path = require('path')
let { mkdirSync,  readFileSync, writeFileSync } = require('fs')
let { createJsonSchema, writeJsonSchema } = require('./jsonschema')
let { createModelName } = require('./model-utils')
let { installDependencies } = require('./npm-commands')

let mutateArc = require('../../../../lib/mutate-arc')
let crud = require('./crud')

function addRouteSource ({ manifest, routeName, replacements }) {
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
  let { writeFile } = utils
  let { args } = params
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

  if (params.inventory.get.http(`get /${routeName}`) !== undefined) {
    let msg = `${routeName} already exist in the project`
    throw Error(msg)
  }

  // write JSON Schema file
  writeJsonSchema(modelName, schema)

  // add table to arcfile
  let item = `${routeName}
  ID *String
`
  raw = mutateArc.upsert({ item, pragma: 'tables', raw })

  // add routes to arcfile
  crud.routes.forEach(route => raw = mutateArc.upsert({ item: route.replace('<ROUTE_NAME>', routeName), pragma: 'http', raw }))

  // Write the arcfile to disk
  await writeFile(project.manifest, raw)

  // Copy source code
  addRouteSource({ manifest: crud, routeName, replacements: modelName })

  // Install Dependencies
  // TODO: Use the npm commands in lib
  installDependencies(crud.dependencies)
}
