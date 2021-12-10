let test = require('tape')
let { join } = require('path')
let lib = join(process.cwd(), 'test', 'lib')
let { begin: _begin, run } = require(lib)

test('Run version tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Version / ${runType}]`
  let begin = _begin[runType].bind({}, t)

  t.test(`${mode} Normal`, async t => {
    t.plan(7)
    let ver = /^Begin \d+\.\d+\.\d+$/
    let r

    r = await begin('version')
    t.match(r.stdout, ver, 'Got version')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 0, 'Exited 0')

    r = await begin('ver')
    t.match(r.stdout, ver, 'Got version')
    t.notOk(r.stderr, 'Did not print to stderr')

    r = await begin('v')
    t.match(r.stdout, ver, 'Got version')
    t.notOk(r.stderr, 'Did not print to stderr')
  })

  t.test(`${mode} JSON`, async t => {
    t.plan(10)
    let ver = /^\d+\.\d+\.\d+$/
    let r, json

    r = await begin('version --json')
    json = JSON.parse(r.stdout)
    t.ok(json.begin, `Got a value for Begin exe path: ${json.begin}`)
    t.match(json.version, ver, 'Got version')
    t.notOk(r.stderr, 'Did not print to stderr')
    t.equal(r.status, 0, 'Exited 0')

    r = await begin('ver --json')
    json = JSON.parse(r.stdout)
    t.ok(json.begin, `Got a value for Begin exe path: ${json.begin}`)
    t.match(json.version, ver, 'Got version')
    t.notOk(r.stderr, 'Did not print to stderr')

    r = await begin('v --json')
    json = JSON.parse(r.stdout)
    t.ok(json.begin, `Got a value for Begin exe path: ${json.begin}`)
    t.match(json.version, ver, 'Got version')
    t.notOk(r.stderr, 'Did not print to stderr')
  })
}
