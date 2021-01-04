<template>
  <div
    class="ad-custom"
    :name="tagname"
    :style="{
      height: carouselData.height + 'px',
      marginTop: carouselData.top + 'px',
      marginBottom: carouselData.top + 'px'
    }">
    <div
      v-for="(item, index) in imgData"
      :key="item.key"
      class="adCustom-item"
      :style="{
        top: item.top + 'px',
        left: item.left + 'px',
        width: item.width + 'px',
        height: item.height + 'px',
        color: item.color,
        fontSize: item.size / 10 + 'rem'
      }">
      <img v-if="item.type == 'image'" :src="item.val" />
      <span v-else-if="item.type == 'text'">{{item.val}}</span>
    </div>
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
      carouselData: {},
      imgData: [],
      oldSimsWH: [],
      newSimsWH: []
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

  mounted () {

  },

  methods: {
    initData () {
      let data = JSON.parse(JSON.stringify(this.comData))
      this.carouselData = JSON.parse(data.comData)
      const oldSimsWH = [parseFloat(this.baseWH[0]), parseFloat(this.baseWH[1])]
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      this.carouselData.height = mallPage.getNewH(this.carouselData.height, oldSimsWH, newSimsWH)
      this.carouselData.top = mallPage.getNewH(this.carouselData.top, oldSimsWH, newSimsWH)
      this.carouselData.width = mallPage.getNewW(this.carouselData.width, oldSimsWH, newSimsWH)
      this.carouselData.leftlength = mallPage.getNewW(this.carouselData.leftlength, oldSimsWH, newSimsWH)
      this.imgData = this.carouselData.comData
      for (let i = 0; i < this.imgData.length; i++) {
        if (this.imgData[i].type == 'image') {
          this.imgData[i].width = mallPage.getNewW(this.imgData[i].width, oldSimsWH, newSimsWH)
          this.imgData[i].height = mallPage.getNewH(this.imgData[i].height, oldSimsWH, newSimsWH)
        }
        this.imgData[i].top = mallPage.getNewH(this.imgData[i].top, oldSimsWH, newSimsWH)
        this.imgData[i].left = mallPage.getNewW(this.imgData[i].left, oldSimsWH, newSimsWH)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .ad-custom{
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
  }
</style>
