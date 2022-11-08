let net = require('net')
let sandbox = require('@architect/sandbox')

/**
 * Ensure we have access to the desired HTTP port!
 * Ported (ahem) from @architect/sandbox
 */
function getPort (checking) {
  return new Promise((res, rej) => {
    let tries = 0
    let tester = net.createServer()
    let done = false
    function check () {
      if (tries === 50) {
        let msg = `Could not find open port after 50 tries, please close some applications and try again`
        return rej(Error(msg))
      }
      tester.listen(checking, 'localhost')
      tester.once('error', err => {
        if (err.message.includes('EADDRINUSE')) {
          tries++
          checking++
          check()
        }
      })
      tester.once('listening', () => {
        tester.close(() => {
          // Tester close emits multiple events, so only resolve once
          if (!done) {
            done = true
            res(checking)
          }
        })
      })
    }
    check()
  })
}

module.exports = {
  async start ({ cwd }) {
    let port = await getPort(3333)
    // TODO: fix Sandbox (and this) to accept a ports property at some point?
    process.env.ARC_INTERNAL_PORT = port + 100 // Yeah, this magic number can definitely break, but it's unlikely in a CI context
    await sandbox.start({ cwd, port, quiet: true })
    return port
  },
  async end () {
    delete process.env.ARC_INTERNAL_PORT
    return sandbox.end()
  }
}
