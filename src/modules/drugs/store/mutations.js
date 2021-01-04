'use strict'

import Vue from 'vue'
import {
  GET_DRUGS_PAGE_LIST, SET_SELECT_AUDIO, SET_SELECT_BGIMG, DELETE_SELECT_AUDIO, CLEAR_SELECT_AUDIO, CLEAR_SELECT_BGIMG, DELETE_REGINS_SHOW_MODE,
  UPDATE_LOADING_STATUS, SET_SELECTED_TPL_TEXT, SET_SELECT_REGIONES, TOGGLE_SELECT_TPL, DELETE_TEMPLATE_AND_FILES, DELETE_TEMPLATE_POSITION_STYLE, EDITOR_TEMPLATE_POSITION_STYLE, DELETE_TEMPLATE_FONTSIZE, DELETE_LAST_TPL,
  SHOW_TEMPLATE_SELECTOR, SET_SELECTED_TPL, REMOVE_SELECTED_TPLS, ADD_SELECTED_ELEMENT_WITHTIME_DRUGS, REMOVE_SELECTED_ELEMENT_BY_INDEX_DRUGS, SORT_DRUGS_SELECTEDFILE, CLEAR_PLAYLIST_MUTIPLETPL, UPDATE_TIME_GROUP, SET_PLAYLIST_MUTIPLETPL_SELECTED_GROUPS, SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS, SET_PLAYLISTS, SET_EXPIRED_PLAYLISTS, DEL_PLAYLIST, DEL_EXPIRED_PLAYLIST, IS_MPDP_PAGE, LOAD_ITEM_DRUGS, SET_REGINS_SHOW_MODE
} from './mutation-types'
export default {
  [GET_DRUGS_PAGE_LIST] (state, drugsPageList) {
    // state.drugsPageList = drugsPageList
    state.drugsPageList = JSON.parse(JSON.stringify(drugsPageList))
    state.drugsPageList = Object.assign([], drugsPageList)
  },
  [SET_SELECT_AUDIO] (state, bmgList) {
    let json = state.selectAudio.concat(bmgList) // 两个数组对象合并
    let newJson = [] // 盛放去重后数据的新数组
    for (state.selectAudio of json) {
      let flag = true
      for (bmgList of newJson) {
        if (state.selectAudio.id === bmgList.id) {
          flag = false
        }
      }
      if (flag) { // 判断是否重复
        newJson.push(state.selectAudio)
      }
    }
    state.selectAudio = newJson
    state.selectedTpl[0].bgm = newJson
    // state.selectAudio = bmgList
    // state.selectedTpl[0].bgm = bmgList
  },
  [SET_SELECT_BGIMG] (state, file) {
    state.selectBgimg = file
    state.selectedTpl[0].background = file
  },
  [DELETE_SELECT_AUDIO] (state, index) { // 删除单条背景音乐
    state.selectAudio.splice(index, 1) // selectAudio指向同一源 删除数据的时候只用清理一次
    // state.selectedTpl[0].bgm.splice(index, 1)
  },
  [TOGGLE_SELECT_TPL] (state, {data}) {
    if (data.type === 'image') {
      data.showMode = 0
      state.selectedTpl[0].regions.push(data)
    } else {
      state.selectedTpl[0].regions.push(data)
    }
  },
  [CLEAR_SELECT_AUDIO] (state) { // 清空背景音乐
    state.selectAudio = [] // selectAudio指向同一源 删除数据的时候只用清理一次
    // state.selectedTpl[0].bgm.splice(index, 1)
  },
  [CLEAR_SELECT_BGIMG] (state) { // 清空背景图片
    if (state.selectedTpl.length > 0 && JSON.stringify(state.selectedTpl[0].background) !== '{}') {
      state.selectBgimg = {}
      delete state.selectedTpl[0].background
    }
  },
  [DELETE_TEMPLATE_POSITION_STYLE] (state, {index, position}) {
    state.selectedTpl[0].regions.forEach((item, i) => {
      if (item.id === index) {
        state.selectedTpl[0].regions[i].width = position.width
        state.selectedTpl[0].regions[i].height = position.height
        state.selectedTpl[0].regions[i].x = position.x
        state.selectedTpl[0].regions[i].y = position.y
      }
    })
  },
  [DELETE_TEMPLATE_FONTSIZE] (state, {index, size}) {
    state.selectedTpl[0].regions.forEach((item, i) => {
      if (item.id === index) {
        state.selectedTpl[0].regions[i].txtsize = size
      }
    })
  },
  [EDITOR_TEMPLATE_POSITION_STYLE] (state, {i, t, n}) {
    state.selectedTpl[0].regions.forEach((item, index) => {
      if (item.id === i) {
        state.selectedTpl[0].regions[index][t] = n
      }
    })
  },
  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },
  // 加载单个Playlist
  [LOAD_ITEM_DRUGS] (state, item) {
    state.selectAudio = item.tpl.bgm
    let arr = []
    arr.push(item.tpl)
    state.selectedTpl = arr
    // console.log(state.selectedTpl)
    arr.forEach((tpl, tIndex) => {
      tpl.regions.forEach((region, rIndex) => {
        if (state.selectedFiles[tIndex] === undefined) {
          state.selectedFiles[tIndex] = []
        }
        if (state.selectedFiles[tIndex][rIndex] === undefined) {
          state.selectedFiles[tIndex][rIndex] = []
        }
        state.selectedFiles[tIndex][rIndex] = region.files
        // 读取regin可能有的showMode状态
        if (region.showMode !== undefined) {
          if (state.reginsShowMode[tIndex] === undefined) {
            state.reginsShowMode[tIndex] = []
          }
          if (state.reginsShowMode[tIndex][rIndex] === undefined) {
            state.reginsShowMode[tIndex][rIndex] = []
          }
          state.reginsShowMode[tIndex][rIndex] = region.showMode
        }
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
  // 添加文本框内容
  [SET_SELECTED_TPL_TEXT] (state, {index, val}) {
    state.selectedTpl[0].regions[index].text = val.value
    state.selectedTpl[0].regions[index].seconds = val.seconds
  },
  // 删除已选择模板
  [REMOVE_SELECTED_TPLS] (state, index) {
    state.selectedTpl.splice(index, 1)
    state.selectedFiles.splice(index, 1)
  },
  [SET_SELECT_REGIONES] (state, data) {
    state.selectItemData = data
  },
  // 添加分区文件
  [ADD_SELECTED_ELEMENT_WITHTIME_DRUGS] (state, {index, regionIndex, selectedElement, type}) {
    if (type !== 'tv' && type !== 'text') {
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
        state.selectedChange++
      })
    } else {
      Vue.set(state.selectedFiles[index], regionIndex, selectedElement)
      // state.selectedFiles[index][regionIndex] = selectedElement
    }
  },
  // 删除模板元素和文件
  [DELETE_TEMPLATE_AND_FILES] (state, id) {
    state.selectedTpl[0].regions.splice(id, 1)
    state.selectedFiles[0].splice(id, 1)
    state.selectedTpl[0].regions.forEach((item, index) => {
      item.id = index // 删除元素的时候根据当前数组下标重新排列id
    })
  },
  // 删除单个文件
  [REMOVE_SELECTED_ELEMENT_BY_INDEX_DRUGS] (state, {tplIndex, fileIndex, region}) {
    state.selectedFiles[tplIndex][region].splice(fileIndex, 1)
  },
  // 调整文件顺序
  [SORT_DRUGS_SELECTEDFILE] (state, {index, files, region}) {
    state.selectedFiles[index][region] = JSON.parse(JSON.stringify(files))
  },
  // 清除选择文件
  [CLEAR_PLAYLIST_MUTIPLETPL] (state) {
    state.selectedFiles = []
    state.selectedTpl = []
  },
  // 更新时长
  [UPDATE_TIME_GROUP] (state, {tplIndex, region, seconds, listIndex}) {
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

  [IS_MPDP_PAGE] (state, ismpdpPage) {
    state.ismpdpPage = ismpdpPage
  },

  // 保存更新区域的ShowMode信息
  [SET_REGINS_SHOW_MODE] (state, {value, regionIndex}) {
    // if (state.reginsShowMode[tplIndex] === undefined) {
    //   state.reginsShowMode[tplIndex] = []
    // }
    // if (state.reginsShowMode[tplIndex][regionIndex] === undefined) {
    //   state.reginsShowMode[tplIndex][regionIndex] = []
    // }
    // state.reginsShowMode[tplIndex][regionIndex] = value
    state.selectedTpl[0].regions[regionIndex].showMode = value
  },
  [DELETE_REGINS_SHOW_MODE] (state, tplIndex) {
    state.reginsShowMode[0].splice(tplIndex, 1)
  },
  [DELETE_LAST_TPL] (state) {
    state.selectedTpl[0].regions.pop()
  }
}
