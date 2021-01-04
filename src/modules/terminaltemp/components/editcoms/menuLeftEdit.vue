<template>
  <div
    class="menu-left"
    :class="{ 'level-state': posData.index == currCustomData.key }"
    :data-key="currCustomData.key"
    @click.stop="getPositionData()"
    :style="{
      fontSize: currCustomData.size + 'px',
      color: currCustomData.color,
      width: currCustomData.width + 'px',
      height: currCustomData.height + 'px',
      top: currCustomData.top + 'px',
      left: currCustomData.left + 'px'
    }">
    <ul>
      <li>分类 1</li>
      <li>分类 2</li>
      <li>分类 3</li>
      <li>分类 4</li>
      <li>分类 5</li>
    </ul>
  </div>
</template>

<script>
import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/resizable'

export default {
  props: {
    itemData: {
      type: Object
    },

    state: {
      type: Boolean
    },

    posData: {
      type: Object
    },

    posWatch: {
      type: Object
    }
  },

  data () {
    return {
      currCustomData: {}
    }
  },

  created () {
    this.currCustomData = JSON.parse(JSON.stringify(this.itemData))
  },

  mounted () {
    this.initEditAction()
  },

  methods: {
    initEditAction () {
      $('.menu-left[data-key=' + this.currCustomData.key + ']').draggable({
        containment: 'parent',
        cursor: 'move',
        stop: (event, ui) => {
          this.getDraggableData(event, ui)
        }
      })
      $('.menu-left[data-key=' + this.currCustomData.key + ']').resizable({
        containment: 'parent',
        stop: (event, ui) => {
          this.getResizableData(event, ui)
        }
      })
    },

    getDraggableData (event, ui) {
      const top = parseFloat(ui.position.top)
      const left = parseFloat(ui.position.left)
      this.currCustomData = Object.assign({}, this.currCustomData, { top: top, left: left })
    },

    getResizableData (event, ui) {
      const width = parseFloat(ui.size.width)
      const height = parseFloat(ui.size.height)
      this.currCustomData = Object.assign({}, this.currCustomData, { width: width, height: height })
    },

    getPositionData () {
      const data = {
        type: 'image',
        index: this.currCustomData.key,
        active: 'drag',
        size: this.currCustomData.size,
        color: this.currCustomData.color,
        top: Math.round(this.currCustomData.top),
        left: Math.round(this.currCustomData.left),
        width: Math.round(this.currCustomData.width),
        height: Math.round(this.currCustomData.height)
      }
      this.$emit('getItemData', data)
    },

    commitData () {
      let subData = JSON.parse(sessionStorage.getItem('product_custom_submit_data'))
      let index = -1
      for (let i = 0; i < subData.length; i++) {
        if (subData[i].key == this.currCustomData.key) {
          subData.splice(i, 1, this.currCustomData)
          break
        }
      }
      sessionStorage.setItem('product_custom_submit_data', JSON.stringify(subData))
    }
  },

  watch: {
    state (v) {
      if (v) {
        this.commitData()
      }
    },

    posWatch (v) {
      if (this.currCustomData.key == v.index) {
        let data = {}
        data[v.type] = v.val
        this.currCustomData = Object.assign({}, this.currCustomData, data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-left {
    position: absolute;
    width: 0px;
    height: 0px;
    left: 0px;
    top: 0px;
    padding: 5px 0;
    border-radius: 6px;
    box-shadow: 0 1px 5px 2px #DFE3E9;
    background-color: #FFFFFF;
    overflow: hidden;
    ul {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      li {
        width: 80%;
        padding: 15.3% 0;
        margin: 0 auto;
        text-align: center;
      }
      li + li {
        border-top: 1px solid #DFE3E9;
      }
    }
    ul::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    ul::-webkit-scrollbar-thumb {
      background: transparent;
    }
    ul::-webkit-scrollbar-track {
      background: transparent;
    }
  }
  .level-state {
    border: 1px solid #3F94EF;
  }
</style>
