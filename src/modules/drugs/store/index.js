'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  // drugList: [],
  drugsPageList: {},
  showEditWindow: false,
  selectItemData: {}, // 编辑时候选中的列表数据
  selectedTpl: [], // 选中的模板数
  selectedFiles: [],
  selectedChange: 0, // 只为告诉watch 选中的文件数据发生改变
  selectedGroups: [],
  selectAudio: [],
  selectBgimg: {},
  selectedTags: [],
  showTemplateSelector: false,
  ismpdpPage: false,
  loading: false,
  reginsShowMode: [] // 存储区域的showMode信息
}

export default {
  state,
  mutations,
  actions
}
