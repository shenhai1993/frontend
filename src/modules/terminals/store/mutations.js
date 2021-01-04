import {
  SET_TERMINAL_GROUP,
  CREATE_TERMINAL_GROUP,
  GET_SELECTED_TERMINAL_GROUP,
  ADD_TERMINAL_GROUP,
  REDACT_TERMINAL_GROUP,
  GET_TERMINAL_GROUP_PARENT,
  REMOVE_TERMINAL_GROUP,
  IS_REFRESH,
  GET_UNGROUP_TERMINAL_TOTAL_NUM
} from './mutation-types'

// mutations
export default {
  // 设置终端组
  [SET_TERMINAL_GROUP] (state, terminalGroups) {
    state.terminalGroups = terminalGroups
  },

  // 新建终端组
  [CREATE_TERMINAL_GROUP] (state, newTerminal) {
    state.terminalTree.push(newTerminal)
  },

  // 获取选中的终端组
  [GET_SELECTED_TERMINAL_GROUP] (state, selectedGroup) {
    state.selectedGroup = selectedGroup
  },

  // 在界面上添加新增的终端组
  [ADD_TERMINAL_GROUP] (state, newGroup) {
    state.selectedGroup.children.push(newGroup)
  },

  // 编辑终端组的name
  [REDACT_TERMINAL_GROUP] (state, redactGroupName) {
    state.selectedGroup.name = redactGroupName
  },

  // 获取选中的终端组的父终端组
  [GET_TERMINAL_GROUP_PARENT] (state, selectedGroupParent) {
    state.selectedGroupParent = selectedGroupParent
  },

  // 删除终端组
  [REMOVE_TERMINAL_GROUP] (state) {
    let index = state.selectedGroupParent.indexOf(state.selectedGroup)
    state.selectedGroupParent.splice(index, 1)
  },

  // 刷新按钮控制加载遮罩层的开关
  [IS_REFRESH] (state, isrefresh) {
    state.isrefresh = isrefresh
  },

  // tmnTreeFDUpdate (state, newV) {
  //   state.terminalTreeFormData.name = newV
  // }

  // 未分组终端数量
  [GET_UNGROUP_TERMINAL_TOTAL_NUM] (state, totalNum) {
    state.ungroupedTerminalTotalNum = totalNum
  }
}
