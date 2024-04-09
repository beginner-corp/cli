module.exports = async function (params) {
  let { cpSync, existsSync, mkdirSync, readFileSync } = require('fs')
  let { isAbsolute, join, normalize } = require('path')

  let { args } = params
  let utils = require('../../lib')
  let { npmCommands: { initialInstall } } = utils
  let writeFile = utils.writeFile(params)
  let error = require('./errors')(params, utils)
  let _inventory = require('@architect/inventory')
  let c = require('@colors/colors/safe')
  let looseName = /^[a-z][a-zA-Z0-9-_]+$/

  // Project path
  let path = args.path || args.p || args._[1] || '.'
  if (path === true) {
    return error('no_path')
  }

  let projectPath = isAbsolute(path) ? path : normalize(join(process.cwd(), path))

  // Error out if folder already exists and it has an arc project already
  if (existsSync(projectPath)) {
    let inventory = await _inventory({ cwd: projectPath })
    let invalid = inventory.inv._project.manifest
    if (invalid) return error('project_found')
  }
  // Create new project folder
  else {
    mkdirSync(projectPath, { recursive: true })
  }

  // App name (optional)
  let appName = args.name || args.n ? args.name || args.n  : 'begin-app'
  if (!looseName.test(appName)) {
    return error('invalid_appname')
  }

  let nodeModules = join(__dirname, '..', '..', '..', 'node_modules')

  // Read package.json from starter project
  let packagePath = join(nodeModules, '@enhance', 'starter-project', 'package.json')
  let packageJson = JSON.parse(readFileSync(packagePath))

  // Tweak settings for new project
  packageJson.name = appName
  packageJson.version = '0.0.1'
  packageJson.scripts.start = 'begin dev'
  delete packageJson.devDependencies['@architect/sandbox']

  let p = file => join(projectPath, file)

  writeFile(p('package.json'), JSON.stringify(packageJson, null, 2))

  // Read .arc file from starter project
  let arcPath = join(nodeModules, '@enhance', 'starter-project', '.arc')
  let arc = readFileSync(arcPath).toString().replace('myproj', appName)

  // Write the new Arc project manifest
  writeFile(p('.arc'), arc)

  // Starter project files
  let appPath = join(nodeModules, '@enhance', 'starter-project', 'app')
  let publicPath = join(nodeModules, '@enhance', 'starter-project', 'public')
  // Copy app dirs
  cpSync(appPath, p('app'), { recursive: true })
  cpSync(publicPath, p('public'), { recursive: true })

  // Write .gitignore
  let gitIgnoreTemplate = join(nodeModules, '@enhance', 'starter-project', 'template.gitignore')
  let gitIgnore = readFileSync(gitIgnoreTemplate)
  writeFile(p('.gitignore'), gitIgnore)

  // Need to install enhance/arc-plugin-enhance or 💥
  await initialInstall(params, projectPath)

  // Success message
  let cdPath = path === '.' ? '' : `cd ${path} && `
  console.error(`Project ${appName} successfully created! To get started run: ${c.bold(c.green(`${cdPath}begin dev`))}`)
}
