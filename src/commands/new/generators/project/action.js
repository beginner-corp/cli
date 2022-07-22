let looseName = /^[a-z][a-zA-Z0-9-_]+$/
let { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')
let { isAbsolute, join, normalize } = require('path')

function log (text, json = false) {
  if (!json) {
    console.log(text)
  }
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
  writeFile('package.json', JSON.stringify(packageJson))

  // Write the new Arc project manifest
  let arc = `@app\n${appName}\n\n@http\n\n@views\nsrc app\n\n@plugins\nenhance/arc-plugin-enhance\n`
  writeFile('.arc', arc)

  // Create starter app folders
  mkdirSync('app/elements', { recursive: true })
  mkdirSync('app/pages', { recursive: true })
  mkdirSync('public', { recursive: true })

  // Starter project files
  let starterFiles = [
    '@enhance/starter-project/app/elements/footer.mjs',
    '@enhance/starter-project/app/elements/header.mjs',
    '@enhance/starter-project/app/pages/index.html',
    '@enhance/starter-project/app/elements.mjs',
    '@enhance/starter-project/public/favicon.svg',
  ]

  // Create starter files
  starterFiles.forEach(file => {
    let input = require.resolve(file)
    let data = readFileSync(input)
    writeFileSync(input.replace('/snapshot/cli/node_modules/@enhance/starter-project/', ''), data)
  })

  // Need to install enhance/arc-plugin-enhance or 💥
  log('Installing npm dependencies', args.json)
  await initialInstall()

  // Success message
  log(`Project ${appName} successfully created.`, args.json)
  log(`Change into directory ${path} and run ${c.bold(c.cyan('begin dev'))}`, args.json)
}
