module.exports = function () {
  return `<page-container>
  <main>
    <h1 class="mb1 font-semibold text3">Login page</h1>
    <form-element action="/auth/login" method="post">
  <p>Login with your Email</p>
    <text-input label="Email" id="email" name="email"  type="email"></text-input>
</form-element>
</main>
</page-container>
`
}
