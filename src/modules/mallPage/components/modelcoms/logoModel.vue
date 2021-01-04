<template>
  <div
    class="logo-model"
    :name="tagname"
    :style="{
      width: carouselData.width + 'px',
      height: carouselData.height + 'px',
      marginTop: carouselData.top + 'px',
      marginBottom: carouselData.top + 'px',
      marginLeft: carouselData.leftlength + 'px'
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
      this.carouselData.width = mallPage.getNewW(this.carouselData.width, oldSimsWH, newSimsWH)
      this.carouselData.leftlength = mallPage.getNewW(this.carouselData.leftlength, oldSimsWH, newSimsWH)
      this.carouselData.height = mallPage.getNewH(this.carouselData.height, oldSimsWH, newSimsWH)
      this.carouselData.top = mallPage.getNewH(this.carouselData.top, oldSimsWH, newSimsWH)
      this.imgData = this.carouselData.comData
    }
  }
}
</script>

<style lang="scss" scoped>
  .logo-model {
    position: relative;
    .el-image {
      width: 100%;
      height: 100%;
      border-radius: 0.625rem;
    }
  }
</style>
