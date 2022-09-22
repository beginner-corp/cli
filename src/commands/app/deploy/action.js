module.exports = async function action (params, utils) {
  let { args, appID, envName, token } = params
  let { createApp, promptOptions } = require('../lib')
  let { prompt } = require('enquirer')
  let client = require('@begin/api')
  let app, env

  // Create a new app and associate it with this project
  if (!appID) {
    let created = await createApp(params, utils)
    app = created.app
    appID = app.appID
  }

  // Go get the app (if we didn't just create one)
  if (!app) {
    app = await client.find({ token, appID })
  }

  let envs = app.environments

  // Rely on the passed environment name
  if (envName) {
    env = envs.find(({ name }) => name === envName)
    if (!env) return ReferenceError(`Environment name ${envName} not found. You can create it by running: \`begin app create --env ${envName}\``)
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

  // Just return the status of the latest build
  if (args.status) {
    let builds = await client.env.builds({ token, appID, envID })
    if (!builds.length) return Error('No builds found for this environment')
    return `Latest build status: ${builds[0].buildStatus}`
  }

  let build = await client.env.deploy({ token, appID, envID, verbose: true })
  if (!build?.buildID) return ReferenceError('Deployment failed, did not receive buildID')

  console.error(`Deploying '${name}'`)
  console.error(`(You can now exit this process and check in on its status with \`begin app deploy --status\`)`)
  await getUpdates({ token, appID, envID, buildID: build.buildID })
  console.error(`Deployed '${name}' to: ${url}`)
}

// Recursive update getter
async function getUpdates (params) {
  let client = require('@begin/api')
  return new Promise((resolve, reject) => {
    let lastPrinted = false

    async function check () {
      let build = await client.env.build(params)
      if (!build) {
        reject('Build not found!')
        return
      }
      let { buildStatus, error, timeout } = build
      let updates = build.updates.sort(sortBuilds)
      if (updates.length) {
        let update = lastPrinted ? concatMsgs(updates.filter(({ ts }) => ts >= lastPrinted)) : concatMsgs(updates)
        if (update) {
          lastPrinted = new Date().toISOString()
          process.stderr.write('\n' + update.trim())
        }
      }

      // When resolving/rejecting, make sure to end with a trailing newline to reset the cursor position
      if ([ 'building', 'deploying' ].includes(buildStatus)) {
        setTimeout(check, 3000)
      }
      else if (error) {
        let msg = Buffer.from(error.msg, 'base64').toString()
        process.stderr.write('\n')
        reject(Error(msg))
      }
      else if (timeout) {
        // Build timeout error text should have come through in the build update stream
        reject()
      }
      else if ([ 'success', 'failed' ].includes(buildStatus)) {
        process.stderr.write('\n')
        resolve()
      }
    }
    check()
  })
}

let sortBuilds = ({ ts: ts1 }, { ts: ts2 }) => ts1 - ts2
let concatMsgs = arr => arr.map(({ msg }) => Buffer.from(msg, 'base64').toString()).join('')
