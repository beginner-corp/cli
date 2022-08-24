module.exports = function () {
  return `// get the web socket url from the backend
let url = window.WS_URL
let magicQueryId = window.magicQueryId

let main = document.getElementsByTagName('main')[0]

// setup the web socket
let ws = new WebSocket(url)
ws.onopen = open
ws.onclose = close
ws.onmessage = verify
ws.onerror = console.log

setTimeout(() => ws.send(JSON.stringify({ magicQueryId }) ), 1000)

// connect to the web socket
function open () {
  let ts = new Date(Date.now()).toISOString()
  main.innerHTML = '<p> waiting...</p> '
}

// report a closed web socket connection
function close () {
  // TODO: reload or add message to manually reload page after link is verified
}

function verify (e) {
  let msg = JSON.parse(e.data)
  if (msg.verified) {
    setTimeout(() => location.reload(), 1000)
  }
}
`
}
