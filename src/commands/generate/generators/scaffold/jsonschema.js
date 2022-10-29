function addKeyPropertyToSchema (schema) {
  if (!Object.keys(schema.properties).includes('key')) {
    schema.properties.key = {
      type: 'string'
    }
  }
  return schema
}

function createJsonSchema (id, ...properties) {
  let { createModelName } = require('./model-utils')
  let schema = {
    id: `${createModelName(id).capSingular}`,
    type: 'object',
    properties: {}
  }

  properties.forEach(prop => {
    let [ name, type = 'string' ] = prop.split(':')
    schema.properties[name] = createProp(type)
  })

  schema = addKeyPropertyToSchema(schema)
  return schema
}

function createProp (type) {
  let standardJsonTypes = [
    'string',
    'number',
    'integer',
    'object',
    'array',
    'boolean'
  ]
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
  let { mkdirSync } = require('fs')
  schema = addKeyPropertyToSchema(schema)
  mkdirSync(`app/models/schemas`, { recursive: true })
  writeFile(`app/models/schemas/${modelName.singular}.mjs`, `export const ${modelName.capSingular} = ${JSON.stringify(schema, null, 2)}`)
}

function existsJsonSchema (modelName) {
  let { existsSync } = require('fs')
  return existsSync(`app/models/schemas/${modelName.singular}.mjs`)
}

function generateSchemaWithId (schema) {
  let id = !schema.id && schema['$id'] ? schema['$id'] : schema.id
  if (id.startsWith('http')) {
    id = (new URL(id)).pathname
  }
  schema.id = id.split('/').pop()
  return schema
}

async function dereferenceSchema (schema) {
  let $RefParser = require('@apidevtools/json-schema-ref-parser')
  try {
    return await $RefParser.dereference(schema)
  }
  catch (err) {
    return schema
  }
}

async function readSchemaFile (file) {
  let { readFileSync } = require('fs')
  let data = JSON.parse(readFileSync(file))
  let rawSchema = generateSchemaWithId(data)
  let schema = await dereferenceSchema(rawSchema)
  return schema
}

module.exports = {
  createJsonSchema,
  dereferenceSchema,
  existsJsonSchema,
  generateSchemaWithId,
  readSchemaFile,
  writeJsonSchema
}
