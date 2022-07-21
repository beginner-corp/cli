function createImportName (path) {
  let tokens = path.replace(/\$/g, '').split('/')
  return tokens.map(token => capitalize(token)).join('')
}

// TODO: This should be shared code with arc-enhance-plugin
function createPageTagName (path) {
  const pluralize = require('pluralize')
  let raw = 'page-' + path.replace(/\.mjs/g, '').replace('/', '-').replace(/\//g, '-')
  // if there are dynamic parts we need to do some additional formatting
  if (raw.includes('$')) {
    let parts = raw.split('-')
    let result = []
    let index = 0
    for (let p of parts) {
      // check if part is dynamic
      if (p.startsWith('$') === false) {
        // lookahead to the next part
        let next = parts[index + 1]
        if (next && next.startsWith('$')) {
          // singularize if it is dynamic
          result.push(pluralize.singular(p))
        }
        else {
          // otherwise concat and move on
          result.push(p)
        }
      }
      index += 1
    }
    return result.join('-')
  }
  return raw.replace('-index', '')
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

function addImport ({ tokens, path, name }) {
  let { join } = require('path')
  // figure out number of imports
  let numImports = tokens.body.filter(x => x.type === 'ImportDeclaration').length
  // Add import statement
  let filename = join('./pages', `${path}.mjs` )
  tokens.body.splice(numImports, 0, {
    'type': 'ImportDeclaration',
    'specifiers': [
      {
        'type': 'ImportDefaultSpecifier',
        'local': {
          'type': 'Identifier',
          'name': name
        }
      }
    ],
    'source': {
      'type': 'Literal',
      'value': `./${filename}`,
      'raw': `'./${filename}'`
    }
  })
  return tokens
}

function addElement ({ tokens, path, name }) {
  let tagName = createPageTagName(path)
  tokens.body = tokens.body.map(token => {
    if (token.type === 'VariableDeclaration' && token?.declarations[0]?.id?.name === 'elements') {
      token.declarations[0].init.properties.push({
        'type': 'Property',
        'key': {
          'type': 'Literal',
          'value': `${tagName}`,
          'raw': `'${tagName}'`
        },
        'computed': false,
        'value': {
          'type': 'Identifier',
          'name': name
        },
        'kind': 'init',
        'method': false,
        'shorthand': false
      })
      return token
    }
    return token
  })
  return tokens
}

module.exports = async function createPage (params, args) {
  let { lang } = params
  let { path, runtime } = args
  let addItem = require('../add-begin-item')

  if (runtime !== 'html') {
    let esprima = require('esprima')
    let escodegen = require('escodegen')
    let { readFileSync, writeFileSync } = require('fs')
    let elements = readFileSync('./app/elements.mjs').toString()

    try {
      // parse elements.mjs
      let tokens = esprima.parseModule(elements)
      // create import name
      let name = createImportName(path)
      // add import statement
      tokens = addImport({ tokens, path, name })
      // add page to elements
      tokens = addElement({ tokens, path, name })
      // convert AST to code
      elements = escodegen.generate(tokens)
      // re-write elements.mjs
      writeFileSync('./app/elements.mjs', elements)
    }
    catch (err) {
      console.log(err)
    }
  }

  let handlers = require('./handlers')

  let handler = typeof handlers[runtime] === 'function'
    ? handlers[runtime](lang)
    : handlers[runtime]

  return addItem({ path, prefix: 'app/pages', handler, lang, runtime }, params)
}
