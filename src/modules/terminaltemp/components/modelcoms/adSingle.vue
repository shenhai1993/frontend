<template>
  <div
    ref="adSingle"
    class="simscoms adSingle"
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
    <el-image
      :src="imgData.length > 0 ? imgData[0].mainImg : ''">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'

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
      simsUpdateAdsingleData: state => state.terminaltemp.simsUpdateAdsingleData,
      commitStatus: state => state.terminaltemp.commitStatus
    })
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapMutations([
      'SET_INDEXPAGE_EDITDATA',
      'SIMS_UPDATE_ADSINGLE',
      'UPDATE_SIMS_VIEW_DATA'
    ]),

    ...mapActions([
      'setIndexPageEditData',
      'getSimsUpdateAdsingleData',
      'updateSimsViewData'
    ]),

    cencelAdEditFunc (event) {
      const e = event || window.event
      if (this.$refs.adSingle && !this.$refs.adSingle.contains(e.target)) {
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

    showPositionInfo (e) {
      setTimeout(() => {
        this.levelState = 1
      }, 100)
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
        this.getSimsUpdateAdsingleData(data)
        document.addEventListener('click', this.cencelAdEditFunc)
        this.setIndexPageEditData({ name: 'edit-sims-adsingle' })
        sessionStorage.setItem('indexpage_edit_model_index', this.modelIndex)
      }
    },

    simsUpdateAdsingleData (v) {
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
  }
}
</script>

<style lang="scss" scoped>
  .adSingle{
    position: relative;
    width: 100%;
    cursor: pointer;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .level-state {
    border: 1px solid #3F94EF;
  }
</style>
