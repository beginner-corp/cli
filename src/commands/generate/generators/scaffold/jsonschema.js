const { mkdirSync, writeFileSync } = require('fs')
const { createModelName } = require('./model-utils')

function addIdPropertyToSchema (schema) {
  if (!Object.keys(schema.properties).includes('id')) {
    schema.properties.ID = {
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

  schema = addIdPropertyToSchema(schema)

  return schema
}

function writeJsonSchema (modelName, schema) {
  schema = addIdPropertyToSchema(schema)
  mkdirSync(`src/shared/schemas`, { recursive: true })
  writeFileSync(`src/shared/schemas/${modelName.singular}.mjs`, `export const ${modelName.capSingular} = ${JSON.stringify(schema)}`)
}

module.exports = {
  createJsonSchema,
  writeJsonSchema
}
