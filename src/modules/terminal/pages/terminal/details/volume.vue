<template>
  <div class="volume">
    <el-form>
      <el-form-item>
        <div>
          <span>静音：</span>
          <el-checkbox v-model="checked" @change="checkboxChange"></el-checkbox>
        </div>
        <div>
          <span>默认音量：</span>
          <el-slider v-model="activeterminal.volume" @change="sliderChange"></el-slider>
        </div>
        <div class="m-t-15 text-center">
          <el-button size='small' @click='click_save'>保存</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TerminalGroup from '../../../static/js/TerminalGroup.js'

export default {
  props: ['activeterminal'],
  data () {
    return {
      checked: false
    }
  },
  methods: {
    click_save () {
      if (this.checked) {
        this.activeterminal.volume = 0
      }
      if (this.activeterminal.volume === 0) {
        this.checked = true
      }
      let data = {volume: this.activeterminal.volume}
      TerminalGroup
        .volume(this.activeterminal.number, data)
        .then(res => {
          this.$notify({
            title: '提示',
            message: '音量设置成功！',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },

    checkboxChange (val) {
      if (val) this.activeterminal.volume = 0
    },

    sliderChange (val) {
      this.checked = (val === 0)
    }
  }
}
</script>

<style lang="sass">
  .volume
    > div
      line-height: 35px
      &:nth-child(2)
        > span
        vertical-align: sub
      > span
        display: inline-block
        width: 100px
        text-align: right
      .el-checkbox
        .el-checkbox__inner
          width: 14px!important
          height: 14px!important
          &::after
            height: 6px
            left: 3px
        .el-checkbox__label
          font-size: 12px
  .el-slider
    display: inline-block
    width: 240px
    .el-slider__runway
      margin: 0
</style>
