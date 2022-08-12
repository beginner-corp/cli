const { existsSync, mkdirSync } = require('fs')
const { createModelName } = require('./model-utils')

const standardJsonTypes = [
  'string',
  'number',
  'integer',
  'object',
  'array',
  'boolean'
]

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
    const [ name, type = 'string' ] = prop.split(':')
    schema.properties[name] = createProp(type)
  })

  schema = addKeyPropertyToSchema(schema)

  return schema
}

function createProp (type) {
  if (standardJsonTypes.includes(type)) {
    return {
      type: type
    }
  }
  else {
    return {
      type: 'string',
      format: type
    }
  }
}

function writeJsonSchema (modelName, schema, writeFile) {
  schema = addKeyPropertyToSchema(schema)
  mkdirSync(`app/schemas`, { recursive: true })
  writeFile(`app/schemas/${modelName.singular}.mjs`, `export const ${modelName.capSingular} = ${JSON.stringify(schema, null, 2)}`)
}

function existsJsonSchema (modelName) {
  return existsSync(`app/schemas/${modelName.singular}.mjs`)
}

module.exports = {
  createJsonSchema,
  existsJsonSchema,
  writeJsonSchema
}
