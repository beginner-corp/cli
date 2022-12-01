let { join } = require('path')
let { spawn } = require('child_process')

let tiny = require('tiny-json-http')

let child

let cwd = process.cwd()
let isWin = process.platform.startsWith('win')
let binPath = join(cwd, 'build', `begin${isWin ? '.exe' : ''}`)
let bin = join(binPath)

let ready = /Begin dev server \(.*\) ready!/
let url = 'http://localhost:3333'

function start (type, t, dir, reuse, options = {}) {
  return new Promise((resolve, reject) => {
    t.plan(1)
    let data = ''
    let { confirmStarted, print } = options
    if (child) throw Error('Unclean test env, found hanging child process!')
    // Quiet overrides are a bit more abstracted here bc we have to print from a child
    let cmd = type === 'module' ? 'node' : bin
    let args = type === 'module' ? [ cwd, 'dev' ] : [ 'dev' ]
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
        t.pass(`Begin dev server started (${type})`)
        resolve()
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

let startup = {
  module: start.bind({}, 'module'),
  binary: start.bind({}, 'binary'),
}

async function shutdown (t, options = {}) {
  t.plan(1)
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
  }
}

module.exports = {
  startup,
  shutdown,
}
