<template>
  <div
    @click="showPositionInfo"
    class="card product-card simscoms"
    :data-index="modelIndex"
    :data-id="comData.id"
    :style="{
      width: componentData.width + 'px',
      height: componentData.height + 'px',
      top: componentData.top + 'px',
      left: componentData.leftlength + 'px'
    }">
    <el-popover
      placement="bottom"
      trigger="hover"
      :open-delay="400">
      <div>
        <el-button @click="editModel" type="primary" size="mini">编辑</el-button>
        <el-button @click="copyModel" type="warning" size="mini">复制</el-button>
        <el-button @click="removeModel" type="danger" size="mini">移除</el-button>
      </div>
      <div slot="reference" class="popoverDiv">
        <div
          v-for="(item, index) in attrData"
          :key="item.tname"
          class="popoverChildren"
          :style="{
            top: item.top + 'px',
            left: item.left + 'px',
            width: item.width + 'px',
            height: item.height + 'px',
            color: item.color,
            fontSize: item.size + 'px',
            fontWeight: item.weight
          }">
          <el-image v-if="item.type == 'image'" :src="item.val">
            <div slot="error" style="text-align: center;">图片</div>
          </el-image>
          <div v-else-if="item.type == 'text'">{{item.val}}</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'
import { EditAction } from '../../static/js/editAction.js'

export default {
  components: {

  },

  props: {
    comData: {
      type: Object
    },

    modelIndex: {
      type: Number
    }
  },

  data () {
    return {
      componentData: {},
      attrData: []
    }
  },

  computed: {
    ...mapState({
      simsResetWH: state => state.terminaltemp.simsResetWH
    })
  },

  created () {
    this.initData()
  },

  mounted() {
    window.getSimsActionData = this.getSimsActionData
    this.initEditAction()
  },

  methods: {
    ...mapMutations([
      'DRAG_SIMS_VIEW_MODEL',
      'REMOVE_SIMS_VIEW_DATA'
    ]),

    ...mapActions([
      'dragSimsViewModel',
      'removeSimsViewData'
    ]),

    initData () {
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      let data = JSON.parse(JSON.stringify(this.comData))
      data = data.item_data
      const oldSimsWH = data.simsWH
      for (let i = 0; i < data.comData[0].attr.length; i++) {
        const width = data.comData[0].attr[i].width
        const left = data.comData[0].attr[i].left
        const height = data.comData[0].attr[i].height
        const top = data.comData[0].attr[i].top
        if (width !== undefined) {
          data.comData[0].attr[i].width = Terminaltemp.getNewW(width, oldSimsWH, newSimsWH)
        }
        if (height !== undefined) {
          data.comData[0].attr[i].height = Terminaltemp.getNewH(height, oldSimsWH, newSimsWH)
        }
        data.comData[0].attr[i].left = Terminaltemp.getNewW(left, oldSimsWH, newSimsWH)
        data.comData[0].attr[i].top = Terminaltemp.getNewH(top, oldSimsWH, newSimsWH)
      }
      this.componentData = data
      this.attrData = data.comData[0].attr
    },

    initEditAction () {
      EditAction.Draggable('.simscoms')
    },

    getSimsActionData (event, ui) {
      this.setActionData(event, ui)
    },

    setActionData (event, ui) {
      const id = parseInt(ui.helper[0].attributes['data-id'].value)
      const index = parseInt(ui.helper[0].attributes['data-index'].value)
      const top = parseFloat(ui.position.top)
      const left = parseFloat(ui.position.left)
      const newData = { top: top, left: left, i: index, id: id, t: 'drag' }
      sessionStorage.setItem('position_Data', JSON.stringify(newData))
      this.dragSimsViewModel(newData)
    },

    showPositionInfo (e) {
      let path_index = -1
      const path = e.path
      for (let i = 0; i < path.length; i++) {
        const className = path[i].className
        if (className.search('simscoms') > -1) {
          path_index = i
          break
        }
      }
      if (path_index > -1) {
        const data = path[path_index]
        const id = parseInt(data.attributes['data-id'].value)
        const index = parseInt(data.attributes['data-index'].value)
        const top = parseFloat(data.offsetTop)
        const left = parseFloat(data.offsetLeft)
        const newData = { top: top, left: left, i: index, id: id, t: 'drag' }
        sessionStorage.setItem('position_Data', JSON.stringify(newData))
        this.dragSimsViewModel(newData)
      }
    },

    removeModel () {
      this.$confirm('确定要移除该模块吗？', '提示', {
        type: 'warning'
      }).then(() => {
        Terminaltemp.removeSimsViewModel(this.comData.id).then(res => {          
          if (res.data.success) {
            this.$emit('getActionIndex', { t: 'remove', i: this.modelIndex })
            this.removeSimsViewData(this.modelIndex)
            this.$message({
              message: '移除成功！',
              type: 'success'
            })
          } else {
            this.$alert(res.data.message, '错误', {
              confirmButtonText: '知道了'
            })
          }
        }).catch(() => {
          this.$alert('出错啦，请重试！', '错误', {
            confirmButtonText: '知道了'
          })
        })
      }).catch(() => {})
    },

    editModel () {
      this.$emit('getActionIndex', { t: 'edit', i: this.modelIndex })
    },

    copyModel () {
      this.$emit('getActionIndex', { t: 'copy', i: this.modelIndex })
    }
  },

  watch: {
    comData (v) {
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../static/css/terminaltemp.scss';

  .terminaltemp-index {
    .el-container {
      .product-card {
        overflow: hidden;
        .popoverDiv {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0px;
          left: 0px;
          .popoverChildren {
            position: absolute;
          }
        }
        .el-image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
    }
  }
</style>
