let { writeFileSync } = require('fs')
let { execSync } = require('child_process')
let { join } = require('path')
let { DEV_RELEASE, BUILD_ALL } = process.env
let os = process.platform

/**
 * Node versions: `node14`, `node16`, or latest
 * Platforms:     `alpine`, `linux`, `linuxstatic`, `win`, `macos`
 * Architectures: `x64`, `arm64`
 */
let config = {
  name: 'begin',
  bin: {
    cli: '../src/index.js'
  },
  pkg: {
    // Don't manually include runtimes/deno.js in scripts, as it fails on pkg#997
    scripts: [
      // Begin stuff
      '../src/commands/new/generators/**/*.js',
      // Arc stuff
      '../node_modules/@architect/inventory/**/*.js',
      '../node_modules/dynalite/**/*.js',
    ],
    assets: [
      '../node_modules/@architect/sandbox/src/invoke-lambda/runtimes/*',
      '../package.json',
    ],
    targets: [],
    outputPath: 'build',
  }
}

if (DEV_RELEASE) {
  let cmd = 'git rev-parse HEAD'
  let sha = execSync(cmd)
  let appVersion = `main-${sha.toString().substr(0, 7)}`
  let file = join(__dirname, '..', 'commit')
  writeFileSync(file, appVersion)
  config.bin.cli = '../src/_main.js'
  config.pkg.assets.push('../commit')
}

let nodeVer = `node14`
let arc = 'x64' // TODO: 'arm64'

let platforms = {
  linux: `${nodeVer}-linux-${arc}`,
  darwin: `${nodeVer}-macos-${arc}`,
  win32: `${nodeVer}-win-${arc}`,
}

if (BUILD_ALL === 'true') {
  config.pkg.targets.push(
    platforms.linux,
    platforms.darwin,
    platforms.win32,
  )
}
else {
  let p = str => os.startsWith(str) ? platforms[str] : undefined
  config.pkg.targets = [
    p('linux'),
    p('darwin'),
    p('win32')
  ].filter(Boolean)
}

let path = join(__dirname, 'package.json')
writeFileSync(path, JSON.stringify(config, null, 2))
