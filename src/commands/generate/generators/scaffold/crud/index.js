module.exports = function () {
  return `import arc from '@architect/functions'
import json from './json.mjs'
import HTML from './html.mjs'

export const handler = arc.http.async(json, HTML)`
}
