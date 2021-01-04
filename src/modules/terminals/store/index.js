import mutations from './mutations'
import actions from './actions'

// initial state
const state = {
  terminalGroups: [],
  terminalGroup: {
    name: '',
    parentid: 0
  },
  selectedGroup: null,
  selectedGroupParent: [],
  isrefresh: false,
  ungroupedTerminalTotalNum: 0
}

export default {
  state,
  mutations,
  actions
}
