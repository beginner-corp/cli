
function shortenPath (filePath) {
  let { sep } = require('path')
  let packageName = `@enhance${sep}starter-project${sep}`
  return filePath.substring(filePath.lastIndexOf(packageName) + packageName.length)
}

module.exports = async function (params) {
  let { existsSync, mkdirSync, readFileSync } = require('fs')
  let { isAbsolute, join, normalize, sep } = require('path')

  let { args } = params
  let utils = require('../../lib')
  let { npmCommands: { initialInstall } } = utils
  let writeFile = utils.writeFile(params)
  let error = require('./errors')(params, utils)
  let _inventory = require('@architect/inventory')
  let c = require('picocolors')
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
  delete packageJson.scripts.postinstall
  delete packageJson.devDependencies['@architect/sandbox']

  let p = file => join(projectPath, file)

  writeFile(p('package.json'), JSON.stringify(packageJson, null, 2))

  // Read .arc file from starter project
  let arcPath = join(nodeModules, '@enhance', 'starter-project', '.arc')
  let arc = readFileSync(arcPath).toString().replace('myproj', appName)

  // Write the new Arc project manifest
  writeFile(p('.arc'), arc)

  // Create starter app folders
  mkdirSync(p(`app${sep}pages`), { recursive: true })
  mkdirSync(p('public'), { recursive: true })

  // Starter project files
  // when you install @enhance/starter-project the manifest.json file is created
  // so we can read it instead of having to maintain a file list here.
  let manifestPath = join(nodeModules, '@enhance', 'starter-project', 'manifest.json')
  let starterProjectManifest = JSON.parse(readFileSync(manifestPath))

  // Create starter files
  starterProjectManifest.fileList.forEach(file => {
    let input = join(nodeModules, file)
    let data = readFileSync(input)
    writeFile(p(shortenPath(input)), data)
  })

  // Write .gitignore
  let gitIgnore = `.env
.DS_Store
**/static.json
node_modules
public/bundles
public/pages
sam.json
sam.yaml
`
  writeFile(p('.gitignore'), gitIgnore)

  // Need to install enhance/arc-plugin-enhance or 💥
  await initialInstall(params, projectPath)

  // Success message
  let cdPath = path === '.' ? '' : `cd ${path} && `
  console.error(`Project ${appName} successfully created! To get started run: ${c.bold(c.green(`${cdPath}begin dev`))}`)
}
