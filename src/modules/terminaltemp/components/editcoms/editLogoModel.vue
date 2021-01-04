<template>
  <div
    class="editcoms"
    :style="{
      width: carouselData.width + 'px',
      height: carouselData.height + 'px',
      top: carouselData.top + 'px',
      left: carouselData.leftlength + 'px'
    }">
    <el-image
      v-if="carouselData.comData.length > 0"
      :src="carouselData.comData[0].mainImg">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
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
      EditAction.Draggable('.editcoms')
      EditAction.Resizable('.editcoms')
    },

    getActionData (event, ui) {
      this.setActionData(event, ui)
    },

    setActionData (event, ui) {
      const type = event.type
      let width = this.carouselData.width
      let height = this.carouselData.height
      let top = this.carouselData.top
      let left = this.carouselData.leftlength
      if (type == 'resizestop') {
        width = parseFloat(ui.size.width)
        height = parseFloat(ui.size.height)
      } else if (type == 'dragstop') {
        top = parseFloat(ui.position.top)
        left = parseFloat(ui.position.left)
      }
      const data = { width: width, height: height, top: top, leftlength: left }
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
    background-color: #EBEEF5;
    .el-image {
      width: 100%;
      height: 100%;
      border-radius: 5%;
    }
  }
</style>
