<template>
  <div ref="irregular" class="irregular-index">
    <div class="index-row">
      <div class="index-col-1">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="设置" name="1">
            <div class="index-col-1-input">角度：<el-input v-model.number="currRotate" placeholder="请输入" @input="rotateInput" clearable></el-input></div>
            <div v-show="!isRotate" style="color: #ff0000; padding-left: 52px;">请输入整数</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="index-col-2">
        <div
         v-for="(item, index) in listData"
         :key="item.key"
         :data-key="item.key"
         :data-index="index"
         @click="irregularSelected(index)"
         class="irregular-screen-list"
         :style="{
           width: item.width + 'px',
           height: item.height + 'px',
           top: item.top + 'px',
           left: item.left + 'px',
           transform: 'rotate(' + item.rotate + 'deg)',
           backgroundColor: item.background,
           zIndex: item.zindex,
           lineHeight: item.height + 'px'
         }">
         <span>{{ index + 1 }}</span>
         <div v-show="index == currIndex" class="irregular-screen-list-icon-nw"></div>
         <div v-show="index == currIndex" class="irregular-screen-list-icon-ne"></div>
         <div v-show="index == currIndex" class="irregular-screen-list-icon-se"></div>
         <div v-show="index == currIndex" class="irregular-screen-list-icon-sw"></div>
        </div>
        <div class="edit-btn">
          <ul>
            <li><el-button type="text" icon="el-icon-plus" @click="irregularAddScreen(1)"></el-button></li>
            <li><el-button type="text" icon="el-icon-delete" @click="irregularAddScreen(0)"></el-button></li>
          </ul>
        </div>
      </div>
      <div class="index-col-3">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="素材" name="1"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'

export default {
  data () {
    return {
      activeName: '1',
      currRotate: '',
      defaultData: {
        key: 0,
        width: 192,
        height: 108,
        top: 60,
        left: 300,
        rotate: 0,
        background: '#409eff',
        zindex: 0
      },
      listData: [],
      currIndex: 0,
      isRotate: true
    }
  },

  methods: {
    rotateInput () {
      this.isRotate = /^(\-|\+)?\d+$/.test(this.currRotate)
      if (this.isRotate) {
        const data = Object.assign({}, this.listData[this.currIndex], { rotate: this.currRotate })
        this.listData.splice(this.currIndex, 1, data)
      }
    },

    randomHexColor () {
      let hex = Math.floor(Math.random() * 16777216).toString(16)
      while (hex.length < 6) {
        hex = '0' + hex
      }
      return '#' + hex
    },

    irregularSelected (v) {
      if (v == this.currIndex) {
        this.currRotate = this.listData[this.currIndex].rotate
        return
      }
      if (this.currIndex < this.listData.length) {
        const data = Object.assign({}, this.listData[this.currIndex], { zindex: 0 })
        this.listData.splice(this.currIndex, 1, data)
      }
      this.$nextTick(() => {
        this.currIndex = parseInt(v)
        const data = Object.assign({}, this.listData[this.currIndex], { zindex: 1 })
        this.listData.splice(this.currIndex, 1, data)
        this.currRotate = data.rotate
      })
    },

    irregularDraggable (selector, key) {
      $(selector).draggable({
        addClasses: false,
        containment: 'parent',
        cursor: 'move',
        snap: true,
        snapTolerance: 10,
        start: (event, ui) => {
          const _index = ui.helper[0].attributes['data-index'].value
          this.irregularSelected(_index)
        },
        stop: (event, ui) => {
          const _key = ui.helper[0].attributes['data-key'].value
          if (_key == key) {
            //console.log(_key, event, ui)
          }
        }
      })
    },

    irregularAddScreen (v) {
      if (v == 1) {
        const index = this.listData.length
        this.defaultData.key += 1
        let data = JSON.parse(JSON.stringify(this.defaultData))
        data.background = this.randomHexColor()
        this.listData.splice(index, 0, data)
        this.currIndex = index
        this.irregularSelected(index)
        this.$nextTick(() => {
          const selector = '[data-key=' + this.defaultData.key + ']'
          this.irregularDraggable(selector, this.defaultData.key)
        })
      } else {
        if (this.listData.length <= 0) {
          this.currRotate = ''
          return
        }
        this.$confirm('确定要移除' + (this.currIndex + 1) + '号屏吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listData.splice(this.currIndex, 1)
          this.$nextTick(() => {
            this.currIndex = 0
            if (this.listData.length > 0) {
              this.irregularSelected(this.currIndex)
            } else {
              this.currRotate = ''
            }
          })
        }).catch(() => {})
      }
      //console.log('listData: ', this.listData)
    }
  }
}
</script>

<style lang="scss">
  .irregular-index {
    .el-tabs__nav-scroll {
      background-color: #909399;
      padding: 5px 0 0 10px;
      .el-tabs__nav {
        background-color: #F2F6FC;
        .el-tabs__item {
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .irregular-index {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    overflow: auto;
    .index-row {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .index-col-1, .index-col-2, .index-col-3 {
        float: left;
        height: 100%;
        box-sizing: border-box;
      }
      .index-col-1 {
        width: 200px;
      }
      .index-col-2 {
        position: relative;
        width: calc(100% - 400px);
        background-color: #EBEEF5;
        .edit-btn {
          position: absolute;
          width: 36px;
          top: 20px;
          right: 20px;
          box-shadow: 0 1px 5px 2px #DFE3E9;
          background-color: #FFFFFF;
          z-index: 2;
          .el-button {
            width: 100%;
          }
        }
        .irregular-screen-list {
          position: absolute;
          font-size: 16px;
          color: #FFFFFF;
          text-align: center;
          transform-origin: 0 0;
          .irregular-screen-list-icon-nw, .irregular-screen-list-icon-ne, .irregular-screen-list-icon-se, .irregular-screen-list-icon-sw {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background-color: #FFFFFF;
          }
          .irregular-screen-list-icon-nw {
            top: -4px;
            left: -4px;
          }
          .irregular-screen-list-icon-ne {
            top: -4px;
            right: -4px;
          }
          .irregular-screen-list-icon-se {
            bottom: -4px;
            left: -4px;
          }
          .irregular-screen-list-icon-sw {
            bottom: -4px;
            right: -4px;
          }
        }
      }
      .index-col-3 {
        float: right;
        width: 200px;
      }
      .index-col-1-input {
        font-size: 14px;
        padding: 0 10px;
        .el-input {
          width: calc(100% - 45px);
        }
      }
    }
  }
</style>
