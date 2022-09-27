let copy = {
  en: {
    view_docs: 'View documentation at: https://docs.begin.com/en/scheduled-functions/provisioning',
  }
}

let deno = lang => `// ${copy[lang].view_docs}
export async function handler (event: object) {
  console.log(JSON.stringify(event, null, 2))
  return
}
`

let node = lang => `// ${copy[lang].view_docs}
export async function handler (event) {
  console.log(JSON.stringify(event, null, 2))
  return
}
`

let ruby = lang => `# ${copy[lang].view_docs}
def handler(event)
  puts event
  true
end
`

let python = lang => `# ${copy[lang].view_docs}
def handler(event, context):
  print(event)
  return True
`

module.exports = { node, deno, ruby, python }
