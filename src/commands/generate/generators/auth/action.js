
module.exports = async function action (params, utils, command) {
  let { args } = params
  let { writeFile, npmCommands } = utils
  let { installAwsSdk } = npmCommands
  let error = require('./errors')(params, utils)
  let project = params.inventory.inv._project
  let generate = require('../_generate')


  let plugins = project.arc.plugins
  if (plugins.includes('arc-plugin-oauth')) {
    return error('oauth_plugin_already_installed')
  }

  let authType = args.t || args.type
  if (authType === 'oauth') {
    let manifest = require('./oauth-manifest')
    generate({ manifest, command, project, utils })
  }
  else if (!authType || authType === 'magic-link') {

    const prefsFile = project.localPreferencesFile
    const { readFileSync } = require('fs')
    let prefs = readFileSync(prefsFile, 'utf8')
    if (!/@sandbox-startup/.test(prefs)) {
      prefs += `@sandbox-startup
node ./scripts/seed-users.js`
      writeFile(prefsFile, prefs)
    }

    // Install Dependencies
    installAwsSdk()

    let manifest = require('./magic-manifest')

    let { writeJsonSchema } = require('../scaffold/jsonschema')


    const modelName = {
      singular: 'user',
      capSingular: 'User',
      plural: 'users',
      capPlural: 'Users'
    }
    const routeName = 'users'
    const schema = {
      id: 'User',
      type: 'object',
      required: [ 'email' ],
      properties: {
        firstname: {
          type: 'string'
        },
        lastname: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        roles: {
          type: 'object',
          properties: {
            role1: {
              type: 'string',
              enum: [
                '',
                'admin',
                'member'
              ]
            },
            role2: {
              type: 'string',
              enum: [
                '',
                'admin',
                'member'
              ]
            },
            role3: {
              type: 'string',
              enum: [
                '',
                'admin',
                'member'
              ]
            }
          }
        }
      }
    }

    writeJsonSchema(modelName, schema, writeFile)
    generate({ manifest, replacements: { ...modelName, schema, routeName }, command, project, utils })
  }


}
