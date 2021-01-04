import events from 'events'

import http from '../../../../../static/js/utils/http'

const CHUNK_SIZE = 1024 * 1024 * 2 // 分块大小
const MAX_CONNECT_NUM = 3 // 并最大发数
class fileUploader extends events.EventEmitter {
  constructor (md5) {
    super()
    this.md5 = md5
  }

  async uploadFiles (files) {
    console.log('files:==>', files)
    for (let i = 0; i < files.length; i++) {
      await this._upload(files[i], i) // improve me! browser support 3 ajax request at one time
      console.log('i:==>', i)
    }

    this.emit('allfileuploaded', files.length)
  }

  async upload (file, index) {
    await this._upload(file, index)
  }

  async _upload (file, index, fileState) {
    // this.emit('currentUploadFile', { 'file': file, 'index': index })
    console.log('file:==>', file)
    let fileInfo = await this.getFileState(file)
    let needConnectNum = fileInfo.totalChunk < MAX_CONNECT_NUM ? fileInfo.totalChunk : MAX_CONNECT_NUM // 实际并发数

    let info = {
      connectNum: needConnectNum,
      chunkSize: CHUNK_SIZE
    }
    this.emit('baseinfo', info)
    let res = await this.check(file, fileInfo, fileState) // 检查文件是否存在
    // console.log('res:==>', res)
    if (!res.data.success) {
      if (res.status === 501) {
        // 文件完整性错误, 再重新上传一次即可
        res = await this.check(file, fileInfo, fileState)
      } else {
        this.emit('error', res)
        return
      }
    }
    if (res.data.message.element === '') { // file not exists
      let lastChunkIndex = {index: 0} // 应传块区的index
      // 文件不存在

      if (res.data.message.exists_chunks === '') {
        for (let i = needConnectNum; i > 0; i--) {
          lastChunkIndex.index++
          console.log('i:==>', i)
          let chunkIndex = needConnectNum - i + 1
          this._uploadFileChunk(file, fileInfo, index, chunkIndex, lastChunkIndex, i, fileState)
        }
      } else { // 已上传部分文件
        let lastIndex = Number(res.data.message.exists_chunks.split(',').pop()) // 服务器返回的已接收分块的最后一个index值
        lastChunkIndex.index = lastIndex
        for (let i = needConnectNum; i > 0; i--) {
          let chunkIndex = lastIndex - i + 1
          if (res.data.message.exists_chunks.indexOf(chunkIndex) === -1) { // 中间有块区未传
            this._uploadFileChunk(file, fileInfo, index, chunkIndex, lastChunkIndex, i, fileState)
          } else {
            lastChunkIndex.index++
            this._uploadFileChunk(file, fileInfo, index, lastChunkIndex.index, lastChunkIndex, i, fileState)
          }
        }
      }
      // await this._uploadone(file, index)
    } else { // file exists
      if (res.data.message.element.uploadhit) {
        this.emit('fileexists', res.data.message.element, index, file)
      } else {
        this.emit('nameexists', res.data.message, index, file)
      }
    }
  }

  async getFileState (file) {
    let fileInfo = {}
    fileInfo.totalChunk = Math.ceil(file.size / CHUNK_SIZE)
    fileInfo.md5 = await this.getMD5(file)
    fileInfo.ext = file.name.split('.').pop()
    return fileInfo
  }

  // 判断文件在服务器端是否存在
  async check (file, fileInfo, fileState) {
    let res = null
    try {
      res = await http.post('elements/preprocess', { 'name': file.name, 'md5': fileInfo.md5, 'total': fileInfo.totalChunk, 'ext': fileInfo.ext, 'directory_id': fileState.directoryId })
    } catch (e) {
      return e
    }
    return res
  }

  // 文件上传
  async _uploadone (file, index = 0) {
    let self = this
    let preTimeStamp = 0
    let preUploaded = 0
    let formData = new FormData()
    formData.append('file', file)
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
      },
      canNotCancel: true
    }).then(res => {
      console.log('fileuploaded')
      self.emit('fileuploaded', res.data.message, index, file)
    }, err => {
      console.log(err.message)
    })
  }
  // 分块文件上传
  async _uploadFileChunk (file, fileInfo, fileIndex = 0, chunkIndex = 1, lastChunkIndex, connectNum, fileState, directoryId) {
    if (chunkIndex === 0) {
      chunkIndex = 1
    }
    if (fileState.isStop) {
      this.emit('stop', fileIndex)
      return
    }
    let stop = false
    console.log('lastChunkIndex.index:==>', lastChunkIndex.index)
    let self = this
    // let preTimeStamp = 0
    // let preUploaded = 0
    let formData = new FormData()
    if (lastChunkIndex.index > fileInfo.totalChunk) {
      return
    }
    let start = (chunkIndex - 1) * CHUNK_SIZE
    let end = Math.min(file.size, start + CHUNK_SIZE)
    // console.log('start, end:==>', start, end)
    let chunk = file.slice(start, end)
    // console.log('chunk:==>', chunk)
    let _chunkMD5 = ''
    _chunkMD5 = await this.getMD5(chunk)

    // console.log('_chunkMD5:==>', _chunkMD5)
    // return
    formData.append('chunk', chunk)
    formData.append('name', file.name)
    formData.append('ext', fileInfo.ext)
    formData.append('index', chunkIndex)
    formData.append('total', fileInfo.totalChunk)
    formData.append('size', file.size)
    formData.append('chunk_md5', _chunkMD5)
    formData.append('md5', fileInfo.md5)
    formData.append('offset', start)
    formData.append('directory_id', fileState.directoryId)
    // formData.append('chunkMD5', _chunkMD5)
    console.log('formData:==>', formData)
    return http.post('elements/uploading', formData, {
      // timeout: 3000,  // improve it (上传超时的处理)
      onUploadProgress: evt => {
        // 对原生进度事件的处理
        // let progress = ((progressEvent.loaded + (lastChunkIndex.index - 4) * CHUNK_SIZE) / file.size * 100).toFixed(0)
        // let loaded = progressEvent.loaded
        // let timeStamp = progressEvent.timeStamp
        // let uploadSpeed = ''
        let progress = {
          loaded: evt.loaded,
          fileIndex: fileIndex,
          lastChunkIndex: lastChunkIndex.index,
          connectNum
        }
        if (!stop && fileState.isStop) {
          this.emit('stop', fileIndex)
          stop = true
        }
        // 上传进度
        self.emit('progress', progress)

        // 上传速度
        // uploadSpeed = (loaded - preUploaded) / ((timeStamp - preTimeStamp) / 1000)
        // self.emit('uploadSpeed', uploadSpeed, fileIndex, file)

        // preTimeStamp = progressEvent.timeStamp
        // preUploaded = loaded
      },
      canNotCancel: true
    }).then(res => {
      if (lastChunkIndex.index < fileInfo.totalChunk) {
        console.log('stop:==>', stop)
        if (stop) {
          return
        }
        lastChunkIndex.index++
        console.log('lastChunkIndex.index:==>', lastChunkIndex.index)
        chunkIndex = lastChunkIndex.index
        this._uploadFileChunk(file, fileInfo, fileIndex, chunkIndex, lastChunkIndex, connectNum, fileState, directoryId)
      } else {
        console.log('fileuploaded')
        if (res.data.element !== '') {
          self.emit('fileuploaded', res.data.element, fileIndex, file)
        }
        self.emit('allchunkupload', fileIndex)
      }
    }, err => {
      console.log(err.message)
    })
  }

  async getMD5 (file) {
    let md5 = await this.md5.md5(file)
    return md5
  }
}

export default fileUploader
