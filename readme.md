# Begin CLI

[![GitHub CI status](https://github.com/beginner-corp/cli/workflows/Node%20CI/badge.svg)](https://github.com/beginner-corp/cli/actions?query=workflow%3A%22Node+CI%22)


## Installing

Install the Begin CLI by opening your terminal and entering the following command:

- Mac, Linux: `curl -sS https://dl.begin.com/install.sh | sh`
  - Then follow the printed instructions to add Begin to your `$PATH`.
- Windows: `iwr https://dl.begin.com/install.ps1 -useb | iex`

By default Begin installs to `~/.begin/` (Mac, Linux) / `$Home\.begin\` (Windows). You can specify a custom directory to install to by using the `BEGIN_INSTALL` environment variable:

- Mac, Linux: `BEGIN_INSTALL=/whatever/path/here curl -sS https://dl.begin.com/install.sh | sh`
- Windows: `$env:BEGIN_INSTALL="c:\whatever\path\here"; iwr https://dl.begin.com/install.ps1 -useb | iex`

Alternatively, you can install Begin with npm: `npm i -g @begin/cli`.


## Usage

> Note for Windows users: `begin` is a reserved word in PowerShell, so in Windows Begin is `b.exe`. Any documented references to running `begin` should be interpreted as running `b` in Windows.

- Run `begin` to see your list of available commands
- Get help:
  - Providing no argument (or unknown arguments) will print help; help should never be hard to get!
  - Additionally, providing the argument `help` *anywhere* in your command will *always* display relevant help (like `-h` or `--help` flags); for example:
    - `begin dev help` is equivalent to `begin help dev` or `begin dev -h`
- Disable colorized output with the `--no-color` flag, or with the following env vars: `BEGIN_NO_COLOR`, `NO_COLOR`, or by setting `TERM` to `dumb`
  - Output is automatically de-colorized in JSON mode (`--json`)


## JSON output

Setting the `--json` flag sets the output mode to JSON, intended for use with modern JSON-based workflows using tools like `jq`.

As such, **final JSON output is always sent to `stdout`**, even in the event of an error. Additionally, all ANSI colorization is automatically stripped from JSON output.


### JSON schema

Successful execution:

- `ok` (boolean): always `true`
- `message` (string): always be present, but may be empty (`""`)
- Other properties: individual commands may provide their own properties; for example: `begin version` will output `begin` (executable path) and `version` (semver string) properties)

Unsuccessful execution

- `ok` (boolean): always `false`
- `error` (string): message of the error
- `stack` (string): stack trace of the error; only present if `--debug` flag is set


## CLI release channels

Begin has two release channels:

- `latest` (default) - well-hardened production releases following [semver](https://semver.org/)
- `main` - the newest stuff (on the `main` branch, hence the name), not yet released to production

To switch to `main` from `latest`, run: `begin update --use main`.

Similarly, to switch back to `latest` from `main`, run: `begin update --use latest`.


## Tidbits

Wherever possible, the Begin CLI adheres to the [Command Line Interface Guidelines](https://clig.dev/).

Begin is `async/await` / `Promises`-based, and uses `pkg` for binary compilation. It is currently CommonJS, with plans to [eventually refactor to ESM](https://github.com/vercel/pkg/issues/1291).

Begin is written in idiomatic JavaScript with a key exception: each command's specific `require()` statements are in local scope, not global. This is specifically and deliberately done to [reduce the coldstart time and ensure every execution runs as fast as possible](https://github.com/beginner-corp/cli/discussions/4).
