<template>
  <div
    ref="dividerCustom"
    class="simscoms dividerCustom"
    :class="{'level-state': levelState > 0}"
    @click="showPositionInfo"
    :data-index="modelIndex"
    :data-id="currData.id"
    :style="{
      height: currData.height + 'px',
      zIndex: modelIndex + 10
    }">
    <div
      :style="{
        backgroundColor: currData.comData[0].bgcolor,
        borderTop: currData.comData[0].borderTop,
        borderRight: currData.comData[0].borderRight,
        borderBottom: currData.comData[0].borderBottom,
        borderLeft: currData.comData[0].borderLeft
      }"></div>
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
      currData: {},
      levelState: 0
    }
  },

  computed: {
    ...mapState({
      commitStatus: state => state.terminaltemp.commitStatus
    })
  },

  created () {
    this.initData()
  },

  methods: {
    ...mapMutations([
      'UPDATE_SIMS_VIEW_DATA'
    ]),

    ...mapActions([
      'updateSimsViewData'
    ]),

    cencelAdEditFunc (event) {
      const e = event || window.event
      if (this.$refs.dividerCustom && !this.$refs.dividerCustom.contains(e.target)) {
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
      this.currData = comData
    },

    showPositionInfo (e) {
      setTimeout(() => {
        this.levelState = 1
      }, 100)
    },

    commitData () {
      this.updateSimsViewData({ index: this.modelIndex, data: this.comData })
    }
  },

  beforeDestroy () {
    document.removeEventListener('click', this.cencelAdEditFunc)
  },

  watch: {
    levelState (v) {
      if (v == 0) {
        document.removeEventListener('click', this.cencelAdEditFunc)
      } else if (v == 1) {
        document.addEventListener('click', this.cencelAdEditFunc)
      }
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
  .dividerCustom {
    position: relative;
    width: 100%;
    overflow: hidden;
    > div {
      width: 100%;
      height: 100%;
    }
  }
  .level-state {
    border: 1px solid #3F94EF;
  }
</style>
