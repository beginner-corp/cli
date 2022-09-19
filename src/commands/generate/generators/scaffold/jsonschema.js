const { existsSync, mkdirSync, readFileSync } = require('fs')
const { createModelName } = require('./model-utils')
const $RefParser = require('@apidevtools/json-schema-ref-parser')

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
  mkdirSync(`app/models/schemas`, { recursive: true })
  writeFile(`app/models/schemas/${modelName.singular}.mjs`, `export const ${modelName.capSingular} = ${JSON.stringify(schema, null, 2)}`)
}

function existsJsonSchema (modelName) {
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
  try {
    return await $RefParser.dereference(schema)
  }
  catch (err) {
    return schema
  }
}

async function readSchemaFile (file) {
  const schema = await dereferenceSchema(generateSchemaWithId(JSON.parse(readFileSync(file))))
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
