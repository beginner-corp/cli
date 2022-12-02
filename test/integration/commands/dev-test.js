let test = require('tape')
let { writeFileSync } = require('fs')
let { join } = require('path')
let tiny = require('tiny-json-http')
let lib = join(process.cwd(), 'test', 'lib')
let { newTmpFolder, run, start, shutdown } = require(lib)

let arc = `@app
hi

@http
/
  method get
  src .
`
let url

test('Run dev tests', async t => {
  await run(runTests, t)
  t.end()
})

async function runTests (runType, t) {
  let mode = `[Dev / ${runType}]`

  let newDevDir = 'dev'

  t.test(`${mode} Start Begin dev`, async t => {
    let cwd = newTmpFolder(t, newDevDir)
    let arcFile = join(cwd, 'app.arc')
    writeFileSync(arcFile, arc)

    let handlerFile = join(cwd, 'index.js')
    let handler = `exports.handler = async req => req`
    writeFileSync(handlerFile, handler)

    let port = await start[runType](t, cwd)
    url = `http://localhost:${port}`
  })

  t.test(`${mode} get /`, t => {
    t.plan(1)
    tiny.get({ url }, function _got (err, result) {
      if (err) t.fail(err)
      else t.equal(result.body.routeKey, 'GET /', 'Got root JSON response')
    })
  })

  t.test(`${mode} Error`, t => {
    t.plan(1)
    tiny.get({ url: url + '/lolidk' }, err => {
      if (err && err.statusCode === 403) t.pass('Got error for unknown endpoint')
      else t.fail('Expected an error')
    })
  })

  t.test(`${mode} Shut down Sandbox`, t => {
    shutdown(t)
  })
}
