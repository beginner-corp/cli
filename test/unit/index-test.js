let test = require('tape')
let { join } = require('path')
let sut = join(process.cwd())
let begin = require(sut)

test('Set up env', t => {
  t.plan(1)
  t.ok(begin, 'Begin entry is present')
})
