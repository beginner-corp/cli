// Create first app + environment flow, used in both `app create` + `app deploy`
module.exports = async function createApp (params, utils) {
  let { args, config, inventory } = params
  let { env } = args
  let { access_token: token, stagingAPI: _staging } = config
  let { mutateArc, writeFile } = utils
  let { prompt } = require('enquirer')
  let client = require('@begin/api')
  let { promptOptions } = require('.')
  let { validateEnvName } = require('./validate')

  console.error(`This project doesn't appear to be associated with a Begin app`)
  let { create } = await prompt({
    type: 'confirm',
    name: 'create',
    message: `Would you like to create a Begin app based on this project?`,
    initial: 'y',
  }, promptOptions)
  if (!create) {
    console.error('Canceled deployment')
    process.exit(1)
  }

  let { name } = await prompt({
    type: 'input',
    name: 'name',
    message: 'What would you like to name your app?',
    validate: (value) => {
      if (!value) return 'A name is required to create a new app'
      return true
    }
  }, promptOptions)

  if (env) {
    validateEnvName.arg(env)
    var envName = env
  }
  else {
    var { envName } = await prompt({
      type: 'input',
      name: 'envName',
      message: 'What would you like to name your first environment?',
      initial: 'staging',
      validate: validateEnvName.prompt
    }, promptOptions)
  }

  // Create the app
  let app = await client.create({ token, name, envName, _staging })
  let appID = app?.appID
  let envID = app?.environments[0]
  if (!app || !appID || !envID) {
    throw ReferenceError('API did not return app')
  }

  // Upsert the new `@begin` pragma `appID` setting
  let updatedArc = mutateArc.upsert({
    item: `appID ${appID}`,
    pragma: 'begin',
    raw: inventory.inv._project.raw
  })
  writeFile(inventory.inv._project.manifest, updatedArc)
  console.error(`Added appID '${appID}' to project, be sure to commit this change!`)
  return { app, name, envName }
}
