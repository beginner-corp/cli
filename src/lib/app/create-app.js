// Create first app + environment flow, used in both `app create` + `app deploy`
module.exports = async function createApp (params, utils) {
  let { args, config, inventory } = params
  let { env, region } = args
  let { access_token: token, stagingAPI: _staging } = config
  let { mutateArc, writeFile } = utils

  const { prompt, Select } = require('enquirer')
  const client = require('@begin/api')
  const { promptOptions } = require('.')
  const { validateEnvName } = require('./validate')
  const columns = require('../../lib/columns')

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
    },
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
      validate: validateEnvName.prompt,
    }, promptOptions)
  }

  if (!region) {
    let { willSelectRegion } = await prompt({
      type: 'confirm',
      name: 'willSelectRegion',
      message: `Would you like to specify the geographical region your project will be deployed to? (This cannot be changed)`,
      initial: 'n',
    }, promptOptions)

    if (willSelectRegion) {
      // Get available regions
      let regions = await client.regions({ token, _staging })
      let regionEntries = Object.entries(regions)
      let choiceNames = columns(regionEntries.map(([ k, v ]) => [ v, k ]), 2)
      let choices = choiceNames.map((c, i) => ({
        message: c, // displayed in list
        name: regionEntries[i][1], // displayed on selection and returned as result
        // value: regionEntries[i][0], // ! is not returned as result
      }))
      let regionsByLocation = Object.fromEntries(regionEntries.map(([ k, v ]) => ([ v, k ])))

      let regionSelect = new Select({
        message: 'Select from these regions',
        choices,
      }, promptOptions)

      let result = await regionSelect.run()
      region = regionsByLocation[result]
    }
  }

  // Create the app
  try {
    var app = await client.create({ token, name, envName, _staging, region })
  }
  catch (err) {
    if (err.message === 'profile_max_env_capacity') {
      let selected = region ? `the specified region (${region})` : 'Begin'
      let instruction = region ? 'please try another region' : 'please try again'
      let msg = `Sorry, ${selected} does not currently have capacity for a new app, ${instruction}`
      throw Error(msg)
    }
    if (err.message === 'unsupported_region') {
      let msg = `The specified region (${region}) is invalid or unsupported by Begin`
      throw Error(msg)
    }
  }
  let appID = app?.appID
  let envID = app?.environments[0]
  if (!app || !appID || !envID) {
    throw ReferenceError('API did not return app')
  }

  // Upsert the new `@begin` pragma `appID` setting
  let updatedArc = mutateArc.upsert({
    item: `appID ${appID}`,
    pragma: 'begin',
    raw: inventory.inv._project.raw,
  })
  writeFile(inventory.inv._project.manifest, updatedArc)
  console.error(`Added appID '${appID}' to project, be sure to commit this change!`)
  return { app, name, envName }
}
