module.exports = function () {
  return `
<page-container>
  <main>
    <h1 class="mb1 font-semibold text3">Signup Page</h1>
    <form-element action="/auth/signup" method="post">
  <p>Register with your Email</p>
    <text-input label="Email" id="email" name="email"  type="email"></text-input>
</form-element>
</main>
</page-container>
`
}
