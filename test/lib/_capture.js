let log = console.log
let err = console.error

let capture = {
  start: () => {
    console.log = (...out) => capture.stdout += out.join(' ') + '\n'
    console.error = (...out) => capture.stderr += out.join(' ') + '\n'
    capture.reset()
  },
  stop: () => {
    console.log = log
    console.error = err
  },
  stdout: '',
  stderr: '',
  reset: () => {
    capture.stdout = capture.stderr = ''
  },
}

module.exports = capture
