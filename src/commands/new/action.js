
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
  let path = args.p || args.path || args._[1] || '.'
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
  let appName = args.n || args.name ? args.n || args.name  : 'begin-app'
  if (!looseName.test(appName)) {
    return error('invalid_appname')
  }

  // write package.json
  let packageJson = {
    'name': `${appName}`,
    'version': '0.0.1',
    'scripts': {
      'start': 'begin dev',
      'lint': 'eslint ./app/**/*.mjs --fix'
    },
    'devDependencies': {
      '@enhance/types': 'latest',
      'eslint': 'latest'
    },
    'dependencies': {
      '@enhance/arc-plugin-enhance': 'latest'
    },
    'eslintConfig': {
      'env': {
        'node': true
      },
      'extends': 'eslint:recommended',
      'rules': {
        'indent': [
          'error',
          2
        ]
      },
      'ignorePatterns': [],
      'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 2022
      }
    }
  }
  let p = file => join(projectPath, file)

  writeFile(p('package.json'), JSON.stringify(packageJson, null, 2))

  // Write the new Arc project manifest
  let arc = `@app\n${appName}\n\n@plugins\nenhance/arc-plugin-enhance\n\n@bundles\n@enhance-styles\n`
  writeFile(p('.arc'), arc)

  // Create starter app folders
  mkdirSync(p(`app${sep}pages`), { recursive: true })
  mkdirSync(p('public'), { recursive: true })

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
    writeFile(p(shortenPath(input)), data)
  })

  // Write .gitignore
  let gitIgnore = `.env
.DS_Store
node_modules
public/static.json
public/bundles
sam.json
sam.yaml
package-lock.json
`
  writeFile(p('.gitignore'), gitIgnore)

  // Need to install enhance/arc-plugin-enhance or 💥
  await initialInstall(params, projectPath)

  // Success message
  let cdPath = path === '.' ? '' : `cd ${path} && `
  console.error(`Project ${appName} successfully created! To get started run: ${c.bold(c.green(`${cdPath}begin dev`))}`)
}
