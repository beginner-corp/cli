let newHelp = () => ({
  en: {
    usage: [ 'app <action> [parameters]', '[options]' ],
    description: 'Create, deploy, and manage a Begin app and its environments',
    contents: [
      {
        header: 'App actions',
        items: [],
      },
    ],
    examples: [],
  }
})

module.exports = async function generateHelp (subcommands, params) {
  let lib = require('../../lib')
  let { lang } = params
  let help = newHelp()

  // Try to scope help to just a single app action subcommand
  let action = params.args._[1]
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
