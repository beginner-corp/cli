const spawn = require('cross-spawn')
const { readFileSync } = require('fs')

function isInstalledLocally (packageName) {
  return isInstalled('npm', [ 'list' ], packageName )
}

function isInstalledGlobally (packageName) {
  return isInstalled('npm', [ 'list', '--g' ], packageName )
}

function isInstalled (cmd, args, packageName) {
  let result = spawn.sync(cmd, [ ...args, packageName ])
  let stdout = result.stdout.toString().trim()
  if (stdout.includes(packageName)) {
    return true
  }
  return false
}

function installAwsSdk () {
  if (process.env.NODE_ENV !== 'testing') {
    if (!isInstalledLocally('aws-sdk') && !isInstalledGlobally('aws-sdk')) {
      let c = require('picocolors')
      console.log('Installing aws-sdk as a development dependency')
      console.log(`To avoid this message in the future you can globally install the sdk ${c.cyan('npm install -g aws-sdk')}`)
      spawn.sync('npm', [ 'install', 'aws-sdk', '--save-dev' ])
    }
  }
}

function installDependencies (dependencies) {
  if (process.env.NODE_ENV !== 'testing') {
    console.log('Installing npm dependencies')
    const packageJson = JSON.parse(readFileSync('./package.json'))
    const installedDeps = Object.keys(packageJson.dependencies)
    const deps = dependencies.filter(dep => !installedDeps.includes(dep))
    deps.forEach(dep => spawn.sync('npm', [ 'install', `${dep}`, '--silent' ]))
  }
}

function initialInstall () {
  return spawn.sync('npm', [ 'install', '--silent' ], { encoding: 'utf-8' })
}

module.exports = {
  installAwsSdk,
  installDependencies,
  initialInstall
}
