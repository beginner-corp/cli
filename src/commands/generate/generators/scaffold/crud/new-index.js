module.exports = function () {
  return `import arc from '@architect/functions'
  import HTML from './html.mjs'

  export const handler = arc.http.async(HTML)`
}
