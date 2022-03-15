let globals = require('./global-options')
let formatItems = require('./format-items')
let defaultHelp = require('../commands/help')
let c = require('picocolors')

let indentSize = 2
let indent = Array(indentSize + 1).join(' ')
let br = num => Array(num + 1).join('\n')
let code = str => str.replace(/`[^`]*`/g, f => c.dim(f))

module.exports = function helper (params, cmdHelp) {
  let { args, appVersion, lang, printer } = params
  if (!cmdHelp) {
    cmdHelp = defaultHelp.help
  }
  cmdHelp = cmdHelp[lang]
  let { usage, description, aliases, examples } = cmdHelp
  if (!args || !usage) throw ReferenceError('Helper must receive args + usage')

  // Command header
  // First array string is bold, everything else is normal
  let help = br(1) + `${c.white(c.bold('begin ' + usage[0]))} ${usage[1] ? usage[1] : ''}`
  if (description) {
    help += br(1) + indent + description
  }
  if (aliases) {
    help += br(1) + indent + `Alias: ${c.white(c.dim(aliases.join(', ')))}`
  }

  // Command options
  if (cmdHelp.contents) {
    let contents = Array.isArray(cmdHelp.contents) ? cmdHelp.contents : [ cmdHelp.contents ]
    contents.forEach(block => {
      let contentItems = formatItems(block.items, indent)
      help += br(2) + `${c.dim(block.header + ':')}\n${contentItems}`
    })
  }

  // Global options
  let globalOptions = formatItems(globals, indent)
  help += br(2) + `${c.dim('Global options:')}\n${globalOptions}`

  // Examples
  if (examples?.length) {
    let exampleItems = examples.map(({ name, example }) => {
      return `${indent}${name}\n${indent}${c.green('$ ' + example)}`
    }).join(br(2))
    help += br(2) + c.dim('Examples:') + br(1) + exampleItems
  }

  // Version
  help += br(2) + c.dim(`Begin version: ${appVersion}`)

  printer(code(help))
}
