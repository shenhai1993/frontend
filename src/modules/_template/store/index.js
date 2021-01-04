'use strict'
// initial state
import http from '../../../../static/js/utils/http'
import Vue from 'vue'
export default {
  state: {
    count: 0,
    tpl: {},
    zoom: 1.0,
    // 当前选中的区域
    current_region: null,
    current_region_id: ''
  },
  mutations: {
    increment (state, n = 1) {
      // Vuex 的 store 中的状态的唯一方法是提交 mutation
      state.count += n
    },
    // 装载模板数据
    setTemplate (state, data) {
      state.tpl = data
      state.tpl.data.forEach(function (node) {
        if (node.selected) {
          state.current_region = node
        }
      })
    },
    // 设置缩放的值
    SET_ZOOM (state, data) {
      state.zoom = data
    },
    // 选中区域
    SELECT_REGION (state, data) {
      if (state.current_region) {
        if (state.current_region === data) {
          return
        }
      }
      state.current_region = data
    },
    // 修改区域的位置和大小
    SET_CURRREGION_RECT (state, ps) {
      if (ps.top !== undefined) {
        state.current_region.top = ps.top
      }
      if (ps.left !== undefined) {
        state.current_region.left = ps.left
      }
      if (ps.width) {
        state.current_region.width = ps.width
      }
      if (ps.height) {
        state.current_region.height = ps.height
      }
    },
    // 当前区域，增加一个文件
    SET_REGION_ELEMENTS (state, elem) {
      if (!state.current_region.elements) {
        Vue.set(state.current_region, 'elements', [])
      }
      state.current_region.elements.push(elem)
    }
  },
  actions: {
    // Action 类似于 mutation，不同在于：
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。
    loadTemplate (context, id) {
      http.get(`web/templates?id=${id}`).then((resp) => {
        let tpl = resp.data
        if (!tpl.data) {
          tpl.data = []
        }
        context.commit('setTemplate', tpl)
      })
    },
    storeAutoZoom (context, tpl) {
      let zoom = 1.0
      if (parseInt(tpl.direction) === 0) { // 横屏
        zoom = (document.body.clientWidth - 320) / tpl.width
      } else { // 竖屏
        zoom = (document.body.clientHeight - 180) / tpl.height
      }
      zoom = zoom.toFixed(1)
      zoom = zoom > 1 ? 1 : (zoom < 0.4 ? 0.4 : zoom)
      // zoom = 1
      context.commit('SET_ZOOM', zoom)
    }
  }
}
