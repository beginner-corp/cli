let looseName = /^[a-z][a-zA-Z0-9-_]+$/
let { existsSync, mkdirSync, readFileSync } = require('fs')
let { isAbsolute, join, normalize, sep } = require('path')

function log (text, json = false) {
  if (!json) {
    console.log(text)
  }
}

function shortenPath (filePath) {
  let packageName = `@enhance${sep}starter-project${sep}`
  return filePath.substring(filePath.lastIndexOf(packageName) + packageName.length)
}

module.exports = async function (params, utils) {
  let { args } = params
  let { writeFile } = utils
  let error = require('./errors')(params, utils)
  let _inventory = require('@architect/inventory')
  let { initialInstall } = require('../../../../lib').npmCommands
  let c = require('picocolors')

  // Project path (required)
  let path = args.p || args.path
  if (!path || path === true) {
    return error('no_path')
  }

  let projectPath = isAbsolute(path) ? path : normalize(join(process.cwd(), path))

  // Error out if folder already exists and it has an arc project already
  if (existsSync(projectPath)) {
    process.chdir(projectPath)
    let inventory = await _inventory()
    let invalid = inventory.inv._project.manifest
    if (invalid) return error('project_found')
  }
  // Create new project folder
  else if (mkdirSync(projectPath, { recursive: true })) {
    process.chdir(projectPath)
  }
  else {
    return error('folder_creation')
  }

  // App name (optional)
  let appName = args.n || args.name ? args.n || args.name  : 'begin-app'
  if (!looseName.test(appName)) {
    return error('invalid_appname')
  }

  // write package.json
  let packageJson = {
    'name': `${appName}`,
    'version': '0.0.1',
    'scripts': {
      'start': 'sandbox'
    },
    'dependencies': {
      '@enhance/arc-plugin-enhance': 'latest'
    }
  }
  writeFile('package.json', JSON.stringify(packageJson, null, 2))

  // Write the new Arc project manifest
  let arc = `@app\n${appName}\n\n@plugins\nenhance/arc-plugin-enhance\n\n@bundles\n@enhance-styles\n`
  writeFile('.arc', arc)

  // Create starter app folders
  mkdirSync('app/pages', { recursive: true })
  mkdirSync('models', { recursive: true })
  mkdirSync('public', { recursive: true })

  // Starter project files
  // when you install @enhance/starter-project the manifest.json file is created
  // so we can read it instead of having to maintain a file list here.
  let manifestPath = require.resolve('@enhance/starter-project/manifest.json')
  let manifestData = readFileSync(manifestPath).toString()
  let starterProjectManifest = JSON.parse(manifestData)

  // Create starter files
  starterProjectManifest.fileList.forEach(file => {
    let input = require.resolve(file)
    let data = readFileSync(input)
    writeFile(shortenPath(input), data)
  })

  // Need to install enhance/arc-plugin-enhance or 💥
  log('Installing npm dependencies', args.json)
  initialInstall()

  // Success message
  if (args['_'][0] === 'init') {
    log(`Project ${appName} successfully initialied.`, args.json)
    log(`Run ${c.bold(c.cyan('begin dev'))} to get started.`, args.json)
  }
  else {
    log(`Project ${appName} successfully created.`, args.json)
    log(`Change into directory ${path} and run ${c.bold(c.cyan('begin dev'))} to get started.`, args.json)
  }
}
