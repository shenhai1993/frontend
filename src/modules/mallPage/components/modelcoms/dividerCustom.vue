<template>
  <div
    class="divider-custom"
    :name="tagname"
    :style="{
      height: currData.height + 'px'
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
import { mallPage } from '../../static/js/mallPage.js'

export default {
  components: {

  },

  props: {
    comData: {
      type: Object
    },

    tagname: {
      type: String
    }
  },

  data () {
    return {
      currData: {}
    }
  },

  computed: {
    ...mapState({
      simsResetWH: state => state.mallPage.simsResetWH,
      baseWH: state => state.mallPage.baseWH
    })
  },

  created () {
    this.initData()
  },

  methods: {
    initData () {
      const data = JSON.parse(JSON.stringify(this.comData))
      this.currData = JSON.parse(data.comData)
      const oldSimsWH = [parseFloat(this.baseWH[0]), parseFloat(this.baseWH[1])]
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      this.currData.height = mallPage.getNewH(this.currData.height, oldSimsWH, newSimsWH)
      for (let o in this.currData.comData[0]) {
        let val = this.currData.comData[0][o]
        if (val.indexOf('px') > -1) {
          val = val.split('px')
          val[0] = parseInt(val[0]) / 10
          let newVal = {}
          newVal[o] = val[0] + 'rem' + val[1]
          this.currData.comData[0] = Object.assign({}, this.currData.comData[0], newVal)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .divider-custom {
    position: relative;
    width: 100%;
    overflow: hidden;
    > div {
      width: 100%;
      height: 100%;
    }
  }
</style>
