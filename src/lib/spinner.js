let out = process.stderr
let resetCursor = (y) => {
  out.cursorTo(0)
  if (y) out.moveCursor(0, y)
}
let write = t => out.write(`${t}\x1b[1A\n`)

let frames = [ '   ', '.  ', '.. ', '...' ]
let timing = 333
let interval, restore, lastLine

function resetSpinner (output) {
  if (interval) clearInterval(interval)
  if (lastLine) {
    out.clearLine(0)
    // Check to see if the line wrapped, otherwise we won't overwrite all old characters from the terminal buffer
    let trail = lastLine.length > process.stdout.columns ? '    ' : ''
    // Allow a custom ending message; if present, make sure to clear out any leftover lastline chars
    if (output && lastLine.length > output.length) {
      trail = new Array(lastLine.length - output.length).join(' ')
    }
    console.error(`${output || lastLine}${trail}`)
    lastLine = undefined
  }
}

function spinner (output) {
  let isCI = process.env.CI || !process.stdout.isTTY
  let isWin = process.platform.startsWith('win')

  if (!isCI && !isWin) {
    let stripAnsi = require('strip-ansi')

    // Hide cursor, queue up cursor restore for when the process eventually terminates
    write('\u001B[?25l')
    if (!restore) restore = require('restore-cursor')
    restore()

    // Assuming this ran before, write out the last line (previously with the spinner) and proceed to the new block of output
    resetSpinner()

    if (output) {
      let i = 0
      let lines = output.split('\n')
      // Print everything but the last line (if applicable)
      if (lines.length > 1) {
        lines.splice(0, lines.length - 1).forEach(l => console.error(l))
      }
      lastLine = lines[0]
      let msg = `    ${lastLine}`
      let len = stripAnsi(msg).length
      let y
      write(msg) // Initial render before first animation interval
      // Now calculate the cursor position if that last item wrapped
      if (len > process.stdout.columns) {
        y = -(Math.ceil(len / process.stdout.columns)) + 1
      }
      resetCursor(y)
      interval = setInterval(function () {
        write(`${frames[i = ++i % frames.length]} ${lastLine}`)
        resetCursor(y)
      }, timing)
    }
  }
  else {
    console.error(output)
  }
}
spinner.done = resetSpinner

module.exports = spinner
