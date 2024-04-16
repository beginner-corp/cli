let test = require('tape')
let { begin: _begin } = require('../../lib')


test('Run update tests', async t => {
  let mode = `[Update]`
  let begin = _begin.bind({}, t)

  let notice = 'Use npm to update the Begin CLI'

  t.test(`${mode} "use npm"`, async t => {
    t.plan(2)
    const r = await begin('update')
    t.ok(r.stdout.includes(notice), 'Got upgrade confirmation')
    t.equal(r.code, 0, 'Exited 0')
  })
})
