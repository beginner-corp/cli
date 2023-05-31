let colors = require('ansi-colors')

let createApp = require('./create-app')
let validate = require('./validate')
let promptOptions = {
  prefix: colors.bold(colors.symbols.question),
  styles: {
    primary: colors.unstyle,
    em: colors.cyan, // Clear underlines
    danger: colors.red,
    strong: colors.bold,
  },
}

module.exports = {
  createApp,
  promptOptions,
  ...validate,
}
