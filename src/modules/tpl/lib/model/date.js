'use strict'

// let now = new Date()
let dates = new Date()
let seperator1 = '/'
let year = dates.getFullYear()
let month = dates.getMonth() + 1
let strDate = dates.getDate()
if (month >= 1 && month <= 9) {
  month = '0' + month
}
if (strDate >= 0 && strDate <= 9) {
  strDate = '0' + strDate
}
let currentdate = year + seperator1 + month + seperator1 + strDate

export const date = {
  type: 'date',
  text: currentdate,
  dragable: true,
  resizable: true,
  width: 290,
  height: 70,
  index: 100,
  file: false,
  color: '#FFFFFF',
  background: '#303133',
  fontsize: 35
}
