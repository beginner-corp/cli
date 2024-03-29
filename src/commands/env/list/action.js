module.exports = async function action (params, utils) {
  let { app, appID, args } = params
  let { environments, name } = app
  let { list } = utils
  let c = require('@colors/colors/safe')

  let output = []
  output.push(`${c.bold(name)} (app ID: ${appID})`)
  if (!environments.length) {
    output.push(`${list.last} (no app environments)`)
  }
  else {
    let envs = app.environments

    let env = args.env || args.e
    if (env && env !== true) {
      envs = envs.filter(({ name, envID }) => [ name, envID ].includes(env))
      if (!envs.length) return Error(`Environment ${env} not found`)
    }
    let lastEnv = envs.length - 1
    envs.forEach(({ name, envID, url, vars }, i) => {
      let draw = lastEnv === i ? list.last : list.item
      output.push(`${draw} ${name} (env ID: ${envID}): ${c.green(url)}`)
      if (!Object.keys(vars).length) {
        output.push(`    ${list.last} (no environment variables)`)
      }
      else {
        let keys = Object.keys(vars)
        let lastVar = keys.length - 1
        keys.forEach((key, i) => {
          // Ceci n'est pas une pipe
          let marg = envs.length > 1 ? list.line : ' '
          let draw = lastVar === i ? list.last : list.item
          output.push(`${marg}   ${draw} ${key}=${vars[key][0]}****`)
        })
      }
    })
  }
  return output.join('\n')
}
