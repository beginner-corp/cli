module.exports = async function action (params) {
  let { app, appID } = params
  let { environments, name } = app
  let c = require('picocolors')

  let item = '├──'
  let last = '└──'
  let output = []
  output.push(`${c.white(c.bold(name))} (app ID: ${appID})`)
  if (!environments.length) {
    output.push(`${last} (no app environments)`)
  }
  else {
    let lastEnv = environments.length - 1
    environments.forEach(({ name, envID, url, vars }, i) => {
      let draw = lastEnv === i ? last : item
      output.push(`${draw} ${name} (env ID: ${envID}): ${c.green(url)}`)
      if (!Object.keys(vars).length) {
        output.push(`    ${last} (no environment variables)`)
      }
      else {
        let keys = Object.keys(vars)
        let lastVar = keys.length - 1
        keys.forEach((key, i) => {
          // Ceci n'est pas une pipe
          let marg = environments.length > 1 ? '│' : ' '
          let draw = lastVar === i ? last : item
          output.push(`${marg}   ${draw} ${key}=${vars[key][0]}****`)
        })
      }
    })
  }
  return output.join('\n')
}
