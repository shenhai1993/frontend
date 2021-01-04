'use strict'

import Vue from 'vue'
import {
  SHOW_TEMPLATE_SELECTOR,
  SET_SELECTED_TPL,
  REMOVE_SELECTED_TPL,
  ADD_SELECTED_ELEMENT_WITHTIME,
  REMOVE_SELECTED_ELEMENT_BY_INDEX,
  SORT_SELECTEDFILE,
  CLEAR_PLAYLIST_MUTIPLETPL,
  UPDATE_TIME,
  SET_PLAYLIST_MUTIPLETPL_SELECTED_GROUPS,
  SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS,
  SET_PLAYLISTS,
  SET_EXPIRED_PLAYLISTS,
  DEL_PLAYLIST,
  PUB_STOP_RELEASE,
  IS_MPDP_PAGE,
  LOAD_ITEM,
  SET_PLAYITENDATA,
  SET_DRUGSLISTS, EDIT_PLAYLIST_DATA
} from './mutation-types'

export default {
  // 加载单个Playlist
  [LOAD_ITEM] (state, item) {
    state.selectedTpl = item.tpl
    item.tpl.forEach((tpl, tIndex) => {
      tpl.regions.forEach((region, rIndex) => {
        if (state.selectedFiles[tIndex] === undefined) {
          state.selectedFiles[tIndex] = []
        }
        if (state.selectedFiles[tIndex][rIndex] === undefined) {
          state.selectedFiles[tIndex][rIndex] = []
        }
        state.selectedFiles[tIndex][rIndex] = region.files
      })
    })
  },
  // 选择模板窗口
  [SHOW_TEMPLATE_SELECTOR] (state, status) {
    state.showTemplateSelector = status
  },
  // 添加已选择模板
  [SET_SELECTED_TPL] (state, tpl) {
    state.selectedTpl.push(tpl)
    state.selectedFiles.push([])
  },
  // 删除已选择模板
  [REMOVE_SELECTED_TPL] (state, index) {
    state.selectedTpl.splice(index, 1)
    state.selectedFiles.splice(index, 1)
  },
  // 添加分区文件
  [ADD_SELECTED_ELEMENT_WITHTIME] (state, {index, regionIndex, selectedElement, type}) {
    if (type !== 'tv') {
      if (state.selectedFiles[index][regionIndex] === undefined) {
        Vue.set(state.selectedFiles[index], regionIndex, [])
      }
      selectedElement.data.forEach((ele, i) => {
        if (ele.type === 'image') {
          ele.seconds = 10
        }
        // 重新把要添加的素材复制一份，否则在选中查看素材的第二步中会出现相同素材的样式关联，
        // 因为他们引用的是同一个obj
        let transferObj = Object.assign({}, ele)
        state.selectedFiles[index][regionIndex].push(transferObj)
      })
    } else {
      Vue.set(state.selectedFiles[index], regionIndex, selectedElement)
      // state.selectedFiles[index][regionIndex] = selectedElement
    }
  },

  // [ADD_SELECTED_ELEMENT_WITHTIME] (state, {tplIndex, regionIndex, selectedElement}) {
  //   selectedElement.data.forEach((ele, i) => {
  //     if (ele.type === 'image') {
  //       ele.time = 10
  //     }
  //     state.selectedTpl[tplIndex]['region'][regionIndex].files.push(ele)
  //   })
  // },

  // 删除单个文件
  [REMOVE_SELECTED_ELEMENT_BY_INDEX] (state, {tplIndex, fileIndex, region}) {
    state.selectedFiles[tplIndex][region].splice(fileIndex, 1)
  },
  // 调整文件顺序
  [SORT_SELECTEDFILE] (state, {index, files, region}) {
    state.selectedFiles[index][region] = JSON.parse(JSON.stringify(files))
  },
  // 清除选择文件
  [CLEAR_PLAYLIST_MUTIPLETPL] (state) {
    state.selectedFiles = []
    state.selectedTpl = []
  },
  // 更新时长
  [UPDATE_TIME] (state, {tplIndex, region, seconds, listIndex}) {
    state.selectedFiles[tplIndex][region][listIndex].seconds = seconds
  },
  // 设置选择的groups
  [SET_PLAYLIST_MUTIPLETPL_SELECTED_GROUPS] (state, groups) {
    state.selectedGroups = groups
  },
  // 设置选择的tags
  [SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS] (state, tags) {
    state.selectedTags = tags
  },
  // 设置未过期播出单
  [SET_PLAYLISTS] (state, playlists) {
    state.playlists = playlists
  },
  // 设置过期播出单
  [SET_EXPIRED_PLAYLISTS] (state, playlists) {
    state.expiredPlaylists = playlists
  },
  // 设置播出内容select
  [SET_DRUGSLISTS] (state, playlists) {
    state.drugslists = playlists
  },
  [EDIT_PLAYLIST_DATA] (state, {playlists, type}) {
    state.playlists = playlists.filter(playlist => {
      return playlist.type === type
    })
  },
  // 设置播出内容select
  [SET_PLAYITENDATA] (state, playlists) {
    state.selectPlayItemData = playlists
    console.log(state.selectPlayItemData)
  },
  // 在删除的时候移除界面上面没有过期的播出单
  [DEL_PLAYLIST] (state, item) {
    state.playlists.forEach((ele, index) => {
      if (ele.id === item.id) {
        state.playlists.splice(index, 1)
      }
    })
  },
  // 发布或停止播出单
  [PUB_STOP_RELEASE] (state, {item, status}) {
    state.playlists.forEach(ele => {
      if (ele.id === item.id) {
        ele.status = status
      }
    })
  },

  [IS_MPDP_PAGE] (state, ismpdpPage) {
    state.ismpdpPage = ismpdpPage
  }
}
