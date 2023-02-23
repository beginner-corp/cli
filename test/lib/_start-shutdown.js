let { spawn } = require('child_process')
let { join } = require('path')
let net = require('net')
let tiny = require('tiny-json-http')

let child
let url

let cwd = process.cwd()
let isWin = process.platform.startsWith('win')
let binPath = join(cwd, 'build', `begin${isWin ? '.exe' : ''}`)
let bin = join(binPath)

let ready = /Begin dev server \(.*\) ready!/

async function startDev (type, t, dir, reuse, options = {}) {
  let port = await getPort()
  // TODO: fix Sandbox (and this) to accept a ports property at some point?
  let _arc = port + 100 // Yeah, this magic number can definitely break, but it's pretty unlikely in a CI context
  process.env.ARC_INTERNAL_PORT = _arc
  url = `http://localhost:${port}`

  return new Promise((resolve, reject) => {
    t.plan(1)
    let data = ''
    let { confirmStarted, print } = options
    if (child) throw Error('Unclean test env, found hanging child process!')
    // Quiet overrides are a bit more abstracted here bc we have to print from a child
    let cmd = type === 'module' ? 'node' : bin
    let args = type === 'module' ? [ cwd ] : []
    args.push('dev', '--port', `${port}`, '--disable-telemetry')
    child = spawn(cmd, args, {
      cwd: dir,
      env: { ...process.env },
    })
    let started = false
    function check (chunk) {
      data += chunk.toString()
      if (print && started) { console.log(chunk.toString()) }
      if ((data.match(ready) || data.includes(confirmStarted)) && !started) {
        started = true
        t.pass(`Begin dev server started (${type}, http: ${port}, _arc: ${port})`)
        resolve(port)
      }
    }
    child.stdout.on('data', check)
    child.stderr.on('data', check)
    child.on('error', err => {
      t.fail(err)
      reject()
    })
  })
}

async function shutdown (t, options = {}) {
  t.plan(1)
  delete process.env.ARC_INTERNAL_PORT
  let { child: anotherChild } = options
  let proc = anotherChild || child

  proc.stdin.write('\u0003')
  proc.stdin.end()
  // Child processes can take a bit to shut down
  // If we don't confirm it's exited, the next test may try to start a second Sandbox and blow everything up
  let tries = 0
  async function check () {
    if (proc.exitCode === null && tries <= 10) {
      tries++
      setTimeout(check, 25)
    }
    else if (proc.exitCode === null) {
      throw Error(`Could not exit Sandbox binary child process (${proc.pid})`)
    }
    else {
      anotherChild = child = undefined
      await verifyShutdown(t)
    }
  }
  check()
}

// Verify sandbox shut down
async function verifyShutdown (t) {
  try {
    await tiny.get({ url })
    t.fail('Sandbox did not shut down')
  }
  catch (err) {
    let errs = [ 'ECONNREFUSED', 'ECONNRESET' ]
    t.ok(errs.includes(err.code), `Begin dev server successfully shut down`)
    url = undefined
  }
}

module.exports = {
  start: {
    module: startDev.bind({}, 'module'),
    binary: startDev.bind({}, 'binary'),
  },
  shutdown,
  getPort,
}

/**
 * Ensure we have access to the desired HTTP port!
 * Ported (ahem) from @architect/sandbox
 */
function getPort () {
  // Our self-hosted runners do not (yet) have full isolation, so port conflicts may be a thing
  // For whatever reason, even relying on port checking / incrementing wasn't reliably working in that environment
  // So, instead we'll just get a random port number between 50000–65000 and use that
  let min = 50000
  let max = 65000
  let checking = process.env.CI && !process.platform.startsWith('win')
    ? Math.floor(Math.random() * (max - min + 1)) + min
    : 3333
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
