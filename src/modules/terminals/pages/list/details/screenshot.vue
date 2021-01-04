<template>
  <div class="updatafre" v-loading='isLoading' element-loading-background="rgba(255, 255, 255, 0.1)">
    <el-form>
      <el-form-item>
        <header>
          <span>
            <i class="fa fa-check-circle-o" v-if="!isLoading"></i>
            <i class="fa fa-circle-o-notch"
               style=" animation: loading 2s infinite;
                       -webkit-animation: loading 2s infinite;" v-if="isLoading"></i>
            更新完成 {{ currentRequestTime }}
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
import http from '../../../../../../static/js/utils/http.js'
import moment from 'moment'

export default {
  props: ['activeterminal', 'isclearInterval', 'activeName'],
  watch: {
    isclearInterval (newV, oldV) {
      if (newV) {
        this._clearTimeout()
      }
    },
    activeName (v, ov) {
      if (v === 'screenshot') {
        this._beginTimeout()
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
      currentRequestTime: ''
    }
  },
  methods: {
    getSreenShot (number) {
      let me = this
      me.isLoading = true
      http.get(`terminals/screenshot/${number}`)
        .then(res => {
          let date = new Date()
          me.imgSrc = res.data.img_url + '?date=' + date
          me.isLoading = false
          me.currentRequestTime = moment().format('HH:mm:ss')
          // 成功之后相隔一定时间再次请求
          me.sreenShot = setTimeout(function () {
            me._beginTimeout()
          }, 1000 * Number(me.value))
        })
        .catch(err => {
          console.log(err)
          me.isLoading = false
          me._clearTimeout()
        })
    },
    _clearTimeout () {
      // http.abort()
      clearTimeout(this.sreenShot)
    },
    _beginTimeout () {
      let me = this
      if (String(this.activeterminal.online_status) === '0') {
        this._offLineNotice()
        return
      }
      me.getSreenShot(me.activeterminal.number)
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
