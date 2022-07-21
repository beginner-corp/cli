let copy = {
  en: {
    view_docs: 'View documentation at: https://docs.begin.com',
  }
}

let node = lang => `// ${copy[lang].view_docs}
export async function get (req) {
  return {
    json: { data: ['fred', 'joe', 'mary'] }
  }
}
`

module.exports = { node }
