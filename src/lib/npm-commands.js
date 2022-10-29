function installAwsSdk () {
  if (process.env.NODE_ENV !== 'testing') {
    const spawn = require('cross-spawn')
    let c = require('picocolors')
    console.log(`Installing ${c.bold(c.cyan('aws-sdk'))} as a development dependency`)
    spawn.sync('npm', [ 'install', 'aws-sdk', '--save-dev' ])
  }
}

function installDependencies (dependencies) {
  if (process.env.NODE_ENV !== 'testing') {
    const spawn = require('cross-spawn')
    const { readFileSync } = require('fs')
    console.log('Installing npm dependencies')
    const packageJson = JSON.parse(readFileSync('./package.json'))
    const installedDeps = Object.keys(packageJson.dependencies)
    const deps = dependencies.filter(dep => !installedDeps.includes(dep))
    deps.forEach(dep => spawn.sync('npm', [ 'install', `${dep}`, '--silent' ]))
  }
}

function initialInstall (cwd) {
  if (process.env.NODE_ENV !== 'testing') {
    const spawn = require('cross-spawn')
    return spawn.sync('npm', [ 'install', '--silent' ], { cwd })
  }
  return { status: 0 } // Assume tests successfully npm "installed" project deps
}

module.exports = {
  installAwsSdk,
  installDependencies,
  initialInstall
}
