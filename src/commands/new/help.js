let newHelp = () => ({
  en: {
    usage: [ 'new <type> <parameters>', '[options]' ],
    description: 'Create a new HTTP route, async event, or scheduled event',
    contents: [
      {
        header: 'Command arguments',
        items: [],
      },
    ],
    examples: [],
  }
})

module.exports = function generateHelp (subcommands, params) {
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
    let { name, description } = generator
    if (isSubcommand) {
      help[lang].contents = []
      help[lang].description = description
    }
    else {
      help[lang].contents[0].items.push({ name, description })
    }
    if (generator.help) {
      help[lang].contents.push(generator.help.contents)
      help[lang].examples.push(...generator.help.examples)
    }
  }
  return help
}
