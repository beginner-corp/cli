let names = { en: [ 'builds' ] }
let help = require('./help')

let warningStatus = [ 'pending', 'in_progress' ]
let errorStatus = [ 'failed' | 'fault' | 'timed_out' | 'stopped' ]

function colorizeBuildStatus (buildStatus, c) {
  let status = buildStatus.toLowerCase()
  if (warningStatus.includes(status)) {
    return c.bold(c.yellow(status))
  }
  else if (errorStatus.includes(status)) {
    return c.bold(c.red(status))
  }
  return c.bold(c.green(status))
}

async function action (params) {
  let { Select } = require('enquirer')
  let c = require('picocolors')
  let error = require('./errors')(params)
  let client = require('@begin/api')
  let _inventory = require('@architect/inventory')
  params.inventory = await _inventory()
  let lib = require('../../lib')
  let { checkManifest, getConfig, promptOptions } = lib
  let { args } = params

  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to interact with builds, please run: begin login'
    return Error(msg)
  }
  let { access_token: token, stagingAPI: _staging } = config

  let manifestErr = checkManifest(params.inventory)
  if (manifestErr) return manifestErr

  // See if the project manifest contains an app ID
  let { begin } = params.inventory.inv._project.arc
  let appID = begin?.find(i => i[0] === 'appID' && typeof i[1] === 'string')?.[1]

  // Make sure the appID is valid
  let app = null
  try {
    app = await client.find({ token, appID, _staging })
  }
  catch (err) {
    return error([ 'no_appid_found' ])
  }
  let { environments, name } = app
  let last = '└──'

  // Environment is required if app has more than one
  let envID = args.e || args.env
  if (!envID && environments.length === 1) {
    envID = environments[0].envID
  }
  else if (!envID || envID === true) {
    return error([ 'no_env' ])
  }

  let env = environments.find(item => item.envID === envID)
  if (!env) {
    return error([ 'invalid_env' ])
  }

  console.log(`${c.white(c.bold(name))} (app ID: ${appID})`)
  console.log(`${last} ${env.name} (env ID: ${env.envID}): ${c.green(env.url)}`)

  let builds = await client.env.builds({ token, appID, envID })
  let choices = []
  if (!builds.length) {
    return `    ${last} (no builds)`
  }
  builds.forEach(({ deployHash, created, buildID, buildStatus }) => {
    let status = colorizeBuildStatus(buildStatus, c)
    let shortHash = deployHash.substring(0, 7)
    let buildTime = new Date(created)
    choices.push({ name: `${buildStatus} - ${shortHash} - ${buildTime.toLocaleDateString()} ${buildTime.toLocaleTimeString()}`, message: `${status} - ${shortHash} - ${buildTime.toLocaleDateString()} ${buildTime.toLocaleTimeString()}`, value: buildID })
  })

  let prompt = new Select({
    name: 'build',
    message: 'View detailed build logs? (Ctrl-C to skip)',
    choices
  }, promptOptions)

  let answer = await prompt.run()
  let selectedBuildID = choices.find(item => item.name === answer).value
  let selectedBuild = builds.find(item => item.buildID === selectedBuildID)

  let output = []
  selectedBuild.updates.forEach(item => output.push(`${c.cyan(item.ts)}: ${Buffer.from(item.msg, 'base64').toString()}`))
  return output.join('\n')
}

module.exports = {
  names,
  action,
  help,
}
