module.exports = async function action (params, utils, command) {
  let { args } = params
  let { writeFile, npmCommands, validate } = utils
  let { installAwsSdk } = npmCommands
  let error = require('./errors')(params)
  let project = params.inventory.inv._project
  let generate = require('../_generate')

  let invalid = await validate.project()
  if (invalid) return invalid

  let plugins = project.arc.plugins
  if (plugins.includes('arc-plugin-oauth')) {
    return error('oauth_plugin_already_installed')
  }


  let prefsFile = project.localPreferencesFile
  let { readFileSync } = require('fs')
  let prefs = readFileSync(prefsFile, 'utf8')
  if (!project.localPreferences?.['sandbox-startup']) {
    prefs += `@sandbox-startup
node ./scripts/seed-accounts.js`
    writeFile(prefsFile, prefs)
  }
  else if (!project.localPreferences['sandbox-startup'].includes('node ./scripts/seed-accounts.js')){
    prefs = prefs.replace('@sandbox-startup', `@sandbox-startup
node ./scripts/seed-accounts.js`)
    writeFile(prefsFile, prefs)
  }
  // Install Dependencies
  await installAwsSdk(params)

  let { writeJsonSchema } = require('../scaffold/jsonschema')


  let roleManifest = require('./roles-manifest')
  let roleTable = require('./roles-table')
  writeJsonSchema(roleTable.modelName, roleTable.schema, writeFile)
  await generate(params, {
    manifest: roleManifest,
    project,
    replacements: {
      ...roleTable.modelName,
      authRole: 'admin',
      includeAuth: true,
      routeName: roleTable.routeName,
      schema: roleTable.schema,
    },
    command,
    utils
  })

  let accountManifest = require('./accounts-manifest')
  let accountsTable = require('./accounts-table')
  writeJsonSchema(accountsTable.modelName, accountsTable.schema, writeFile)
  await generate(params, {
    manifest: accountManifest,
    project,
    replacements: {
      ...accountsTable.modelName,
      authRole: 'admin',
      includeAuth: true,
      routeName: accountsTable.routeName,
      schema: accountsTable.schema,
    },
    command,
    utils
  })

  let authType = args.type || args.t
  if (authType === 'oauth') {
    let manifest = require('./oauth-manifest')
    await generate(params, { manifest, command, project, utils })
  }
  else if (!authType || authType === 'magic-link') {
    let manifest = require('./magic-manifest')
    await generate(params, {
      manifest,
      project,
      command,
      utils
    })
  }


}
