module.exports = async function action (params, utils, command) {
  let { args } = params
  let { writeFile, npmCommands, validate } = utils
  let { installAwsSdk } = npmCommands
  let error = require('./errors')(params, utils)
  let project = params.inventory.inv._project
  let generate = require('../_generate')

  let invalid = await validate.project()
  if (invalid) return invalid

  let plugins = project.arc.plugins
  if (plugins.includes('arc-plugin-oauth')) {
    return error('oauth_plugin_already_installed')
  }

  let authType = args.t || args.type
  if (authType === 'oauth') {
    let manifest = require('./oauth-manifest')
    await generate(params, { manifest, command, project, utils })
  }
  else if (!authType || authType === 'magic-link') {
    let { routeName, modelName, schema } = require('./users-table')
    let prefsFile = project.localPreferencesFile
    let { readFileSync } = require('fs')
    let prefs = readFileSync(prefsFile, 'utf8')
    if (!project.localPreferences?.['sandbox-startup']) {
      prefs += `@sandbox-startup
node ./scripts/seed-users.js`
      writeFile(prefsFile, prefs)
    }
    else if (!project.localPreferences['sandbox-startup'].includes('node ./scripts/seed-users.js')){
      prefs = prefs.replace('@sandbox-startup', `@sandbox-startup
node ./scripts/seed-users.js`)
      writeFile(prefsFile, prefs)
    }

    // Install Dependencies
    await installAwsSdk(params)

    let manifest = require('./magic-manifest')

    let { writeJsonSchema } = require('../scaffold/jsonschema')

    writeJsonSchema(modelName, schema, writeFile)
    await generate(params, { manifest, replacements: { ...modelName, schema, routeName, includeAuth: true, authRole: 'admin' }, command, project, utils })
  }
}
