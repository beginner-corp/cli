/**
 *
 * @param {Array<Array<string>>} arrays
 * @param {Number} padding
 * @returns {Array<string>} mluti-line string
 */
function columns (arrays, padding = 1) {
  const colLengths = []
  arrays.forEach(row => {
    row.forEach((item, colI) => {
      colLengths[colI] = Math.max(colLengths[colI] || 0, item.length)
    })
  })

  const lines = []
  arrays.forEach(row => {
    let line = row.map((item, colI) => {
      return item.padEnd(colLengths[colI] + padding, ' ')
    }).join('').trim()

    lines.push(line)
  })

  return lines
}

module.exports = columns
