module.exports = async function action (params, utils) {
  let { appID, envName, token } = params
  let { createApp, promptOptions } = require('../lib')
  let { prompt } = require('enquirer')
  let client = require('@begin/api')
  let app, env

  // Create a new app and associate it with this project
  if (!appID) {
    let created = await createApp(params, utils)
    app = created.app
  }

  // Go get the app (if we didn't just create one)
  if (!app) {
    app = await client.find({ token, appID })
  }

  let envs = app.environments

  // Rely on the passed environment name
  if (envName) {
    env = envs.find(({ name }) => name === envName)
    if (!env) return ReferenceError(`Environment name ${envName} not found`)
  }
  // Manually select the environment to deploy
  else if (envs.length > 1) {
    let envNames = envs.map(({ name }) => name)
    let { selectedEnv } = await prompt({
      type: 'select',
      name: 'selectedEnv',
      message: 'Which environment would you like to deploy?',
      choices: envNames,
    }, promptOptions)
    env = envs.find(({ name }) => name === selectedEnv )
  }
  else if (!envs.length) {
    return ReferenceError('No environments found to deploy')
  }
  // Or just default to the lone environment
  else env = envs[0]

  let { name, envID, url } = env
  await client.env.deploy({ token, appID, envID, verbose: true })

  // TODO get CF event ID and poll for deployment status
  return `Deploying '${name}' to: ${url}`
}
