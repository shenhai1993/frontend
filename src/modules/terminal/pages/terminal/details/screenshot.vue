<template>
  <div class="updatafre"
       v-loading='isLoading'
       element-loading-background="rgba(255, 255, 255, 0.1)">
    <el-form>
      <el-form-item>
        <header>
          <span v-if="!isLoading && !loaded">
            <i class="fa fa-info-circle warning"></i>
            更新失败
          </span>
          <span v-if="!isLoading && loaded">
            <i class="fa fa-check-circle-o"></i>
            更新完成
          </span>
          <span v-if="isLoading">
            <i class="fa fa-circle-o-notch" style=" animation: loading 2s infinite;
                       -webkit-animation: loading 2s infinite;"></i>
            正在更新
          </span>
          <div>
            刷新频率
                <el-select v-model="value">
                  <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
          </div>
        </header>
        <section class="m-t-20">
          <img :src="imgSrc" alt="">
        </section>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Terminal from '@/modules/terminal/static/js/TerminalGroup'
// import moment from 'moment'

export default {
  props: ['activeterminal', 'activeName'],
  watch: {
    activeName (v, ov) {
      if (v === 'screenshot') {
        this._beginTimeout()
      } else {
        this._clearTimeout()
      }
    }
  },
  data () {
    return {
      options: [{
        value: '15',
        label: '15s'
      }, {
        value: '20',
        label: '20s'
      }, {
        value: '30',
        label: '30s'
      }],
      value: '15',
      imgSrc: '',
      isLoading: false,
      sreenShot: '',
      currentRequestTime: '',
      loaded: false
    }
  },
  methods: {
    getScreenShot (number) {
      this.isLoading = true
      this.loaded = false

      Terminal.screenshot(number)
        .then(res => {
          let date = new Date()

          let nocache = new Date().valueOf()
          this.imgSrc = `${res.data.message}?${nocache}`
          this.isLoading = false
          this.loaded = true
          // this.currentRequestTime = moment().format('HH:mm:ss')
          // 成功之后相隔一定时间再次请求
          if (this.activeName !== 'screenshot') {
            return
          }
          this.sreenShot = setTimeout(() => {
            this._beginTimeout()
          }, 1000 * Number(this.value))
        })
        .catch(err => {
          console.log(err)
          this.isLoading = false
          this._clearTimeout()
        })
    },
    _clearTimeout () {
      // http.abort()
      clearTimeout(this.sreenShot)
    },
    _beginTimeout () {
      if (String(this.activeterminal.online_status) === '0') {
        this._offLineNotice()
        return
      }
      this.getScreenShot(this.activeterminal.number)
    },
    _offLineNotice () {
      this.$notify({
        title: '提示',
        message: '此终端处于离线状态，无屏幕截图！',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="sass">
  .updatafre
    header
      span
        .fa-check-circle-o
          font-size: 14px;
          color: #13CE66;
      div
        display: inline-block;
        float: right;
        .el-select
          width: 75px;
          height: 20px;
          margin-left: 10px;
          .el-input__inner
            height: 20px;
          .el-input
            font-size: 12px;
            width: 100%!important;
            .el-input__icon
              line-height: 1px;
            .el-input__icon+.el-input__inner
              padding-right: 20px;
    section
      img
        width: 100%;
        height: auto;

  .el-popper[x-placement^=bottom]
    margin-top: 0;

  .fa-circle-o-notch
    color: #409EFF;

</style>
