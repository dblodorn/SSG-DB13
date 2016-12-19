// VARIABLES
import configVars from '../_vars.json'
// VENDOR
import utility from './_app/utilities'
// RUN CONFIG
let initApp = () => {
  console.log('YO!')
  alert(configVars.img_path.hero)
}
// RUN APP
document.addEventListener('DOMContentLoaded', initApp)