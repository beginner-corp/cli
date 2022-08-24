module.exports = async function action (params, utils, command) {
  let { args } = params
  let error = require('./errors')(params, utils)
  let project = params.inventory.inv._project
  let generate = require('../_generate')


  let plugins = project.arc.plugins
  if (plugins.includes('arc-plugin-oauth')) {
    return error('oauth_plugin_already_installed')
  }

  let authType = args.t || args.type
  if (!authType || authType === 'oauth') {
    let manifest = require('./oauth-manifest')
    generate({ manifest, command, project, utils })
  }
  else if (authType === 'magic-link') {
    // TODO: add prefs for seed DB
    console.log(project)

    let manifest = require('./magic-manifest')
    generate({ manifest, command, project, utils })
  }

}
