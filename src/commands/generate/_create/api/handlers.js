let copy = {
  en: {
    view_docs: 'View documentation at: https://enhance.dev/docs/learn/starter-project/api',
  }
}

let node = lang => `// ${copy[lang].view_docs}
/**
 * @typedef {import('@enhance/types').EnhanceApiFn} EnhanceApiFn
 */

/**
 * @type {EnhanceApiFn}
 */
export async function get (req) {
  return {
    json: { data: ['fred', 'joe', 'mary'] }
  }
}
`

module.exports = { node }
