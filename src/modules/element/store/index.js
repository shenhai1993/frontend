'use strict'

import mutations from './mutations'
import actions from './actions'

// initial state
const state = {
  disk: {
    used: 0,
    total: 100
  },
  fileType: 'all',
  allCount: 0,
  imageCount: 0,
  videoCount: 0,
  audioCount: 0,
  fileList: [],
  filesState: [],
  uploadFiles: [],
  selectedFiles: [],
  showUploadWindow: false,
  currentUploadFile: null,
  uploading: false,
  currentIndex: 0,
  directory_id: null
}

export default {
  state,
  mutations,
  actions
}
