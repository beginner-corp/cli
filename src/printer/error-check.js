// Handle special pkg-specific error states
module.exports = function errorCheck (err) {
  if (!process.pkg) return err

  // ESM plugins were used, which pkg does not yet support (vercel/pkg#1291)
  let invalidHost = 'Invalid host defined options'
  if (err.message.includes(invalidHost)) {
    let msg = err.message.replace(invalidHost, 'ESM plugins not yet supported')
    return Error(msg)
  }

  return err
}
