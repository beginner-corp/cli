const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { createModelName } = require('./model-utils')

function addKeyPropertyToSchema (schema) {
  if (!Object.keys(schema.properties).includes('key')) {
    schema.properties.key = {
      type: 'string'
    }
  }
  return schema
}

function createJsonSchema (id, ...properties) {
  let schema = {
    id: `${createModelName(id).capSingular}`,
    type: 'object',
    properties: {}
  }

  properties.forEach(prop => {
    const [ name, type ] = prop.split(':')
    schema.properties[name] = {
      type: type
    }
  })

  schema = addKeyPropertyToSchema(schema)

  return schema
}

function writeJsonSchema (modelName, schema) {
  schema = addKeyPropertyToSchema(schema)
  mkdirSync(`app/schemas`, { recursive: true })
  writeFileSync(`app/schemas/${modelName.singular}.mjs`, `export const ${modelName.capSingular} = ${JSON.stringify(schema)}`)
}

function existsJsonSchema (modelName) {
  return existsSync(`app/schemas/${modelName.singular}.mjs`)
}

module.exports = {
  createJsonSchema,
  existsJsonSchema,
  writeJsonSchema
}
