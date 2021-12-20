let lib = require('../../lib')
let newHelp = () => ({
  en: {
    usage: [ 'new <type> <parameters>', '[options]' ],
    description: 'Create a new app, or resources for an existing app (such as an HTTP route)',
    contents: [
      {
        header: 'Types of resources',
        items: [],
      },
    ],
    examples: [],
  }
})

module.exports = async function generateHelp (subcommands, params) {
  let { lang } = params
  let help = newHelp()

  // Try to scope help to just a single generator subcommand
  let type = params.args._[1]
  let isSubcommand = subcommands.includes(type)
  if (isSubcommand) {
    subcommands = [ type ]
    help[lang].usage[0] = help[lang].usage[0].replace('<type>', type)
  }

  for (let subcommand of subcommands) {
    let generator = require(`./generators/${subcommand}`)
    let { name, description, help: genHelp } = generator
    if (typeof genHelp === 'function') {
      genHelp = await genHelp(params, lib)
    }
    if (isSubcommand) {
      help[lang].contents = genHelp[lang].contents
      help[lang].description = description
      help[lang].examples.push(...genHelp[lang].examples)
      if (help[lang].contents?.items?.every(({ optional }) => optional)) {
        help[lang].usage[0] = help[lang].usage[0].replace(' <parameters>', ' [parameters]')
      }
    }
    else {
      help[lang].contents[0].items.push({ name, description })
    }
  }
  return help
}
