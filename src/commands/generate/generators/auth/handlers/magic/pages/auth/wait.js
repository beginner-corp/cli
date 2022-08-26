module.exports = function () {
  return `export default function ({ html, state }) {
  return html\`
    <html>
    <body>
      <h1>Wait here</h1><p>Do not close this page.</p>
      <main></main>
      <noscript>
        <p>Click <a href='\${\`/auth/wait?magic=\${encodeURIComponent(state.store.magicQueryId)}\`}' style="color:blue;">Here</a> after you verify your magic link</p>
      </noscript>
      <script>
        window.WS_URL = '\${state?.store?.wsUrl}'
        window.magicQueryId = '\${state?.store?.magicQueryId}'
      </script>
      <script type=module src=\${state?.store?.wsScriptUrl}></script>
    </body>
</html>\`
}
`
}
