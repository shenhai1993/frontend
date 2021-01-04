<template>
  <div
    class="editcoms"
    :style="{
      height: carouselData.height + 'px',
      top: carouselData.top + 'px',
    }">
    <el-carousel
      :interval="4000"
      arrow="always"
      :height="carouselData.height + 'px'">
      <el-carousel-item v-for="item in carouselData.comData" :key="item.mainImg">
        <el-image
          :src="item.mainImg">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { EditAction } from '../../static/js/editAction.js'
import { Terminaltemp } from '../../static/js/terminaltemp.js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {

  },

  props: {
    comData: {
      type: Object
    }
  },

  data () {
    return {
      carouselData: this.comData
    }
  },

  created () {

  },

  mounted () {
    window.getActionData = this.getActionData
    this.initEditAction()
  },

  methods: {
    initEditAction () {
      EditAction.Resizable('.editcoms', 's')
    },

    getActionData (event, ui) {
      this.setActionData(event, ui)
    },

    setActionData (event, ui) {
      const height = parseFloat(ui.size.height)
      const data = { height: height }
      this.setCarouselData(data)
    },

    setCarouselData (data) {
      this.carouselData = Object.assign({}, this.carouselData, data)
      this.$emit('currentModelDataEmit', JSON.parse(JSON.stringify(this.carouselData)))
    }
  }
}
</script>

<style lang="scss" scoped>
  .editcoms{
    width: 100%;
    left: 0px;
    background-color: #EBEEF5;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
</style>
