'use strict'

import actions from '../store/actions'
import mutations from '../store/mutations'

const state = {
  terminalsList: [], // 终端表格数据
  loadingStatus: true, // 播出单，内容 终端统计表格loading
  elementloadingStatus: true, // 素材统计表格loading
  terminalsloadingStatus: true, // 统计管理loading
  detailsloadingStatus: true, // 终端播放统计表格loading
  detailsList: [], // 终端表格数据
  elementsList: [], // 素材表格数据
  setDataList: [], // 播出单或者内容统计表格数据
  setGroupId: 1, // 存储当前点击组的id
  setTerminals: 'f6ddbec3897', // 存储终端id
  setElementsId: 1 // 素材id
}
export default {
  state,
  actions,
  mutations
}
