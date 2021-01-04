'use strict'

import SparkMD5 from 'spark-md5'

class liteMd5 {
  // MD5 () {}

  async md5 (file) {
    let md5 = ''
    if (file.size < 1048576) { // 1024 * 1024
      md5 = await this.md5File(file)
    } else {
      md5 = await this.md5Part(file)
    }

    return md5
  }

  async md5File (file) {
    let pps = [{
      start: 0,
      end: file.size
    }]
    let md5 = await this._md5(file, pps)
    return md5
  }

  async md5Part (file) {
    let pps = [{
      start: 0,
      end: 2012
    }, {
      start: file.size / 2 - 1999,
      end: file.size / 2
    }, {
      start: file.size - 2010,
      end: file.size
    }]
    let md5 = await this._md5(file, pps)
    return md5
  }

  _md5 (file, pps) {
    return new Promise((resolve, reject) => {
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice

      let currendpps = 0
      let sp = new SparkMD5.ArrayBuffer()

      let fileReader = new FileReader()
      fileReader.onload = (e) => {
        sp.append(e.target.result)
        currendpps++
        if (currendpps === pps.length) {
          let ret = sp.end()
          return resolve(ret)
        } else {
          loadNext()
        }
      }

      fileReader.onerror = () => {
        console.warn('oops, something went wrong.')
      }

      function loadNext () {
        let p = pps[currendpps]
        fileReader.readAsArrayBuffer(blobSlice.call(file, p.start, p.end))
      }

      loadNext()
    })
  }
}

export default liteMd5
