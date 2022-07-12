let { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')
let { isAbsolute, join, normalize, dirname } = require('path')

/** helper to safely write */
function writes (filePath, body) {
  let fileDir = dirname(filePath) 
  if (!existsSync(fileDir)) {
    mkdirSync(fileDir, { recursive: true });
  } 
  if (!existsSync(filePath)) {
    writeFileSync(filePath, body)
  } 
}

module.exports = {
  name: 'project',
  description: 'Initialize a new project',
  action: async function ({ args, inventory }) {

    // ensure _ === ['project', 'new']
    if (args._.length > 2) {
      return Error('Unknown params: ' + args._.slice(2, args._.length).join(','))
    }

    // check for existing manifest in current directory
    if (inventory.inv._project.manifest) {
      return Error('Existing Begin app already found in this directory')
    }

    // ensure --path
    let path = args.path || args.p 
    if (!path) 
      return Error('Missing --path flag is required')

    // valid name (optional)
    let looseName = /^[a-z][a-zA-Z0-9-_]+$/
    let name = args.n || args.name ? args.n || args.name  : 'begin-app'
    if (!looseName.test(name)) {
      return Error('name invalid')
    }

    // load paths
    let pathToCatchAll = join(__dirname, '_catchall.mjs')
    let pathToHead = join(__dirname, '_head.mjs')
    let pathToElements = join(__dirname, '_elements.mjs')
    let pathToIndex = join(__dirname, '_index.mjs')
    let pathToAbout = join(__dirname, '_about.mjs')
    let pathToFourOhFour = join(__dirname, '_404.mjs')
    let pathToFiveHundred = join(__dirname, '_500.mjs')
    let pathToHeader = join(__dirname, '_header.mjs')
    let pathToFooter = join(__dirname, '_footer.mjs')
    let pathToFavicon = join(__dirname, '_favicon.svg')
    let pathToPkg = join(__dirname, '_pkg.json')
    let pathToIgnore = join(__dirname, '_ignore.txt')
   
    // load code strings
    let catchAll = readFileSync(pathToCatchAll).toString()
    let head = readFileSync(pathToHead).toString()
    let elements = readFileSync(pathToElements).toString()
    let index = readFileSync(pathToIndex).toString()
    let about = readFileSync(pathToAbout).toString()
    let fourOhFour = readFileSync(pathToFourOhFour).toString()
    let fiveHundred = readFileSync(pathToFiveHundred).toString()
    let header = readFileSync(pathToHeader).toString()
    let footer = readFileSync(pathToFooter).toString()
    let favicon = readFileSync(pathToFavicon).toString()
    let pkg = readFileSync(pathToPkg).toString()
    let ignore = readFileSync(pathToIgnore).toString()

    // this is not clever nor should it be
    let manifest = {
      '.begin/http/any-catchall/index.mjs': catchAll,
      'app/head.mjs': head,
      'app/elements.mjs': elements,
      'app/pages/index.mjs': index,
      'app/pages/about.mjs': about,
      'app/pages/404.mjs': fourOhFour,
      'app/pages/500.mjs': fiveHundred,
      'app/elements/header.mjs': header,
      'app/elements/footer.mjs': footer,
      'public/favicon.svg': favicon,
      'package.json': pkg,
      '.gitignore': ignore,
      '.arc': `@app
${ name }

@static
fingerprint true

@views
src app

@http
/*
  method any
  src .begin/http/any-catchall

@plugins
architect/plugin-bundles

@bundles
store 'node_modules/@enhance/store'`
    }

    for (let filePath of Object.keys(manifest)) {
      let fullPath = join(process.cwd(), path, filePath)
      writes(fullPath, manifest[filePath])
    }

    console.log('successfully created new project: ' + name)
    console.log('full path to new project: ' + join(process.cwd(), path))
    console.log('to work locally `cd ' + path + ' && npm install && npm start`')
  },
  help: function (params) {
    return {
      en: {
        contents: {
          header: 'New project parameters',
          items: [
            {
              name: '-n, --name',
              description: 'Project name, must be: [a-z0-9-_]',
              optional: true,
            },
            {
              name: '-r, --runtime',
              description: `Runtime, one of: ${backtickify(runtimes)}`,
              optional: true,
            },
            {
              name: '-p, --path',
              description: `Path to the new project`,
              optional: false,
            }
          ]
        },
        examples: [
          {
            name: 'Create a new project (runs Node.js by default)',
            example: 'begin new project',
          },
          {
            name: 'Create a new project with name',
            example: 'begin new project -n my-app',
          },
        ]
      },
    }
  }
}
