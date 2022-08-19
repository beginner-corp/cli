module.exports = function () {
  return `export default function({html,state}) {
    const user = state?.store?.account
    return html\`<p> Hello \${ user?.name }</p>\`
  }`
}
