const { exec } = require('child_process')
const { readFileSync } = require('fs')

function executeCmd (cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    // console.log(`stdout: ${stdout}`)
  })
}

function installDependencies (dependencies) {
  if (process.env.NODE_ENV !== 'testing') {
    const packageJson = JSON.parse(readFileSync('./package.json'))
    const installedDeps = Object.keys(packageJson.dependencies)
    const deps = dependencies.filter(dep => !installedDeps.includes(dep)).join(' ')
    executeCmd(`npm i ${deps} --silent`)
  }
}

module.exports = {
  installDependencies
}
