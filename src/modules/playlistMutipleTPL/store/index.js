'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  playlists: [],
  drugslists: [],
  selectPlayItemData: {},
  showTemplateSelector: false,
  selectedTpl: [],
  selectedFiles: [],
  selectedGroups: [],
  selectedTags: [],
  ismpdpPage: false
}

export default {
  state,
  actions,
  mutations
}
