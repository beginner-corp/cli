let test = require('tape')
let { join } = require('path')
let tiny = require('tiny-json-http')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, newTmpFolder, run, start, shutdown } = require(lib)

test('Run new tests (slow)', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[New / ${runType} (slow)]`
  let begin = _begin[runType].bind({}, t)

  let newAppDir = 'new'
  let installing = /Installing dependencies/
  // let appFound = /Existing Begin app already found in this directory/
  let url, cwd

  t.test(`${mode} new - normal, with live npm install`, async t => {
    t.plan(3)
    process.env.__SLOW__ = true
    cwd = newTmpFolder(t, newAppDir)
    let r = await begin('new', cwd)
    t.notOk(r.stdout, 'Did not print to stdout')
    t.match(r.stderr, installing, 'Printed dep installation message to stderr')
    t.equal(r.code, 0, 'Exited 0')
  })

  t.test(`${mode} Start Begin dev`, async t => {
    let port = await start[runType](t, cwd)
    url = `http://localhost:${port}`
  })

  t.test(`${mode} Check for valid starter project response`, t => {
    t.plan(1)
    tiny.get({ url }, function _got (err, result) {
      if (err) t.fail(err)
      else t.ok(result.body.includes('https://enhance.dev'), 'Got valid Enhance starter project response')
    })
  })

  t.test(`${mode} Shut down Sandbox`, t => {
    delete process.env.__SLOW__
    shutdown(t)
  })
}
