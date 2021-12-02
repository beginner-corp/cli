let { join, sep } = require('path')
let test = require('tape')
let { sync: rm } = require('rimraf')
let { readFileSync } = require('fs')
let sut = join(process.cwd(), 'src', 'lib')
let lib = require(sut)

test('Set up env', t => {
  t.plan(1)
  t.ok(lib, 'Arc mutator is present')
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

test('backtickify', t => {
  t.plan(1)
  let { backtickify } = lib
  let list = [ 'ok', 'whatever' ]
  let target = '`ok`, `whatever`'
  let result = backtickify(list)
  t.equal(result, target, 'Backtified that list')
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
