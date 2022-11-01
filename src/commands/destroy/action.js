module.exports = async function action (params, utils) {
  let { args, appID, config, env, inventory, isCI } = params
  let { access_token: token, stagingAPI: _staging } = config
  let { writeFile } = utils

  let { promptOptions } = require('../../lib/app')
  let { prompt } = require('enquirer')
  let client = require('@begin/api')
  let app = await client.find({ token, appID, _staging })
  let envs = app.environments
  let envQty = envs.length
  let force = args.force

  function checkForce () {
    if (!force && isCI) {
      throw Error('`--force` flag is required to destroy in non-interactive mode')
    }
  }

  // Destroy the whole app
  if (appID && !env) {
    let plural = envQty > 1 ? 's' : ''
    checkForce()
    if (!force) {
      let { doubleCheck } = await prompt({
        type: 'input',
        name: 'doubleCheck',
        hint: 'To confirm, enter the Begin app ID (no quotes)',
        message: `Are you sure you want to destroy this Begin app (app name: '${app.name}', app ID: '${appID}') and its ${envQty} environment${plural}?`,
        validate: input => input === appID,
      }, promptOptions)

      if (!doubleCheck) return
    }
    await client.destroy({ token, appID, _staging })
    if (inventory) {
      let { raw } = inventory.inv._project
      let appString = `appID ${appID}`
      if (raw.includes(appString)) {
        raw = raw.split('\n').filter(l => l !== `appID ${appID}`).join('\n')
        await writeFile(inventory.inv._project.manifest, raw)
      }
    }
    return `Destroyed Begin app ID '${appID}'`
  }

  // Destroy an app environment
  let environment
  // A specific environment name or ID was supplied
  if (env !== true) {
    environment = envs.find(({ name, envID }) => [ name, envID ].includes(env))
    if (!environment) return Error(`Environment ${env} not found`)
  }
  // No environment was supplied, but multiple are available
  else if (envQty > 1) {
    checkForce()
    if (isCI) {
      return Error('An environment ID is required to destroy in non-interactive mode')
    }
    let envNames = envs.map(({ name }) => name)
    let { selectedEnv } = await prompt({
      type: 'select',
      name: 'selectedEnv',
      message: 'Which environment would you like to destroy?',
      hint: `The next step will confirm your selection`,
      choices: envNames,
    }, promptOptions)
    environment = app.environments.find(({ name }) => name === selectedEnv )
  }
  // No environment was supplied, but there's only one to infer from
  else environment = envs[0]

  let { envID, name } = environment

  if (!force) {
    checkForce()
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

  await client.env.remove({ token, appID, envID, _staging })
  return `Destroyed Begin app environment (env name: '${name}', env ID: '${envID}')`
}
