let names = { en: [ 'update', 'upgrade' ] }
let help = require('./help')

async function action (params) {
  let { appVersion, args } = params
  let { BEGIN_INSTALL } = process.env
  let plat = process.platform
  let isWin = plat.startsWith('win')

  let _http = require('http')
  let _https = require('https')
  let { join } = require('path')
  let { chmodSync, mkdirSync, writeFileSync } = require('fs')
  let semver = require('semver')
  let zip = require('adm-zip')

  let { homedir } = require('os')
  // TODO: add process.arch checks for arm64

  let versions = await getVersions()
  return new Promise((resolve, reject) => {
    let channel = appVersion.startsWith('main') ? 'main' : 'latest'
    // Allow CLI override
    if (args.use === 'main') channel = 'main'
    if (args.use === 'latest') channel = 'latest'

    let platform = plat === 'darwin' && 'darwin' ||
                   plat === 'linux' && 'linux' ||
                   plat === 'win32' && 'win32'
    let release = versions.cli[channel]
    let version = release.version
    let url = release.releases[platform].x64 // TODO: check for arm64 here
    let https = url.startsWith('https://') ? _https : _http

    let doNotUpdate = (channel === 'main' && appVersion === version) ||
                      (channel === 'latest' && semver.gte(appVersion, version))
    if (doNotUpdate) {
      return resolve('Begin already running the latest version, nice!')
    }

    https.get(url, res => {
      let mib = i => Math.round((i / 1000 / 1000) * 100) / 100
      let downloadSize = res.headers['content-length'] || res.headers['Content-Length']
      let target = mib(downloadSize)
      console.error('Downloading', url, `(${target} MiB)`)

      let body = []
      let size = 0
      let chunks = 0
      let percent = () => Math.round((size / downloadSize) * 100)
      res.on('data', data => {
        body.push(data)
        size += data.length
        chunks++
        if (chunks % 100 === 0) {
          process.stderr.write(`Got ${mib(size)} MiB of ${target} MiB (${percent()}%)`)
          process.stderr.cursorTo(0)
        }
      })
      res.on('end', data => {
        if (data) body.push(data)
        body = Buffer.concat(body)
        process.stderr.write(`Got ${mib(body.length)} MiB of ${target} MiB (${percent()}%)\n`)

        let dest = join(homedir(), '.begin')
        if (BEGIN_INSTALL) {
          dest = BEGIN_INSTALL
          mkdirSync(dest, { recursive: true })
        }
        let exe = 0o755 // -rwxr-xr-x
        let Zip = new zip(body)
        for (let file of Zip.getEntries()) {
          let decompressed = Zip.readFile(file)
          let filename = join(dest, file.entryName)
          writeFileSync(filename, decompressed)
          if (!isWin) {
            chmodSync(filename, exe)
          }
          console.error(`Upgrading Begin to ${version}`)
          console.error(`Updated ${filename}`)
          resolve('Successfully upgraded Begin!')
        }
      })
      res.on('err', err => {
        err.message = `Upgrade failed, please try again`
        reject(err)
      })
    })
  })
}

async function getVersions () {
  let _http = require('http')
  let _https = require('https')
  let { __BEGIN_TEST_URL__ } = process.env
  return new Promise((resolve, reject) => {
    let url = __BEGIN_TEST_URL__
      ? __BEGIN_TEST_URL__
      : 'https://dl.begin.com/versions'
    let https = url.startsWith('https://') ? _https : _http
    console.error('Checking for latest version')
    let failed = 'Failed to check latest version'
    https.get(url, res => {
      let body = []
      res.on('data', data => {
        body.push(data)
      })
      res.on('end', data => {
        if (data) body.push(data)
        try {
          let versions = JSON.parse(Buffer.concat(body))
          resolve(versions)
        }
        catch (err) {
          err.message = failed
          reject(err)
        }
      })
      res.on('err', err => {
        err.message = failed
        reject(err)
      })
    })
  })
}

module.exports = {
  names,
  action,
  help,
}
