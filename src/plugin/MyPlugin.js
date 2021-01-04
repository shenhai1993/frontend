'use strict'

const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  Vue.directive('focus', {
    inserted: function (el, binding, vnode) {
      vnode.context.autoFocus(el) // 为穿透element-ui
    },
    // 为了dialog重复打开需要update钩子
    componentUpdated: function (el, binding, vnode, oldVnode) {
      vnode.context.autoFocus(el) // 为穿透element-ui
    }
  })

  Vue.mixin({
    data () {
      return {
        autofocusFlag: true // 元素自动获取焦点flag（directive在用户录入时会重复触发update，该flag防止录入时焦点跳转）
      }
    },

    methods: {
      autoFocus (el) {
        if (this.autofocusFlag) {
          let arr = Array.prototype.slice.call(el.childNodes, 0)
          arr.some(node => {
            if (node.autofocus) {
              node.focus()
              return true
            }
          })
        }
      },

      _showDialog (variableName) {
        this[variableName] = true
        this.$nextTick(() => {
          this.autofocusFlag = false
        })
      },

      _hideDialog (variableName) {
        this[variableName] = false
        this.autofocusFlag = true
      }
    }
  })
}
module.exports = MyPlugin
