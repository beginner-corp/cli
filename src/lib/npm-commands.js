let spinner = require('./spinner')

function install (params, opts) {
  return new Promise((res, rej) => {
    let { spawn } = require('child_process')
    let cmd = 'npm'
    let args = [ 'install' ]
    if (opts.args) args = args.concat(opts.args)
    let { verbose, debug } = params.args

    spinner(opts.msg)
    let child = spawn(cmd, args, { cwd: opts?.cwd })
    let output = []
    if (verbose || debug) spinner.done()
    let out = data => {
      output.push(data)
      if (verbose || debug) console.error(data.toString().trim())
    }
    child.stdout.on('data', out)
    child.stderr.on('data', out)
    child.on('close', code => {
      if (!verbose && !debug) spinner.done()
      if (code !== 0) {
        if (!verbose && !debug) console.error(output.join('').toString())
        rej(Error(`Failed to install dependencies`))
      }
      else res()
    })
  })
}

async function installAwsSdk (params) {
  if (process.env.NODE_ENV !== 'testing') {
    let msg = `Installing 'aws-sdk' as a development dependency`
    return install(params, { args: [ 'aws-sdk', '--save-dev' ], msg })
  }
}

async function installDependencies (params, dependencies) {
  if (process.env.NODE_ENV !== 'testing') {
    let { readFile } = require('fs/promises')
    let packageJson = JSON.parse(await readFile('./package.json'))
    let installedDeps = Object.keys(packageJson.dependencies || {})
    let deps = dependencies.filter(dep => !installedDeps.includes(dep))
    if (deps.length) {
      let msg = params.args.verbose
        ? `Installing: ${deps.join(', ')}`
        : 'Installing additional dependencies'
      return install(params, { args: deps, msg })
    }
  }
}

async function initialInstall (params, cwd) {
  if (process.env.NODE_ENV !== 'testing') {
    return install(params, { cwd, msg: 'Installing dependencies' })
  }
}

module.exports = {
  installAwsSdk,
  installDependencies,
  initialInstall
}
