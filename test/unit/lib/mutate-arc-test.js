let { join } = require('path')
let test = require('tape')
let sut = join(process.cwd(), 'src', 'lib', 'mutate-arc')
let mutateArc = require(sut)

test('Set up env', t => {
  t.plan(1)
  t.ok(mutateArc, 'Arc mutator is present')
})

test('Item insert (array)', t => {
  t.plan(1)
  let before = `
@http
get /a    # a comment

@events
an-event


# comment
`
  let after = `
@http
get /a    # a comment
get /b

@events
an-event


# comment
`
  let item = 'get /b'
  let pragma = 'http'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Inserted item into correct pragma, preserved comments + newlines')
})

test('Item insert (map)', t => {
  t.plan(1)
  let before = `
@http
get /a    # a comment


# comment
`
  let after = `
@http
get /a    # a comment
/b
  method get
  src foo


# comment
`
  let item = '/b\n  method get\n  src foo'
  let pragma = 'http'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Inserted item into correct pragma, preserved comments + newlines')
})

test('Item insert (vector)', t => {
  t.plan(1)
  let before = `
@idk
something
  a
  b

# comment
`
  let after = `
@idk
something
  a
  b
something-else
  b
  c

# comment
`
  let item = 'something-else\n  b\n  c'
  let pragma = 'idk'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Inserted item into correct pragma, preserved comments + newlines')
})

test('Item insert (scalar)', t => {
  t.plan(1)
  let before = `
@events
an-event


# comment
`
  let after = `
@events
an-event
another-event


# comment
`
  let item = 'another-event'
  let pragma = 'events'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Inserted item into correct pragma, preserved comments + newlines')
})

test('Pragma insert (array)', t => {
  t.plan(1)
  let before = `
@events
an-event


# comment
`
  let after = `
@events
an-event


# comment

@http
get /a
`
  let item = 'get /a'
  let pragma = 'http'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Inserted missing pragma, preserved comments + newlines')
})

test('Updateable item insert', t => {
  t.plan(1)
  let before = `
@arc
a setting
`
  let after = `
@arc
a setting
another setting
`
  let item = 'another setting'
  let pragma = 'arc'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Inserted item value')
})

test('Item update (simple)', t => {
  t.plan(1)
  let before = `
@arc
setting 1
`
  let after = `
@arc
setting 2
`
  let item = 'setting 2'
  let pragma = 'arc'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Updated item value')
})

test('Item update (complex / vector)', t => {
  t.plan(1)
  let before = `
@arc
setting
  1
`
  let after = `
@arc
setting
  2
`
  let item = 'setting\n  2'
  let pragma = 'arc'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Updated item value')
})

test('Item update (complex / map)', t => {
  t.plan(1)
  let before = `
@arc
setting
  a b
`
  let after = `
@arc
setting
  b c
`
  let item = 'setting\n  b c'
  let pragma = 'arc'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Updated item value')
})

test('Item update (weird)', t => {
  t.plan(1)
  let before = `
@arc
setting 1
`
  let item = '123'
  let pragma = 'arc'
  t.throws(() => {
    mutateArc.upsert({ item, pragma, raw: before })
  }, '!array/vector/map type blows up in @aws/arc')
})

test('Item update (quotes)', t => {
  t.plan(1)
  let before = `@bundles
store "node_modules/@enhance/store"
`
  const after = `@bundles
store "node_modules/@enhance/store"

@begin
appID WHSTS9PT
`

  let item = 'appID WHSTS9PT'
  let pragma = 'begin'
  let result = mutateArc.upsert({ item, pragma, raw: before })
  t.equal(result, after, 'Mutated arc file with quoted bundle line')
})
