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
        else rej(err)
      })
      tester.once('listening', () => {
        tester.close(() => {
          // server.close() may call back multiple times, so only resolve once
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
    // Our self-hosted runners do not (yet) have full isolation, so port conflicts may be a thing
    // For whatever reason, even relying on port checking / incrementing wasn't reliably working in that environment
    // So, instead we'll just get a random port number between 50000–65000 and use that
    let min = 50000
    let max = 65000
    let seed = process.env.CI && !process.platform.startsWith('win')
      ? Math.floor(Math.random() * (max - min + 1)) + min
      : 3333
    let port = await getPort(seed)
    // TODO: fix Sandbox (and this) to accept a ports property at some point?
    let _arc = port + 100 // Yeah, this magic number can definitely break, but it's pretty unlikely in a CI context
    process.env.ARC_INTERNAL_PORT = _arc
    console.log('Starting Sandbox with ports:', { http: port, _arc })
    await sandbox.start({ cwd, port, quiet: true })
    return port
  },
  async end () {
    delete process.env.ARC_INTERNAL_PORT
    return sandbox.end()
  }
}
