import events from 'events'
import http from '../../../../../static/js/utils/http'

class fileUploader extends events.EventEmitter {
  constructor (md5) {
    super()
    this.md5 = md5
  }

  async uploadFiles (files) {
    for (let i = 0; i < files.length; i++) {
      await this._upload(files[i], i) // improve me! browser support 3 ajax request at one time
    }

    this.emit('allfileuploaded', files.length)
  }

  async upload (file, index) {
    await this._upload(file, index)
  }

  async _upload (file, index) {
    this.emit('currentUploadFile', { 'file': file, 'index': index })

    // check md5 is or not exists on server side
    let res = await this.check(file)
    if (!res.id) { // file not exists
      await this._uploadone(file, index)
    } else { // file exists
      if (res.uploadhit) {
        this.emit('fileexists', res, index, file)
      } else {
        this.emit('nameexists', res, index, file)
      }
    }
  }

  // 判断文件在服务器端是否存在
  async check (file) {
    let _md5 = await this.md5.md5(file)

    let res = await http.get('elements', { 'group_id': 1, 'name': file.name, 'md5': _md5 })

    return res.data
  }

  // 文件上传
  async _uploadone (file, index = 0) {
    let self = this
    let preTimeStamp = 0
    let preUploaded = 0

    let formData = new FormData()
    formData.append('file', file)
    formData.append('group_id', 1)

    return http.post('elements', formData, {
      // timeout: 3000,  // improve it (上传超时的处理)
      onUploadProgress: progressEvent => {
        // 对原生进度事件的处理
        let progress = (progressEvent.loaded / progressEvent.total * 100).toFixed(0)
        let loaded = progressEvent.loaded
        let timeStamp = progressEvent.timeStamp
        let uploadSpeed = ''
        // 上传进度
        self.emit('progress', progress, index, file)

        // 上传速度
        uploadSpeed = (loaded - preUploaded) / ((timeStamp - preTimeStamp) / 1000)
        self.emit('uploadSpeed', uploadSpeed, index, file)

        preTimeStamp = progressEvent.timeStamp
        preUploaded = loaded
      }
    }).then(res => {
      console.log('fileuploaded')
      self.emit('fileuploaded', res.data.message, index, file)
    }, err => {
      console.log(err.message)
    })
  }
}

export default fileUploader
