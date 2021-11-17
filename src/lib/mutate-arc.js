// These pragmas are key/value arrays (e.g. `runtime node`); if present, update their values
let updateValues = [ 'arc', 'aws' ]
let ignored = [ 'newline', 'space', 'comment' ]
let removeNewlines = ({ type }) => type !== 'newline'
let getLastRealItem = vals => {
  let lastItem = 1
  vals.forEach(({ type }, i) => { !ignored.includes(type) ? lastItem = i + 1 : null })
  return lastItem
}

function upsert (params) {
  let { item, pragma, raw } = params
  let { compiler, lexer, parser } = require('@architect/parser')
  let getPragmaIndex = values => values.findIndex(({ name }) => name === pragma)

  let ast = parser(lexer(raw))
  // Add a leading newline here in case the pragma doesn't exist; if it does, we'll strip it later
  let itemAst = parser(lexer('\n' + `@${pragma}\n` + item + '\n'))
  let pragmaIndex = getPragmaIndex(ast.values)

  // Add an entire pragma
  if (pragmaIndex === -1) {
    ast.values.push(...itemAst.values)
    return compiler(ast, 'arc')
  }

  // Upsert into an existing pragma
  else {
    let itemPragmaIndex = getPragmaIndex(itemAst.values)
    let vals = ast.values[pragmaIndex].values

    let updatingValues = updateValues.includes(pragma)
    // We're updating items inline
    if (updatingValues) {
      // Loop through the item(s) being upserted and pull out names + values
      let items = itemAst.values[itemPragmaIndex].values
        .filter(removeNewlines)
        .map(item => {
          let { type, name, values } = item
          if (type === 'array') return { name: values[0].value, item }
          if (type === 'vector' || type === 'map') return { name, item }
        })

      // Compare the names/values with those in the pragma
      items.forEach(upserting => {
        let { name } = upserting
        let found = false
        vals.forEach((existing, i) => {
          let { type } = existing
          let foundArray = type === 'array' && existing.values[0].value === name
          let foundMapOrVector = (type === 'vector' || type === 'map') && existing.name === name
          if (foundArray || foundMapOrVector) {
            vals[i] = upserting.item
            found = true
          }
        })
        if (!found) {
          let lastItem = getLastRealItem(vals)
          vals.splice(lastItem, 0, upserting.item)
        }
      })
    }
    // We're adding new items to the existing pragma
    else {
      // Find the last real item in the pragma so we can preserve any trailing line breaks, etc.
      let lastItem = getLastRealItem(vals)
      // Splice in the new thing; don't forget to remove its leading newline
      vals.splice(lastItem, 0, ...itemAst.values[1].values.slice(1))
    }

    ast.values[pragmaIndex].values = vals
    return compiler(ast, 'arc')
  }
}

module.exports = {
  upsert
}
