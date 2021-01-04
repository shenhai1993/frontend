<template>
  <div
    ref="adCarousel"
    class="simscoms adCarousel"
    :class="{'level-state': levelState > 0}"
    @click="showPositionInfo"
    :data-index="modelIndex"
    :data-id="carouselData.id"
    :style="{
      height: carouselData.height + 'px',
      marginTop: carouselData.top + 'px',
      marginBottom: carouselData.top + 'px',
      zIndex: modelIndex + 10
    }">

<!--    <el-popover
      placement="bottom"
      trigger="hover"
      :open-delay="400">
      <div>
        <el-button @click="editModel" type="primary" size="mini">编辑</el-button>
        <el-button @click="removeModel" type="danger" size="mini">移除</el-button>
      </div>
 -->

    <el-carousel
      :interval="4000"
      arrow="always"
      :height="carouselData.height + 'px'">
      <el-carousel-item v-for="item in imgData" :key="item.mainImg">
        <el-image
          :src="item.mainImg">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </el-carousel-item>
    </el-carousel>

<!--    </el-popover> -->

<!--    <i
      v-show="levelState == 1"
      class="icon-delete-outline"
      @click.stop="doDelete()">
    </i>

    <div v-show="levelState == 0" class="one-cover" @click="showPositionInfo"></div>
 -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'
// import { EditAction } from '../../static/js/editAction.js'

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
      carouselData: {},
      imgData: [],
      levelState: 0
    }
  },

  computed: {
    ...mapState({
      simsUpdateAdData: state => state.terminaltemp.simsUpdateAdData,
      commitStatus: state => state.terminaltemp.commitStatus,
      // simsviewDragData: state => state.terminaltemp.simsviewDragData,
    })
  },

  created () {
    this.initData()
  },

  mounted () {
    // window.getSimsActionData = this.getSimsActionData
    // this.initEditAction()
  },

  methods: {
    ...mapMutations([
      // 'DRAG_SIMS_VIEW_MODEL',
      // 'REMOVE_SIMS_VIEW_DATA',
      'SET_INDEXPAGE_EDITDATA',
      'SIMS_UPDATE_AD',
      'UPDATE_SIMS_VIEW_DATA'
    ]),

    ...mapActions([
      // 'dragSimsViewModel',
      // 'removeSimsViewData',
      'setIndexPageEditData',
      'getSimsUpdateAdData',
      'updateSimsViewData'
    ]),

    cencelAdEditFunc (event) {
      const e = event || window.event
      if (this.$refs.adCarousel && !this.$refs.adCarousel.contains(e.target)) {
        const path = e.path
        for (let i = 0; i < path.length; i++) {
          const className = path[i].className
          if (className && className.search('terminaltemp-index-col-3') > -1) {
            return false
          }
        }
        this.levelState = 0
      }
    },

    initData () {
      const data = JSON.parse(JSON.stringify(this.comData))
      let comData = JSON.parse(data.comData)
      comData.id = data.id
      this.carouselData = comData
      this.imgData = this.carouselData.comData
    },

    doDelete () {
      this.$confirm('确定要移除该模块吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.levelState = 0
        this.$emit('getActionIndex', { t: 'remove', i: this.modelIndex })
        this.removeSimsViewData(this.modelIndex)
        this.$message({
          message: '点击右上角 <保存> 后生效！'
        })
      }).catch(() => {})
    },

    initEditAction () {
      EditAction.Draggable('.simscoms', { axis: 'y' })
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
      setTimeout(() => {
        this.levelState = 1
      }, 100)
      // let path_index = -1
      // const path = e.path
      // for (let i = 0; i < path.length; i++) {
      //   const className = path[i].className
      //   if (className.search('simscoms') > -1) {
      //     path_index = i
      //     break
      //   }
      // }
      // if (path_index > -1) {
      //   const data = path[path_index]
      //   const id = parseInt(data.attributes['data-id'].value)
      //   const index = parseInt(data.attributes['data-index'].value)
      //   const top = parseFloat(data.offsetTop)
      //   const left = parseFloat(data.offsetLeft)
      //   const newData = { top: top, left: left, i: index, id: id, t: 'drag' }
      //   sessionStorage.setItem('position_Data', JSON.stringify(newData))
      //   this.dragSimsViewModel(newData)
      // }
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

    commitData () {
      let newData = JSON.parse(JSON.stringify(this.comData))
      let comData = JSON.parse(JSON.stringify(this.carouselData))
      comData.comData = JSON.parse(JSON.stringify(this.imgData))
      newData.comData = JSON.stringify(comData)
      this.updateSimsViewData({ index: this.modelIndex, data: newData })
    }
  },

  beforeDestroy () {
    document.removeEventListener('click', this.cencelAdEditFunc)
  },

  watch: {
    levelState (v) {
      if (v == 0) {
        this.setIndexPageEditData({ name: '' })
        document.removeEventListener('click', this.cencelAdEditFunc)
      } else if (v == 1) {
        const data = JSON.parse(JSON.stringify(this.imgData))
        this.getSimsUpdateAdData(data)
        document.addEventListener('click', this.cencelAdEditFunc)
        this.setIndexPageEditData({ name: 'edit-sims-ad' })
        sessionStorage.setItem('indexpage_edit_model_index', this.modelIndex)
      }
    },

    simsUpdateAdData (v) {
      const index = sessionStorage.getItem('indexpage_edit_model_index') ? parseInt(sessionStorage.getItem('indexpage_edit_model_index')) : -1
      if (index != this.modelIndex) {
        return
      }
      this.imgData = v
    },

    commitStatus (v) {
      const status = v
      if (status) {
        this.commitData()
      }
    }

    // simsviewDragData (v) {
    //   for (let o in v) {
    //     if (this.comData.key == o) {
    //       const data = JSON.parse(v[o])
    //       this.carouselData = Object.assign({}, this.carouselData, { top: data.top })
    //       break
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
  .adCarousel {
    position: relative;
    width: 100%;
    cursor: pointer;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .show-icon-delete {
    transform: translateX(-43px);
  }
  .one-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    cursor: pointer;
    z-index: 5;
  }
  .one-cover:hover, .level-state {
    border: 1px solid #3F94EF;
  }
  .icon-delete {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 5px;
    right: 5px;
    background-image: url(../../static/images/icon-delete.png);
    background-size: 100%;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .icon-delete-outline {
    position: absolute;
    width: 43px;
    height: 20px;
    top: 50%;
    right: -43px;
    transform: translateY(-50%);
    background-image: url(../../static/images/icon-delete-outline.png);
    background-size: 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    z-index: 5;
  }
</style>
