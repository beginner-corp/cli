module.exports = function () {
  const c = require('@colors/colors/safe')

  const name = c.bold

  const formatter = {
    name,
    dim: c.dim,
    bold: c.bold,
    italic: c.italic,
    underline: c.underline,
    link: c.underline.blue,
    ID: (id) => c.dim(`<${id}>`),
    date: (date) => new Date(date).toLocaleString(),
    app: {
      name: name.green,
    },
    env: {
      name: (n) => {
        return `"${n === 'production' ? name(n) : n}"`
      },
      location: c.dim,
    },
    domain: {
      managed: c.underline.green,
      external: c.underline.cyan,
    },
    c,
  }

  formatter.e = formatter.env
  formatter.a = formatter.app
  formatter.d = formatter.domain

  return formatter
}
