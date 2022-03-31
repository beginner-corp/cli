let colors = require('ansi-colors')

let createApp = require('./create-app')
let validate = require('./validate')
let promptOptions = {
  prefix: colors.white(colors.symbols.question),
  styles: {
    primary: colors.white,
    em: colors.cyan, // Clear underlines
    danger: colors.red,
    strong: colors.white,
  },
}

module.exports = {
  createApp,
  promptOptions,
  ...validate,
}
