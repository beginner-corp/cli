module.exports = async function action (params, utils) {
  let { appID, args, config, envName } = params
  let { region } = args
  let { access_token: token, stagingAPI: _staging } = config
  let { createApp, promptOptions, validateEnvName } = require('../../lib/app')
  let { prompt, Select } = require('enquirer')
  let client = require('@begin/api')
  let deploy = require('../deploy')

  // Create a new app and associate it with this project
  if (!appID) {
    let created = await createApp(params, utils)
    let { app, name, envName } = created
    let env = app.environments[0]
    console.error(`App '${name}' + environment '${envName}' created at ${env.url}`)

    let { deployIt } = await prompt({
      type: 'confirm',
      name: 'deployIt',
      message: `Would you like to deploy your app?`,
      initial: 'y',
    }, promptOptions)
    if (deployIt) {
      return deploy.action({ ...params, appID: app.appID, envName }, utils)
    }
    else {
      console.error(`You can deploy at any time by running: \`begin deploy\``)
    }
  }
  // Create a new environment
  else {
    try {
      var app = await client.find({ token, appID, _staging })
    }
    catch (err) {
      if (err.message === 'app_not_found') return Error(`No app found with app ID '${appID}'`)
      if (err.message === 'unknown_error') return Error(`No app found with app ID '${appID}' or the user does not have permission to access the app.`)
      return
    }
    let envs = app.environments
    let envNameProvided = !!(envName)
    if (envNameProvided) {
      validateEnvName.arg(envName)
    }
    else {
      let initial = envs.some(({ name }) => name === 'staging') ? undefined : 'staging'
      let { name } = await prompt({
        type: 'input',
        name: 'name',
        message: 'What would you like to name your new environment?',
        initial,
        validate: validateEnvName.prompt
      }, promptOptions)
      envName = name
    }

    // Check for duplicates
    let names = envs.map(({ name }) => name)
    if (names.includes(envName)) {
      let msg = `Environment name '${envName}' already exists for this app; current environment(s) found: '${names.join(`', '`)}'`
      return ReferenceError(msg)
    }

    let regions
    if (!region) {
      let { selectRegion } = await prompt({
        type: 'confirm',
        name: 'selectRegion',
        message: `Would you like to specify the geographical region your project will be deployed to? (This cannot be changed)`,
        initial: 'n',
      }, promptOptions)

      if (selectRegion) {
        // Get available regions
        regions = await client.regions({ token, _staging })
        let regionsByLocation = Object.fromEntries(Object.entries(regions).map(([ k, v ]) => ([ v, k ])))

        let prompt = new Select({
          name: 'build',
          message: 'Select from these regions',
          choices: Object.values(regions)
        }, promptOptions)

        let result = await prompt.run()
        region = regionsByLocation[result]
      }
    }

    // Create the app environment
    app = await client.env.add({ token, appID, envName, region, _staging })
    let env = app.environments.find(({ name }) => name === envName)
    console.error(`App environment '${envName}' created at ${env.url}`)

    // Skip the prompt if requested via args
    if (envNameProvided) return

    let { deployIt } = await prompt({
      type: 'confirm',
      name: 'deployIt',
      message: `Would you like to deploy your new environment?`,
      initial: 'y',
    }, promptOptions)
    if (deployIt) {
      return deploy.action({ ...params, appID: app.appID, envName }, utils)
    }
    else {
      console.error(`You can deploy this environment by running: \`begin deploy --env ${envName}\``)
    }
  }
}
