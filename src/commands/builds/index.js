let names = { en: [ 'builds' ] }
let help = require('./help')

let warningStatus = [ 'pending', 'in_progress' ]
let errorStatus = [ 'failed', 'fault', 'timed_out', 'stopped' ]

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
  let { checkManifest, getAppID, getConfig, promptOptions } = lib
  let { args } = params

  let config = getConfig(params)
  if (!config.access_token) {
    let msg = 'You must be logged in to interact with builds, please run: begin login'
    return Error(msg)
  }
  let { access_token: token, stagingAPI: _staging } = config

  let manifestErr = checkManifest(params.inventory)
  if (manifestErr) return manifestErr

  let appID = args.app || args.a || getAppID(params.inventory)
  if (!appID) return Error('Please specify an appID')

  // Make sure the appID is valid
  try {
    var app = await client.find({ token, appID, _staging })
  }
  catch (err) {
    if (err.message === 'app_not_found') return error(err.message)
    return err
  }
  let { environments: envs } = app
  let last = '└──'

  // Environment is required if app has more than one
  let env = args.env || args.e
  if (!env && envs.length === 1) {
    var environment = envs[0]
  }
  else if (!env || env === true) {
    return error('no_env')
  }
  else if (env) {
    var environment = envs.find(({ name, envID }) => [ name, envID ].includes(env))
    if (!environment) return error('invalid_env')
  }
  let { envID, name, url } = environment

  console.error(`${c.white(c.bold(app.name))} (app ID: ${appID})`)
  console.error(`${last} ${name} (env ID: ${envID}): ${c.green(url)}`)

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
    message: 'View detailed build logs? (ctrl-c to skip)',
    choices
  }, promptOptions)

  let answer = await prompt.run()
  let selectedBuildID = choices.find(item => item.name === answer).value
  let selectedBuild = builds.find(item => item.buildID === selectedBuildID)

  let lastUpdate = selectedBuild.updates.length - 1
  let format = (item, i) => {
    let out = `${c.cyan(item.ts)}:\n` +
              `${Buffer.from(item.msg, 'base64').toString().trim()}`
    if (i !== lastUpdate) out += '\n'
    return out
  }
  let output = selectedBuild.updates.map(format).join('\n')
  return output
}

module.exports = {
  names,
  action,
  help,
}
