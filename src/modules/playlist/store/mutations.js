import {
  PUT_PUBLISH_FORMDATA,
  PUT_TEMPLATE,
  ADD_SELECTED_ELEMENT,
  ADJUST_SELECTED_ELEMENT_ORDER,
  GET_TEMPLATE_LISTS,
  FILTER_TEMPLATE,
  PUT_PLAYLIST_TERMINAL,
  SAVE_PLAYLIST,
  CLEAR_MATERIAL_LIST,
  DELETE_MATERIAL,
  PUT_EDITOR_PLAYLIST,
  SET_PLAYLISTS,
  SET_EXPIRED_PLAYLISTS,
  DEL_PLAYLIST,
  DEL_EXPIRED_PLAYLIST,
  PUB_STOP_RELEASE,
  PUT_CHECK_ELEMENT,
  IS_MPDP_PAGE
} from './mutation-types.js'
import { copy, selected } from '../../terminals/static/js/utils.js'
import Vue from 'vue'
// import { Container } from 'element-ui'

export default {
  [IS_MPDP_PAGE] (state, ismpdpPage) {
    state.ismpdpPage = ismpdpPage
  },
  // 发布播出单每一步的数据存储
  [PUT_PUBLISH_FORMDATA] (state, formData) {
    copy(state.publishFormData, formData)
  },
  // 获取选择的模板
  [PUT_TEMPLATE] (state, activeTemplate) {
    state.chiocedTemplate = activeTemplate
    state.selectedFiles = {}
  },
  // 添加选中的素材
  [ADD_SELECTED_ELEMENT] (state, selectedElement) {
    if (state.selectedFiles[selectedElement.index] === undefined) {
      Vue.set(state.selectedFiles, selectedElement.index, [])
    }
    selectedElement.data.forEach((ele, index) => {
      if (ele.type === 'image') {
        ele.seconds = 10
      }
      // 重新把要添加的素材复制一份，否则在选中查看素材的第二步中会出现相同素材的样式关联，
      // 因为他们引用的是同一个obj
      let transferObj = Object.assign({}, ele)
      state.selectedFiles[selectedElement.index].push(transferObj)
    })
    state.checkOverElement[selectedElement.index] = state.selectedFiles[selectedElement.index][0].path
  },

  // 调整选中素材的顺序上移下移
  [ADJUST_SELECTED_ELEMENT_ORDER] (state, obj) {
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
  [CLEAR_MATERIAL_LIST] (state) {
    state.selectedFiles = {}
    state.checkOverElement = {}
    if (state.activeElement) {
      state.activeElement = null
    }
  },
  // 移除素材列表中选中的素材
  [DELETE_MATERIAL] (state, item) {
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
  // 获取模板列表
  [GET_TEMPLATE_LISTS] (state, lists) {
    state.templatelists = lists
  },
  // 存储编辑时的播出单
  [PUT_EDITOR_PLAYLIST] (state, item) {
    state.editItem = item
  },
  // 搜索时过滤模板
  [FILTER_TEMPLATE] (state, searchQuery) {
    let lists = () => {
      return state.templatelists.filter(function (item) {
        return item.name.indexOf(searchQuery) !== -1
      })
    }
    state.filteredItems = lists()
  },

  // 编辑播出单选择的终端、分组
  [PUT_PLAYLIST_TERMINAL] (state, ids) {
    state.playlistselectedTerminal = ids
  },
  // 提交保存
  [SAVE_PLAYLIST] (state, isonlySave) {
    state.postdata = state.publishFormData

    state.postdata.content = {
      template: state.chiocedTemplate,
      elements: state.selectedFiles
    }
    if (isonlySave) {
      state.postdata.publish = 0
    } else {
      state.postdata.publish = 1
    }
    state.postdata.terminal_ids = []
    state.playlistselectedTerminal.forEach(ele => {
      state.postdata.terminal_ids.push(ele.id)
    })
  },
  // 设置未过期播出单
  [SET_PLAYLISTS] (state, playlists) {
    state.playlists = playlists
  },

  // 设置过期播出单
  [SET_EXPIRED_PLAYLISTS] (state, playlists) {
    state.expiredPlaylists = playlists
  },

  // 发布或停止播出单
  [PUB_STOP_RELEASE] (state, {item, status}) {
    state.playlists.forEach(ele => {
      if (ele.id === item.id) {
        ele.status = status
      }
    })
  },
  // 在删除的时候移除界面上面没有过期的播出单
  [DEL_PLAYLIST] (state, item) {
    state.playlists.forEach((ele, index) => {
      if (ele.id === item.id) {
        state.playlists.splice(index, 1)
      }
    })
  },
  // 在删除的时候移除界面上面过期的播出单
  [DEL_EXPIRED_PLAYLIST] (state, item) {
    state.expiredPlaylists.forEach((ele, index) => {
      if (ele.id === item.id) {
        state.expiredPlaylists.splice(index, 1)
      }
    })
  },
  // 切换查看已选择的素材
  [PUT_CHECK_ELEMENT] (state, element) {
    let oldObject = Object.assign({}, state.checkOverElement)
    // 这里之所以要把它设置为空，是因为如果直接设置它的对象的属性，不能够引起vue的响应
    state.checkOverElement = {}
    oldObject[element.id] = element.path
    state.checkOverElement = oldObject
    selected(state, state.selectedFiles[element.id][element.index], 'activeElement')
  }
}
