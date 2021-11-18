let errors = {
  en: {
    found_file: str => `File already exists: ${str}`,
  }
}

module.exports = function error (lang, err, meta) {
  process.exitCode = 1
  return meta ? errors[lang][err](meta) : errors[lang][err]
}
