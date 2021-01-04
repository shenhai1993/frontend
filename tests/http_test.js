const http = require('../static/js/utils/client')

http.post('login').then(res => console.log(res)).catch(e => console.log(e))
