module.exports = function (){
  return `
import path from 'path'
import url from 'url'
import arc from '@architect/functions'
import router from '@enhance/arc-plugin-enhance/src/http/any-catchall/router.mjs'

export function createRouter (base) {
  if (!base) {
    let here = path.dirname(url.fileURLToPath(import.meta.url))
    base = here
  }
  return arc.http.async(router.bind({}, base))
}

export const handler = createRouter() 

`
}
