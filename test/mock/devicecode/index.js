exports.handler = async () => {
  let sandboxConfig = JSON.parse(process.env.ARC_SANDBOX)
  let { http: port } = sandboxConfig.ports
  return {
    device_code: 'foo',
    user_code: 'bar',
    verification_uri: `http://localhost:${port}/auth?user_code=bar`,
  }
}
