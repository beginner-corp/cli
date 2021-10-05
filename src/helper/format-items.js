let cols = process.stdout.columns
let copyCol = 24
let opt = optional => optional ? '[Optional] ' : ''

// Item formatter loops through help item blocks, and formats each command or set of flags
// Then it aligns the description, possibly also wrapping it onto multiple lines
module.exports = function formatItems (items, indent) {
  let maxName = copyCol - (indent.length + 2)
  return items.map(({ name, description, optional }) => {
    if (name.length > maxName) {
      throw Error(`Item name maximum character length exceeded: '${name}' is ${name.length} chars, names must be ${maxName} or fewer chars`)
    }
    let itemName = `${indent}${name}`.padEnd(copyCol)
    let itemDesc = opt(optional) + description
    let item = itemName + itemDesc
    // Wrap to the copy col length
    if (cols >= 80 && (item.length > cols)) {
      let room = cols - copyCol
      let words = itemDesc.split(' ')
      let lines = [ '' ]
      words.forEach(c => {
        let l = lines.length - 1
        let word = `${c} `
        if ((lines[l].length + word.length) <= room) return lines[l] += word
        lines.push(word)
      })
      item = lines.map((l, i) => {
        return i === 0
          ? itemName + l.trim()
          : ' '.padEnd(copyCol) + l.trim()
      }).join('\n')
    }
    return item
  }).join('\n')
}
