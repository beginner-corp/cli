module.exports = async function action (params, utils) {
  let { args, appID, config, envName, inventory } = params
  let { access_token: token, stagingAPI: _staging } = config
  let { writeFile } = utils

  if (!appID) return Error('No Begin app found in this directory to destroy')

  let { promptOptions } = require('../../lib/app')
  let { prompt } = require('enquirer')
  let client = require('@begin/api')
  let app = await client.find({ token, appID, _staging })
  let envs = app.environments
  let envQty = envs.length

  // Destroy the whole app
  let destroyingApp = args.app || args.a
  if (destroyingApp) {
    // No app ID passed to the CLI
    if (destroyingApp === true) {
      let plural = envQty > 1 ? 's' : ''
      let { doubleCheck } = await prompt({
        type: 'input',
        name: 'doubleCheck',
        hint: 'To confirm, enter the Begin app ID (no quotes)',
        message: `Are you sure you want to destroy this Begin app (app name: '${app.name}', app ID: '${appID}') and its ${envQty} environment${plural}?`,
        validate: input => input === appID,
      }, promptOptions)

      if (!doubleCheck) return
    }
    // The wrong app ID was passed to the CLI
    else if (destroyingApp !== app.appID) {
      return Error('Invalid app ID')
    }

    console.error(`Destroying Begin app ID '${appID}'`)
    await client.destroy({ token, appID, _staging })
    let { raw } = inventory.inv._project
    raw = raw.split('\n').filter(l => l !== `appID ${appID}`).join('\n')
    await writeFile(inventory.inv._project.manifest, raw)
    return `Destroyed Begin app ID '${appID}'`
  }

  // Destroy a single app environment
  else if (envQty) {
    let env
    // Rely on the passed environment name
    if (envName) {
      env = envs.find(({ name }) => name === envName)
      if (!env) return ReferenceError(`Environment name ${envName} not found`)
    }
    // Select from many
    else if (envQty > 1) {
      let envNames = envs.map(({ name }) => name)
      let { selectedEnv } = await prompt({
        type: 'select',
        name: 'selectedEnv',
        message: 'Which environment would you like to destroy?',
        hint: `The next step will confirm your selection`,
        choices: envNames,
      }, promptOptions)
      env = app.environments.find(({ name }) => name === selectedEnv )
    }
    // Or just the one
    else env = envs[0]

    let { envID, name } = env

    if (!envName) {
      // Make extra sure
      let { doubleCheck } = await prompt({
        type: 'input',
        name: 'doubleCheck',
        hint: 'To confirm, enter the Begin environment ID (no quotes)',
        message: `Are you sure you want to destroy this Begin app environment (env name: '${name}', env ID: '${envID}')?`,
        validate: input => input === envID,
      }, promptOptions)
      if (!doubleCheck) return
    }

    console.error(`Destroying Begin app environment`)
    await client.env.remove({ token, appID, envID, _staging })
    return `Destroyed Begin app environment (env name: '${name}', env ID: '${envID}')`
  }
  else {
    return ReferenceError('No environments found to destroy')
  }
}
