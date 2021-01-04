'use strict'

import {SHOW_PLAYBILL_EDIT} from './mutation-types'

export default {
  [SHOW_PLAYBILL_EDIT] (state, status) {
    state.showPlaybillEdit = status
  }
}
