let newHelp = {
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

module.exports = function generateHelp (subcommands, params) {
  // Maybe scope help to just a single generator subcommand
  let type = params.args._[1]
  let isSubcommand = subcommands.includes(type)
  if (isSubcommand) {
    subcommands = [ type ]
    newHelp.usage[0] = newHelp.usage[0].replace('<type>', type)
  }

  for (let subcommand of subcommands) {
    let generator = require(`./generators/${subcommand}`)
    let { name, description, help } = generator
    if (isSubcommand) {
      newHelp.contents = []
      newHelp.description = description
    }
    else {
      newHelp.contents[0].items.push({ name, description })
    }
    if (help) {
      newHelp.contents.push(help.contents)
      newHelp.examples.push(...help.examples)
    }
  }
  return newHelp
}
