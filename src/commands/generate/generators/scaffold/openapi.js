function writeOpenAPI (modelName, schema, writeFile) {
  let { mkdirSync } = require('fs')
  mkdirSync(`app/models/openapi`, { recursive: true })
  writeFile(`app/models/openapi/${modelName.singular}.mjs`, generateOpenAPI(modelName, schema))
}

function generateOpenAPI ({ plural, capPlural, singular, capSingular }, schema) {
  const properties = schema.properties
  delete properties.key
  return `export default {
      "openapi": "3.0.0",
      "info": {
        "version": "0.0.1",
        "title": "Enhance ${capPlural} API",
      },
      "paths": {
        "/${plural}": {
          "get": {
            "summary": "List all ${plural}",
            "operationId": "list${capPlural}",
            "tags": [
              "${plural}"
            ],
            "responses": {
              "200": {
                "description": "An array of ${plural}",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/${capPlural}"
                    }
                  }
                }
              },
              "default": {
                "description": "unexpected error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Error"
                    }
                  }
                }
              }
            }
          },
          "post": {
            "summary": "Create a ${singular}",
            "operationId": "create${capSingular}",
            "tags": [
              "${plural}"
            ],
            "requestBody": {
              "description": "${capSingular} to add to the database",
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/New${capSingular}"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Returns the created ${singular} with key",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/${capSingular}Response"
                    }
                  }
                }
              },
              "default": {
                "description": "unexpected error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Error"
                    }
                  }
                }
              }
            }
          }
        },
        "/${plural}/{${singular}Id}": {
          "get": {
            "summary": "Info for a specific ${singular}",
            "operationId": "show${capSingular}ById",
            "tags": [
              "${plural}"
            ],
            "parameters": [
              {
                "name": "${singular}Id",
                "in": "path",
                "required": true,
                "description": "The id of the ${singular} to retrieve",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Info for a specific ${singular}",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/${capSingular}Response"
                    }
                  }
                }
              },
              "default": {
                "description": "unexpected error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Error"
                    }
                  }
                }
              }
            }
          },
          "post": {
            "summary": "Update a specific ${singular}",
            "operationId": "update${capSingular}ById",
            "tags": [
              "${plural}"
            ],
            "parameters": [
              {
                "name": "${singular}Id",
                "in": "path",
                "required": true,
                "description": "The id of the ${singular} to update",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "requestBody": {
              "description": "Updated ${singular}",
              "required": true,
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/New${capSingular}"
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Expected response to a valid request",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/${capSingular}Response"
                    }
                  }
                }
              },
              "default": {
                "description": "unexpected error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Error"
                    }
                  }
                }
              }
            }
          }
        },
        "/${plural}/{${singular}Id}/delete": {
          "post": {
            "summary": "Delete a specific ${singular}",
            "operationId": "delete${capSingular}ById",
            "tags": [
              "${plural}"
            ],
            "parameters": [
              {
                "name": "${singular}Id",
                "in": "path",
                "required": true,
                "description": "The id of the ${singular} to delete",
                "schema": {
                  "type": "string"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "The key of the deleted ${singular}",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/${capSingular}DeleteResponse"
                    }
                  }
                }
              },
              "default": {
                "description": "unexpected error",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/Error"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "components": {
        "schemas": {
          "New${capSingular}": {
            "type": "object",
            "properties": ${JSON.stringify(properties)}
          },
          "${capSingular}": {
            "allOf": [
              {
                "$ref": "#/components/schemas/New${capSingular}"
              },
              {
                "type": "object",
                "properties": {
                  "key": {
                    "type": "string"
                  }
                }
              }
            ]
          },
          "${capSingular}Response": {
            "type": "object",
            "properties": {
              "${singular}": {
                "allOf": [
                  {
                    "$ref": "#/components/schemas/${capSingular}"
                  }
                ]
              }
            }
          },
          "${capSingular}DeleteResponse": {
            "type": "object",
            "properties": {
              "${singular}": {
                "type": "object",
                "properties": {
                  "key": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "${capPlural}": {
            "type": "object",
            "properties": {
              "${plural}": {
                "type": "array",
                "maxItems": 100,
                "items": {
                  "$ref": "#/components/schemas/${capSingular}"
                }
              }
            }
          },
          "Error": {
            "type": "object",
            "required": [
              "code",
              "message"
            ],
            "properties": {
              "code": {
                "type": "integer",
                "format": "int32"
              },
              "message": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  `
}

module.exports = {
  writeOpenAPI
}
