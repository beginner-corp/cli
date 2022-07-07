let copy = {
  en: {
    hello: 'Hello, Beginner!',
    get_started: 'Get started by editing this file at:',
    view_docs: 'View documentation at:',
  }
}

function html (lang, handlerFile) {
  return /* html */`
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Begin app!</title>
  <style>
    * { box-sizing: border-box; } body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; } max-width-320 { max-width: 20rem; } margin-left-8 { margin-left: 0.5rem; } margin-bottom-16 { margin-bottom: 1rem; } margin-bottom-8 { margin-bottom: 0.5rem; } padding-32 { padding: 2rem; } color-grey { color: #333; } color-black-link:hover { color: black; }
  </style>
</head>
<body class="padding-32">
  <div class="max-width-320">
    <div class="margin-left-8">
      <div class="margin-bottom-16">
        <h1 class="margin-bottom-16">
          ${copy[lang].hello}
        </h1>
        <p class="margin-bottom-8">
          ${copy[lang].get_started}
        </p>
        <code>
          ${handlerFile}
        </code>
      </div>
      <div>
        <p class="margin-bottom-8">
          ${copy[lang].view_docs}
        </p>
        <code>
          <a class="color-grey color-black-link" href="https://docs.begin.com">https://docs.begin.com</a>
        </code>
      </div>
    </div>
  </div>
</body>
</html>
`
}

let deno = (lang, handlerFile) => `export async function handler (event: object) {
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: \`${html(lang, handlerFile)}\`
  };
}`

let node = (lang, handlerFile) => `export async function handler (req) {
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: \`${html(lang, handlerFile)}\`
  }
}`

let ruby = (lang, handlerFile) => `def handler(req)
  {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    body: %q(${html(lang, handlerFile)})
  }
end`

let python = (lang, handlerFile) => `def handler(req, context):
  return {
    'statusCode': 200,
    'headers': {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    'body': """${html(lang, handlerFile)}"""
  }`

module.exports = { node, deno, ruby, python }
