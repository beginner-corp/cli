exports.handler = async () => ({
  device_code: 'foo',
  user_code: 'bar',
  verification_uri: 'http://localhost:3333/auth?user_code=bar',
})
