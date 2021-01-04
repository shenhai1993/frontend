import {
  PUT_PUBLISH_FORMDATA_MPDP,
  PUT_TEMPLATE_MPDP,
  ADD_SELECTED_ELEMENT_MPDP,
  EDIT_IMAGE_ELEMENT_MPDP,
  ADJUST_SELECTED_ELEMENT_ORDER_MPDP,
  GET_TEMPLATE_LISTS_MPDP,
  FILTER_TEMPLATE_MPDP,
  PUT_PLAYLIST_GROUP_MPDP,
  PUT_PLAYLIST_TERMINAL_MPDP,
  SAVE_PLAYLIST_MPDP,
  CLEAR_MATERIAL_LIST_MPDP,
  DELETE_MATERIAL_MPDP,
  PUT_EDITOR_PLAYLIST_MPDP,
  SET_PLAYLISTS_MPDP,
  UPDATE_PLAYSTS_MPDP,
  SET_EXPIRED_PLAYLISTS_MPDP,
  DEL_PLAYLIST_MPDP,
  DEL_EXPIRED_PLAYLIST_MPDP,
  PUB_STOP_RELEASE_MPDP,
  PUT_CHECK_ELEMENT_MPDP,
  IS_MPDP_PAGE_MPDP,
  PUT_FILES,
  CLEAR_CHECK_MATERIAL,
  SET_CUT_LIST,
  SET_RECUT_STATE
} from './mutation-types.js'
import { copy, selected } from '../../terminals/static/js/utils.js'
import Vue from 'vue'
// import { Container } from 'element-ui'

export default {
  [IS_MPDP_PAGE_MPDP] (state, ismpdpPage) {
    state.ismpdpPage = ismpdpPage
  },
  // 发布播出单每一步的数据存储
  [PUT_PUBLISH_FORMDATA_MPDP] (state, formData) {
    copy(state.publishFormData, formData)
  },
  // 获取选择的模板
  [PUT_TEMPLATE_MPDP] (state, activeTemplate) {
    state.chiocedTemplate = activeTemplate
    state.selectedFiles = {}
  },
  // 添加选中的素材
  [ADD_SELECTED_ELEMENT_MPDP] (state, selectedElement) {
    if (state.selectedFiles[selectedElement.index] === undefined) {
      Vue.set(state.selectedFiles, selectedElement.index, [])
    }
    selectedElement.data.forEach((ele, index) => {
      // if (ele.type === 'image') {
      //   ele.seconds = 10
      // }
      // 重新把要添加的素材复制一份，否则在选中查看素材的第二步中会出现相同素材的样式关联，
      // 因为他们引用的是同一个obj
      let transferObj = Object.assign({}, ele)
      state.selectedFiles[selectedElement.index].push(transferObj)
    })
    state.checkOverElement[selectedElement.index] = state.selectedFiles[selectedElement.index][0].path
  },
  // 编辑图片素材的时长
  [EDIT_IMAGE_ELEMENT_MPDP] (state, editElement) {
    state.selectedFiles[editElement.index].splice(editElement.i, 1, editElement.data)
  },

  // 调整选中素材的顺序上移下移
  [ADJUST_SELECTED_ELEMENT_ORDER_MPDP] (state, obj) {
    // obj = {id: '', index: '', direction: ''}
    // id: 选中的区域，index选中的element的序列号，direction调整的方位
    let arr = state.selectedFiles[obj.id]
    switch (obj.direction) {
      case 'top':
        let copyObj1 = arr[obj.index]
        arr.splice(obj.index, 1)
        arr.unshift(copyObj1)
        break
      case 'pre':
        [arr[obj.index - 1], arr[obj.index]] = [arr[obj.index], arr[obj.index - 1]]
        break
      case 'next':
        [arr[obj.index], arr[obj.index + 1]] = [arr[obj.index + 1], arr[obj.index]]
        break
      case 'bottom':
        let copyObj2 = arr[obj.index]
        arr.splice(obj.index, 1)
        arr.push(copyObj2)
        break
    }
    obj.arr = arr
  },

  // 第二步中清空已选的素材列表
  [CLEAR_MATERIAL_LIST_MPDP] (state) {
    state.selectedFiles = {}
    state.checkOverElement = {}
    if (state.activeElement) {
      state.activeElement = null
    }
  },
  // 在查看播出单的时候清空选中的素材
  [CLEAR_CHECK_MATERIAL] (state) {
    state.checkOverElement = {}
  },
  // 移除素材列表中选中的素材
  [DELETE_MATERIAL_MPDP] (state, item) {
    if (item.all === 'all') {
      state.selectedFiles[item.key] = []
      state.checkOverElement[item.key] = {}
      state.activeElement.selected = false
      state.activeElement = {}
    } else {
      state.selectedFiles[item.key].splice(item.index, 1)
      if (state.selectedFiles[item.key].length) {
        state.checkOverElement[item.key] = state.selectedFiles[item.key][0].path
        selected(state, state.selectedFiles[item.key][0], 'activeElement')
      }
    }
  },
  // 在播出单查看中直接添加素材
  [PUT_FILES] (state, files) {
    state.selectedFiles = files
  },
  // 获取模板列表
  [GET_TEMPLATE_LISTS_MPDP] (state, lists) {
    state.templatelists = lists
  },
  // 存储编辑时的播出单
  [PUT_EDITOR_PLAYLIST_MPDP] (state, item) {
    state.editItem = item
  },
  // 搜索时过滤模板
  [FILTER_TEMPLATE_MPDP] (state, searchQuery) {
    let lists = () => {
      return state.templatelists.filter(function (item) {
        return item.name.indexOf(searchQuery) !== -1
      })
    }
    state.filteredItems = lists()
  },

  // 编辑播出单按分组发布
  [PUT_PLAYLIST_GROUP_MPDP] (state, data) {
    state.playlistselectedGroup = data
  },
  // 编辑播出单选择的终端、分组
  [PUT_PLAYLIST_TERMINAL_MPDP] (state, ids) {
    state.playlistselectedTerminal = ids
  },
  // 提交保存
  [SAVE_PLAYLIST_MPDP] (state, isonlySave) {
    state.postdata = state.publishFormData

    state.postdata.id = state.editItem.id || 0
    state.postdata.recut = state.recut
    state.postdata.content = {
      scene: state.chiocedTemplate,
      elements: state.selectedFiles
    }
    if (isonlySave) {
      state.postdata.publish = 0
    } else {
      state.postdata.publish = 1
    }
    state.postdata.screen_ids = []
    state.playlistselectedTerminal.forEach(ele => {
      state.postdata.screen_ids.push(ele.id)
    })
    state.postdata.publish_type = state.playlistselectedGroup.type
    state.postdata.trees = state.playlistselectedGroup.trees
    state.postdata.tags = state.playlistselectedGroup.tags
  },
  // 设置未过期播出单
  [SET_PLAYLISTS_MPDP] (state, playlists) {
    state.playlists = playlists
  },
  // 更新未过期播出单
  [UPDATE_PLAYSTS_MPDP] (state, obj) {
    state.playlists[obj.index].status = obj.playlist.status
  },
  // 设置过期播出单
  [SET_EXPIRED_PLAYLISTS_MPDP] (state, playlists) {
    state.expiredPlaylists = playlists
  },

  // 发布或停止播出单
  [PUB_STOP_RELEASE_MPDP] (state, {id, status}) {
    state.playlists.forEach(ele => {
      if (ele.id === id) {
        ele.status = status
      }
    })
  },
  // 在删除的时候移除界面上面没有过期的播出单
  [DEL_PLAYLIST_MPDP] (state, item) {
    state.playlists.forEach((ele, index) => {
      if (ele.id === item.id) {
        state.playlists.splice(index, 1)
      }
    })
  },
  // 在删除的时候移除界面上面过期的播出单
  [DEL_EXPIRED_PLAYLIST_MPDP] (state, item) {
    state.expiredPlaylists.forEach((ele, index) => {
      if (ele.id === item.id) {
        state.expiredPlaylists.splice(index, 1)
      }
    })
  },
  // 切换查看已选择的素材
  [PUT_CHECK_ELEMENT_MPDP] (state, element) {
    let oldObject = Object.assign({}, state.checkOverElement)
    // 这里之所以要把它设置为空，是因为如果直接设置它的对象的属性，不能够引起vue的响应
    state.checkOverElement = {}
    oldObject[element.id] = element.path
    state.checkOverElement = oldObject
    selected(state, state.selectedFiles[element.id][element.index], 'activeElement')
  },
  // 获取素材切割列表
  [SET_CUT_LIST] (state, cutList) {
    state.cutList = cutList
  },
  // 是否需要重新切割
  [SET_RECUT_STATE] (state, s) {
    state.recut = s
  }
}
