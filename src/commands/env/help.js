let newEnv = () => ({
  en: {
    usage: [ 'env <action> <parameters>', '[options]' ],
    description: `List your Begin app's environment variables`,
    contents: [
      {
        header: 'Env actions',
        items: [],
      },
    ],
    examples: [],
  }
})

module.exports = async function generateHelp (subcommands, aliases, params) {
  let lib = require('../../lib')
  let { lang } = params
  let help = newEnv()

  // Try to scope help to just a single app action subcommand
  let action = params.args._[1]
  let alias = Object.keys(aliases).includes(action) && aliases[action]
  action = alias || action

  let isSubcommand = subcommands.includes(action)
  if (isSubcommand) {
    subcommands = [ action ]
    help[lang].usage[0] = help[lang].usage[0].replace('<action>', action)
  }

  for (let subcommand of subcommands) {
    let appAction = require(`./${subcommand}`)
    let { name, description, help: genHelp } = appAction
    if (typeof genHelp === 'function') {
      genHelp = await genHelp(params, lib)
    }
    if (isSubcommand) {
      help[lang].contents = genHelp[lang].contents
      help[lang].description = description
      help[lang].examples.push(...genHelp[lang].examples)
    }
    else {
      help[lang].contents[0].items.push({ name, description })
    }
  }
  return help
}
