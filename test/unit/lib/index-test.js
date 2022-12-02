let { join, sep } = require('path')
let test = require('tape')
let { sync: rm } = require('rimraf')
let { readFileSync, rmSync, writeFileSync } = require('fs')
let cwd = process.cwd()
let testLib = join(cwd, 'test', 'lib')
let { newTmpFolder } = require(testLib)
let sut = join(cwd, 'src', 'lib')
let lib = require(sut)
let reset = folder => rmSync(folder, { recursive: true, force: true })

test('Set up env', t => {
  t.plan(1)
  t.ok(lib, 'Arc mutator is present')
})

test('backtickify', t => {
  t.plan(1)
  let { backtickify } = lib
  let list = [ 'ok', 'whatever' ]
  let target = '`ok`, `whatever`'
  let result = backtickify(list)
  t.equal(result, target, 'Backtified that list')
})

test('getConfig', t => {
  t.plan(9)
  let { getConfig } = lib
  let cliDir, config, token
  let _refresh = true
  let printer = () => {}
  printer.debug = () => {}

  cliDir = newTmpFolder(t, 'getConfig')

  // Control
  config = getConfig({ cliDir, _refresh, printer })
  t.deepEqual(config, {}, 'Got empty config')

  // Env var token population
  token = 'env-token'
  process.env.BEGIN_TOKEN = token
  config = getConfig({ cliDir, _refresh, printer })
  t.equal(config.access_token, token, 'Got correct access_token')
  t.equal(config.stagingAPI, undefined, 'stagingAPI property is undefined')

  process.env.BEGIN_STAGING_API = true
  config = getConfig({ cliDir, _refresh, printer })
  t.equal(config.access_token, token, 'Got correct access_token')
  t.equal(config.stagingAPI, true, 'Got stagingAPI property')

  // Config file
  // Note: we haven't (yet) destroyed the above env vars, so successfully running the tests below infers the intended behavior that the presence of a config file wins over env vars
  token = 'file-token'
  let configJson = join(cliDir, 'config.json')

  writeFileSync(configJson, JSON.stringify({ access_token: token }))
  config = getConfig({ cliDir, _refresh, printer })
  t.equal(config.access_token, token, 'Got correct access_token')
  t.equal(config.stagingAPI, undefined, 'stagingAPI property is undefined')

  writeFileSync(configJson, JSON.stringify({ access_token: token, stagingAPI: true }))
  config = getConfig({ cliDir, _refresh, printer })
  t.equal(config.access_token, token, 'Got correct access_token')
  t.equal(config.stagingAPI, true, 'Got stagingAPI property')

  delete process.env.BEGIN_TOKEN
  delete process.env.BEGIN_STAGING_API
  reset(cliDir)
})

test('getRelativeCwd', t => {
  t.plan(3)
  let { getRelativeCwd } = lib
  let result
  let target = `foo${sep}bar`
  result = getRelativeCwd(join(process.cwd(), target))
  t.equal(result, target, 'Got relative working dir')
  result = getRelativeCwd(sep + target)
  t.equal(result, target, 'Got relative working dir')
  result = getRelativeCwd(target)
  t.equal(result, target, 'Got relative working dir')
})

test('writeFile', t => {
  t.plan(4)

  let path, result
  let { writeFile } = lib
  let printer = { verbose: () => {} }
  let write = writeFile({ lang: 'en', printer })
  let contents = 'henlo\n'

  path = join(process.cwd(), 'test', 'tmp', 'hi.txt')
  write(path, contents)
  result = readFileSync(path).toString()
  t.equal(result, contents, 'Created wrote file to tmp (absolute path)')
  rm(join('test', 'tmp'))

  path = join('test', 'tmp', 'hi.txt')
  write(path, contents)
  result = readFileSync(path).toString()
  t.equal(result, contents, 'Created wrote file to tmp (relative path)')
  rm(join('test', 'tmp'))

  path = join('test', 'tmp', 'nested', 'hi.txt')
  write(path, contents)
  result = readFileSync(path).toString()
  t.equal(result, contents, 'Created wrote file to tmp, created subdir (relative path)')

  let update = 'an update\n'
  path = join('test', 'tmp', 'nested', 'hi.txt')
  write(path, update)
  result = readFileSync(path).toString()
  t.equal(result, update, 'Updated an existing file (relative path)')
  rm(join('test', 'tmp'))
})
