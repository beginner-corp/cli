// Handle special pkg-specific error states
module.exports = function errorCheck (err) {
  if (!process.pkg) return err

  // ESM plugins were used, which pkg does not yet support (vercel/pkg#1291)
  let invalidHost = 'Invalid host defined options'
  if (err.message.includes(invalidHost)) {
    let txt = 'ESM plugins not yet supported in Begin; for more information please see https://github.com/vercel/pkg/issues/1291'
    let msg = err.message.replace(invalidHost, txt)
    return Error(msg)
  }

  return err
}
