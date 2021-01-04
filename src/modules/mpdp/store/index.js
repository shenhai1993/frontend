import actions from '../store/actions'
import mutations from '../store/mutations'

const state = {
  playlists: [],
  expiredPlaylists: [],
  publishFormData: {},
  chiocedTemplate: null,
  selectedFiles: {},
  playlistselectedGroup: {},
  playlistselectedTerminal: {},
  templatelists: [],
  filteredItems: [],
  editItem: [],
  postdata: {},
  checkOverElement: {},
  activeElement: null,
  ismpdpPage: false,
  cutList: {},
  recut: 0
}

export default {
  state,
  actions,
  mutations
}
