import {
  SET_TERMINAL_GROUP,
  CREATE_TERMINAL_GROUP
} from './mutation-types'
import axios from 'axios'

export default {
  async getTerminalGroups ({ commit }) {
    let terminalGroups = await axios.get('/web/groups')
    commit(SET_TERMINAL_GROUP, terminalGroups.data)
  },

  async terminalTreeDialog ({ commit, state }) {
    let terminal = await axios.post('/web/terminal/group', state.terminalTreeFormData)
    commit(CREATE_TERMINAL_GROUP, terminal.data)
  }
}
