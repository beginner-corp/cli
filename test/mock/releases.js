module.exports = function (version) {
  let sandboxConfig = JSON.parse(process.env.ARC_SANDBOX)
  let { http: port } = sandboxConfig.ports
  let arm64 = `http://localhost:${port}/file-arm64.zip`
  let x64 = `http://localhost:${port}/file-x64.zip`
  let releases = {
    darwin: { arm64, x64 },
    linux: { x64 },
    win32: { x64 },
  }
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
