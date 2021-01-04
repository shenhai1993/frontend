<template>
  <div
    ref="adCustom"
    class="simscoms adCustom"
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
    <div
      v-for="(item, index) in imgData"
      :key="item.key"
      class="adCustom-item"
      :class="{'editcoms-img': item.type == 'image', 'editcoms-txt': item.type == 'text', 'level-state': levelState == 2 && editIndex == index}"
      @click="editContent(index, item)"
      :style="{
        top: item.top + 'px',
        left: item.left + 'px',
        width: item.width + 'px',
        height: item.height + 'px',
        color: item.color,
        fontSize: item.size + 'px'
      }">
      <img v-if="item.type == 'image'" :src="item.val" />
      <span v-else-if="item.type == 'text'">{{item.val}}</span>
    </div>
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
      levelState: 0,
      editIndex: -1,
      clickState: false
    }
  },

  computed: {
    ...mapState({
      simsEditAdCustomData: state => state.terminaltemp.simsEditAdCustomData,
      commitStatus: state => state.terminaltemp.commitStatus
    })
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapMutations([
      'SET_INDEXPAGE_EDITDATA',
      'UPDATE_SIMS_VIEW_DATA',
      'SIMS_EDIT_ADCUSTOM'
    ]),

    ...mapActions([
      'setIndexPageEditData',
      'updateSimsViewData',
      'getSimsEditAdCustomData'
    ]),

    cencelAdEditFunc (event) {
      const e = event || window.event
      if (this.$refs.adCustom && !this.$refs.adCustom.contains(e.target)) {
        const path = e.path
        for (let i = 0; i < path.length; i++) {
          const className = path[i].className
          if (className && className.search('terminaltemp-index-col-3') > -1) {
            return false
          }
        }
        this.levelState = 0
        this.editIndex = -1
      }
    },

    initData () {
      const data = JSON.parse(JSON.stringify(this.comData))
      let comData = JSON.parse(data.comData)
      comData.id = data.id
      this.carouselData = comData
      this.imgData = this.carouselData.comData
    },

    editContent (i, data) {
      this.clickState = true
      if (this.editIndex == i) {
        setTimeout(() => {
          this.clickState = false
        }, 200)
        return
      }
      setTimeout(() => {
        this.clickState = false
        this.levelState = 2
        this.editIndex = i
        const newData = {
          type: data.type,
          i: i,
          val: data.val
        }
        setTimeout(() => {
          this.getSimsEditAdCustomData(newData)
        }, 0)
      }, 200)
    },

    showPositionInfo (e) {
      if (this.clickState) {
        return
      }
      setTimeout(() => {
        this.levelState = 1
        this.editIndex = -1
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
      document.removeEventListener('click', this.cencelAdEditFunc)
      if (v == 0) {
        this.setIndexPageEditData({ name: '' })
      } else if (v == 1) {
        this.setIndexPageEditData({ name: '' })
        document.addEventListener('click', this.cencelAdEditFunc)
      } else if (v == 2) {
        if (this.editIndex > -1) {
          this.setIndexPageEditData({ name: 'edit-ad-custom' })
          sessionStorage.setItem('indexpage_edit_model_index', this.modelIndex)
        } else {
          this.setIndexPageEditData({ name: '' })
        }
        document.addEventListener('click', this.cencelAdEditFunc)
      }
    },

    editIndex (v) {
      if (v > -1 && this.levelState == 2) {
        this.setIndexPageEditData({ name: 'edit-ad-custom' })
        sessionStorage.setItem('indexpage_edit_model_index', this.modelIndex)
      } else {
        this.setIndexPageEditData({ name: '' })
      }
    },

    simsEditAdCustomData (v) {
      const index = sessionStorage.getItem('indexpage_edit_model_index') ? parseInt(sessionStorage.getItem('indexpage_edit_model_index')) : -1
      if (index != this.modelIndex) {
        return
      }
      let newData = JSON.parse(JSON.stringify(this.imgData[v.i]))
      newData.val = v.val
      this.imgData.splice(v.i, 1, newData)
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
  .adCustom{
    position: relative;
    width: 100%;
    overflow: hidden;
    .adCustom-item {
      position: absolute;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .editcoms-img {
      z-index: 0;
    }
    .editcoms-txt {
      z-index: 1;
    }
  }
  .level-state {
    border: 1px solid #3F94EF;
  }
</style>
