/**
 * chenxi (chxi@tcl.com)
 */

'use strict'

import {
  SET_DISK, SET_FILELIST, ADD_UPLOAD_FILES, ADD_FILES_STATE, SHOW_UPLOAD_WINDOW, SET_UPLOAD_PROFRESS, SET_UPLOAD_SPEED, REMOVE_FROM_FILELIST, SET_FILE_PROPERT_BY_ID, SET_UPLOADING, SET_CURRENT_INDEX
} from './mutation-types.js'

// 引入全局类库
import api from '../../../../static/js/api/'

import LiteMD5 from '../../../../static/js/utils/litemd5'
import FileUploader from '../static/js/fileupload.js'

// Element 库
import Element from '../static/js/element.js'

// actions
export default {
  getDisk ({ commit, state }) {
    api.me().then(res => {
      let user = res.data.message

      commit(SET_DISK, {
        disk_used: user.disk_used,
        disk_total: user.disk_total,
        disk_rates: user.disk_rates
      })
    })
  },

  async getFileList ({ commit, state }, {type = 'all'}) {
    let res = null
    console.log('type:==>', type)
    try {
      res = await Element.getFileList(type, state.directory_id)
      if (res) {
        commit(SET_FILELIST, { 'filelist': res.message, 'append': false })
        // commit(SET_DISK, res.disk)
        return res.message
      }
    } catch (error) {
    }
  },

  async removeFile ({ commit, state }, {groupId, files}) {
    // try {
    let inuse = []
    let difference = []
    let res = await Element.remove(files, groupId)

    for (let file of files) {
      let find = false
      for (let f of res) {
        if (!!f.data.success && file.id === f.id) {
          find = true
          break
        }
      }
      if (find) {
        difference.push(file)
      } else {
        inuse.push(file)
      }
    }

    if (difference.length !== 0) commit(REMOVE_FROM_FILELIST, difference)

    return inuse
    // } catch (e) {
    //   console.log(e.message) // improve it (失败后vuex状态重置和界面重置)
    // }
  },

  // async addUploadFiles (store, { uploadFiles, filesState }) {
  //   const { commit, state } = store

  //   commit(SHOW_UPLOAD_WINDOW, true)
  //   commit(ADD_UPLOAD_FILES, uploadFiles)
  //   commit(ADD_DIALOG_FILES, filesState)

  //   let length = (state.dialogFiles.length === 0) ? 0 : state.dialogFiles.length - filesState.length

  //   let uploader = new FileUploader(new LiteMD5())
  //   uploader
  //     .on('currentUploadFile', file => {
  //       commit(SET_CURRENT_UPLOAD_FILE, file)
  //     })
  //     .on('progress', (progress, index) => {
  //       commit(SET_UPLOAD_PROFRESS, { 'progress': progress, 'index': length + index })
  //     })
  //     .on('uploadSpeed', (speed, index) => {
  //       commit(SET_UPLOAD_SPEED, { 'speed': speed, 'index': length + index })
  //     })
  //     .on('fileuploaded', (file, index) => {
  //     // if (state.fileType === 'all' || file.type === state.fileType) {
  //       commit(SET_FILELIST, { 'filelist': file, 'append': true })
  //     })
  //     .on('fileexists', (file, index) => { // MD5存在，文件名不存在，秒传
  //       console.log('file:==>', file)
  //       commit(SET_FILELIST, { 'filelist': file, 'append': true })
  //       commit(SET_UPLOAD_PROFRESS, { 'progress': 100, 'index': length + index })
  //       commit(SET_UPLOAD_SPEED, { 'speed': '秒传', 'index': length + index })
  //     })
  //     .on('nameexists', (file, index) => { // 文件名和MD5都存在
  //       commit(SET_UPLOAD_PROFRESS, { 'progress': 100, 'index': length + index })
  //       commit(SET_UPLOAD_SPEED, { 'speed': '已存在', 'index': length + index })
  //     })
  //     .on('allfileuploaded', count => {
  //       console.log('allfileuploaded')
  //       // reset currentUploadFile
  //       commit(SET_CURRENT_UPLOAD_FILE, { 'file': null, index: -1 })

  //       // sync disk space usage
  //       // dispatch('getDisk')

  //       // hide uploadDialog window
  //       setTimeout(() => {
  //         commit(SHOW_UPLOAD_WINDOW, false)
  //       }, 2000)
  //     })

  //   await uploader.uploadFiles(uploadFiles)
  // },

  addUploadFiles ({ commit, state }, { uploadFiles, filesState, isResume }) {
    commit(SHOW_UPLOAD_WINDOW, true)
    if (!isResume) {
      commit(ADD_UPLOAD_FILES, uploadFiles)
      commit(ADD_FILES_STATE, filesState)
    }
    if (state.uploading) {
      return
    }
    let baseInfo = null
    let uploader = new FileUploader(new LiteMD5())
    let progressList = []
    let timer = null
    let index = -1
    let preUploaded = [] // 上传进度与速度
    _upload()

    uploader.on('fileuploaded', (file) => {
      commit(SET_FILELIST, { 'filelist': file, 'append': true })
      clearInterval(timer)
      commit('SET_UPLOAD_PROFRESS', 100, index)
      commit('SET_UPLOAD_SPEED', { 'speed': '已完成', 'index': index })
      _upload()
    }).on('progress', progress => {
      let a = progress.connectNum - 1
      progressList[a] = progress
    }).on('fileexists', (file, index) => { // MD5存在，文件名不存在，秒传
      console.log('file:==>', file)
      clearInterval(timer)
      commit(SET_FILELIST, { 'filelist': file, 'append': true })
      commit(SET_UPLOAD_PROFRESS, { 'progress': 100, 'index': index })
      commit(SET_UPLOAD_SPEED, { 'speed': '秒传', 'index': index })
      _upload()
    }).on('nameexists', (file, index) => { // 文件名和MD5都存在
      console.log('exists index:==>', index)
      clearInterval(timer)
      commit(SET_UPLOAD_PROFRESS, { 'progress': 100, 'index': index })
      commit(SET_UPLOAD_SPEED, { 'speed': '已存在', 'index': index })
      _upload()
    }).on('baseinfo', info => {
      baseInfo = info
    }).on('stop', index => {
      clearInterval(timer)
    }).on('error', res => {
      clearInterval(timer)
      commit(SET_UPLOAD_SPEED, { 'speed': '错误', 'index': index })
    })
    // 判断是否有需要上传的文件
    function _upload () {
      index = getNeedUpload(state.filesState)
      if (index !== -1) {
        uploader._upload(state.uploadFiles[index], index, state.filesState[index])
        commit(SET_UPLOADING, true)
        commit(SET_CURRENT_INDEX, index)
        timer = setInterval(() => {
          updataProgress(progressList, index)
        }, 1000)
      } else {
        commit(SET_UPLOADING, false)
      }
    }

    function updataProgress (progressList, index) {
      if (state.filesState[index].isStop) {
        clearInterval(timer)
        return
      }
      let loaded = 0
      let lastChunkIndex = 0
      progressList.forEach(item => {
        if (item.fileIndex === index) {
          loaded += item.loaded
          lastChunkIndex = Math.max(lastChunkIndex, item.lastChunkIndex)
        }
      })
      if (lastChunkIndex < baseInfo.connectNum) {
        lastChunkIndex = baseInfo.connectNum
      }
      console.log('loaded:==>', loaded)
      let uploaded = (loaded + (lastChunkIndex - baseInfo.connectNum) * baseInfo.chunkSize)
      if (typeof preUploaded[index] === 'undefined') {
        preUploaded[index] = 0
      }
      let speed = uploaded // 换显示已上传文件大小
      speed = speed < preUploaded[index] ? preUploaded : speed
      console.log('speed:==>', speed)
      // let _progress = uploaded / state.uploadFiles[index].size * 100 >> 0
      let _progress = speed / state.uploadFiles[index].size * 100 >> 0
      _progress = _progress > 100 ? 100 : _progress
      console.log('_progress:==>', _progress)
      preUploaded[index] = speed
      commit('SET_UPLOAD_SPEED', {speed, index})
      commit('SET_UPLOAD_PROFRESS', {progress: _progress, index})
    }

    // 检查是否有需要上传的文件并返回文件index
    function getNeedUpload (files) {
      console.log('files:==>', files)
      let index = -1
      files.some((file, i) => {
        if (file.progress !== 100 && file.isStop === false && file.isCancel === false) {
          console.log('i:==>', i)
          index = i
          return true
        }
      })
      return index
    }
  },

  clearCompliteFile ({ commit, state }) {

  },

  setFileProperty ({ commit, state }, { id, property, value }) {
    commit(SET_FILE_PROPERT_BY_ID, { 'id': id, 'property': property, 'value': value })
  },

  async setFilename ({ commit, state }, { fileID, fileName }) { // , groupId
    let res = await Element.setFilename(fileID, fileName) // , groupId

    return res
  },

  async createStream ({ commit, state }, { name, type, path, groupId, directoryId }) {
    let res = await Element.createStream(name, type, path, groupId, directoryId)

    let file = res.data.message
    if (state.fileType === 'all' || file.type === state.fileType) {
      commit(SET_FILELIST, { 'filelist': file, 'append': true })
    }

    return res
  },

  async modifyStream ({ commit, state }, {id, name, path, groupId}) {
    console.log(groupId)
    let res = await Element.modifyStream(id, name, path, groupId)

    // let file = res.data.message
    // if (state.fileType === 'all' || file.type === state.fileType) {
    //   commit(SET_FILELIST, { 'filelist': file, 'append': true })
    // }

    return res
  },

  _response (res, state, commit) {
    let file = res.data.message
    if (state.fileType === 'all' || file.type === state.fileType) {
      commit(SET_FILELIST, { 'filelist': file, 'append': true })
    }

    return res
  }
}
