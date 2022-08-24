module.exports = function () {
  return `<form action="/auth/login" method="post">
  <label>Email to send magic link to
    <input name="email" type="email"/>
  </label>
</form>`
}
