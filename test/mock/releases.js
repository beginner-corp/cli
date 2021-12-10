// TODO arm64 support!
let rel = { x64: 'http://localhost:3333/file.zip' }
let releases = { darwin: rel, linux: rel, win32: rel }
module.exports = function (version) {
  return {
    cli: {
      latest: {
        releases,
        version,
      },
      main: {
        releases,
        version,
      },
    }
  }
}
