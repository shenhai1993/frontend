<template>
  <el-carousel
    class="ad-carousel"
    :name="tagname"
    :interval="4000"
    arrow="always"
    :height="carouselData.height + 'px'"
    :style="{
      marginTop: carouselData.top + 'px',
      marginBottom: carouselData.top + 'px'
    }">
    <el-carousel-item v-for="item in imgData" :key="item.mainImg">
      <el-image
        :src="item.mainImg">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { mallPage } from '../../static/js/mallPage.js'
import { mapState, mapMutations, mapActions } from 'vuex'

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
      imgData: []
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
      const data = JSON.parse(JSON.stringify(this.comData))
      this.carouselData = JSON.parse(data.comData)
      const oldSimsWH = [parseFloat(this.baseWH[0]), parseFloat(this.baseWH[1])]
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      this.carouselData.height = mallPage.getNewH(this.carouselData.height, oldSimsWH, newSimsWH)
      this.carouselData.top = mallPage.getNewH(this.carouselData.top, oldSimsWH, newSimsWH)
      this.imgData = this.carouselData.comData
    }
  }
}
</script>

<style lang="scss" scoped>
  .ad-carousel {
    position: relative;
    width: 100%;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
</style>
