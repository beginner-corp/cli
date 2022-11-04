let arm64 = 'http://localhost:3333/file-arm64.zip'
let x64 = 'http://localhost:3333/file-x64.zip'
let releases = {
  darwin: { arm64, x64 },
  linux: { x64 },
  win32: { x64 },
}
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
