if (!!window.ActiveXObject || 'ActiveXObject' in window) {
  document.querySelector('#app').innerHTML = require('./browser.html')
} else {
  let fn = require('./main').default
  fn.fn()
}
