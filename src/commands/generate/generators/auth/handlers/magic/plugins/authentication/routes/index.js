module.exports = function (){
  return `
import path from 'path'
import url from 'url'
import arc from '@architect/functions'
import router from '@enhance/arc-plugin-enhance/src/http/any-catchall/router.mjs'

export function createRouter () {
  let here = path.dirname(url.fileURLToPath(import.meta.url))
  let views = path.join(here, 'node_modules', '@architect', 'views')
  return arc.http.async(router.bind({}, { basePath: views, altPath: here }))
}

export const handler = createRouter()
`
}
