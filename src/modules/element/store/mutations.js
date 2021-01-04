'use strict'

import {
  SET_DISK,
  SET_FILELIST,
  SET_FILETYPE,
  ADD_UPLOAD_FILES,
  ADD_FILES_STATE,
  SET_FILE_STATE,
  SET_UPLOAD_SPEED,
  SET_SELECTED_FILES,
  SHOW_UPLOAD_WINDOW,
  SET_UPLOAD_PROFRESS,
  REMOVE_FROM_FILELIST,
  SET_CURRENT_UPLOAD_FILE,
  SET_FILE_PROPERT_BY_ID,
  SET_UPLOADING,
  SET_CURRENT_INDEX,
  SET_DIRECTORY_ID,
  SPLICE_UPLOADEDFILES_LIST
} from './mutation-types'

// mutations
export default {
  [SET_FILELIST] (state, { filelist, append = false }) {
    if (append) {
      state.fileList.push(filelist)
    } else {
      state.fileList = filelist
    }
  },

  [SET_FILETYPE] (state, fileType = 'all') {
    state.fileType = fileType
  },

  [SET_DIRECTORY_ID] (state, directoryid) {
    state.directory_id = directoryid
  },

  [ADD_UPLOAD_FILES] (state, files) {
    state.uploadFiles = state.uploadFiles.concat(files)
  },

  [ADD_FILES_STATE] (state, files) {
    let lastIndex = state.filesState.length
    files.forEach((file, index) => {
      file.index = lastIndex + index
    })
    state.filesState = state.filesState.concat(files)
  },

  [SET_FILE_STATE] (state, {index, prop, value}) {
    state.filesState[index][prop] = value
  },

  [SET_UPLOAD_SPEED] (state, { speed, index }) {
    let file = state.filesState[index]
    if (file) file.speed = speed
  },

  [SET_UPLOADING] (state, val) {
    state.uploading = val
  },

  [SET_SELECTED_FILES] (state, files) {
    state.selectedFiles = files
  },

  [SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },

  [SHOW_UPLOAD_WINDOW] (state, status) {
    state.showUploadWindow = status
  },

  [SET_UPLOAD_PROFRESS] (state, { progress, index }) {
    let file = state.filesState[index]
    if (file) {
      file['progress'] = progress >> 0
    }
  },

  [REMOVE_FROM_FILELIST] (state, files) {
    let filelist = Object.assign(state.fileList)

    for (let file of files) {
      let index = filelist.indexOf(file)
      filelist.splice(index, 1)
    }

    state.fileList = filelist
  },

  [SET_CURRENT_UPLOAD_FILE] (state, file) {
    state.currentUploadFile = file
  },

  [SET_FILE_PROPERT_BY_ID] (state, { id, property, value }) {
    let index = -1
    state.fileList.some((file, i) => {
      if (file.id === id) {
        index = i
      }
      return file.id === id
    })
    state.fileList[index][property] = value
  },

  [SET_DISK] (state, disk) {
    state.disk = disk
  },

  [SPLICE_UPLOADEDFILES_LIST] (state, files) {
    let filelist = Object.assign(state.filesState)
    filelist.forEach(function (itemI, indexI) {
      if (files === itemI) {
        filelist.splice(indexI, 1)
        state.uploadFiles.splice(indexI, 1)
      }
    })
    state.filesState = filelist
  }
}
