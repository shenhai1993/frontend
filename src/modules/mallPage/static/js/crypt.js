'use strict'

import CryptoJS from 'crypto-js'

const CryptoData = {
  encrypt (data) {
    const hashKey = '1234567890654321'
    const ivKey = '1234567890123456'
    let hash = CryptoJS.enc.Latin1.parse(hashKey)
    let iv = CryptoJS.enc.Latin1.parse(ivKey)
    let hash1 = CryptoJS.AES.encrypt(data, hash, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString()
    return hash1
  },
  decrypt (data) {
    const hashKey = '1234567890abc'
    const ivKey = '0987654321abc'
    let hash = CryptoJS.enc.Latin1.parse(hashKey)
    let iv = CryptoJS.enc.Latin1.parse(ivKey)
    return JSON.parse(CryptoJS.AES.decrypt(data, hash, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString(CryptoJS.enc.Utf8))
  }
}

export {
  CryptoData
}
