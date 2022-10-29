let test = require('tape')
let { join } = require('path')
let minimist = require('minimist')
let sut = join(process.cwd(), 'src', 'commands')
let commands = require(sut)

let lang = 'en'
let printed = []
let printer = r => printed.push(r)
printer.verbose = () => {}
printer.debug = () => {}
let getArgs = s => minimist([ ...s.split(' ').filter(Boolean) ])
let reset = () => printed = []

test('Set up env', t => {
  t.plan(1)
  t.ok(commands, 'Commands module is present')
})

test('Run help by default', async t => {
  t.plan(1)
  let args = getArgs('')
  await commands({ args, lang, printer })
  t.ok(printed[0].includes('begin help'), 'Ran help')
  t.teardown(reset)
})

test('Run a simple command (help)', async t => {
  t.plan(1)
  let args = getArgs('help')
  await commands({ args, lang, printer })
  t.ok(printed[0].includes('begin help'), 'Ran help')
  t.teardown(reset)
})

test('Do not print help in JSON mode', async t => {
  t.plan(1)
  let args = getArgs('--json')
  await commands({ args, lang, printer })
  t.notOk(printed.length, 'Did not print')
  t.teardown(reset)
})

test('Run a command alias (version: ver)', async t => {
  t.plan(1)
  let appVersion = 'some-version'
  let args = getArgs('ver')
  await commands({ args, lang, printer, appVersion })
  t.equal(printed[0].string, `Begin ${appVersion}`, 'Ran command from alias')
  t.teardown(reset)
})

test('Show help on a known command', async t => {
  t.plan(1)
  let args = getArgs('help update')
  await commands({ args, lang, printer })
  t.ok(printed[0].includes('begin update'), 'Ran help')
  t.teardown(reset)
})

test('Show help on a known subcommand', async t => {
  t.plan(1)
  let args = getArgs('new help')
  await commands({ args, lang, printer })
  t.ok(printed[0].includes('begin new'), 'Ran help')
  t.teardown(reset)
})

test('Show help on an unknown command', async t => {
  t.plan(3)
  let bad = 'trolololo'
  let args = getArgs(bad)
  await commands({ args, lang, printer })
  t.ok(printed[0] instanceof Error, 'Printed an error')
  t.ok(printed[0].message.includes(bad), 'Got error about unknown command')
  t.ok(printed[1].includes('begin help'), 'Got begin help')
  t.teardown(reset)
})

test('Show command help on an invalid subcommand', async t => {
  t.plan(2)
  let args = getArgs('generate')
  await commands({ args, lang, printer })
  t.ok(printed[0] instanceof Error, 'Printed an error')
  t.ok(printed[1].includes('begin generate'), 'Got command help')
  t.teardown(reset)
})

test('Bubble unknown errors', async t => {
  t.plan(1)
  let args = getArgs(`ver`)
  let msg = 'oh noes'
  // t.throws doesn't seem to work in this case, nor t.rejects, idk so just try/catch
  try {
    // Generally we'd want the command to blow up and not printer, but as long as something blows up that should be ok for the purposes of this test
    let _printer = () => {
      throw Error(msg)
    }
    _printer.verbose = () => {}
    _printer.debug = _printer.verbose
    await commands({ args, lang, printer: _printer })
  }
  catch (err) {
    t.equal(err.message, msg, 'Threw unknown error')
  }
  t.teardown(reset)
})
