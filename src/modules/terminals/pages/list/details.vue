<template>
  <div calss="terminal-info">
    <header>
      <i class="el-icon-circle-close"
         @click='click_close'></i>
      <h2>{{ activeterminal.name}}</h2>
      <small>{{ activeterminal.number }}</small>
    </header>
    <section class="m-t-20 info">
      <ul>
        <!-- <li class="clearfix float">
          <div class='ellipsis'>所属分组</div>
          <div class="ellipsis">{{ activeterminal.group_name }}</div>
        </li> -->
        <li class="clearfix float">
          <div class='ellipsis'>IP地址</div>
          <div class="ellipsis">{{ activeterminal.ip }}</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>网络</div>
          <div class="ellipsis">WIFI</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>信号</div>
          <div class="ellipsis">强</div>
        </li>
         <li class="clearfix float">
          <div class='ellipsis'>注册时间</div>
          <div class="ellipsis" :title="activeterminal.created_at">{{ activeterminal.created_at | fromnow }}</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>安装地址</div>
          <div class="ellipsis">{{ activeterminal.address }}</div>
        </li>
      </ul>
    </section>
    <section class="m-t-20 info">
      <el-tabs @tab-click="handleClick" v-model="activeName">
        <!-- <el-tab-pane name="playlist">
          <span slot="label"><i class="fa fa-play"></i><br/>播出单</span>
          <playlist></playlist>
        </el-tab-pane> -->
        <el-tab-pane name="download">
          <span slot="label">
            <!-- <i class="fa fa-download"></i><br/> -->
            下载监控
          </span>
          <download :activeName='activeName'
                    :isclearInterval='isclearInterval'
                    :activeterminal='activeterminal'></download>
        </el-tab-pane>
        <el-tab-pane name="screenshot">
          <span slot="label">
            <!-- <i class="fa fa-cut"></i><br/> -->
            屏幕截图
          </span>
          <screenshot :activeterminal='activeterminal'
                      :isclearInterval='isclearInterval'
                      :activeName='activeName'></screenshot>
        </el-tab-pane>
        <el-tab-pane name="volume">
          <span slot="label">
            <!-- <i class="fa fa-volume-up"></i><br/> -->
            默认音量
          </span>
          <volume :activeterminal='activeterminal'></volume>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script>
import playlist from './details/playlist.vue'
import screenshot from './details/screenShot.vue'
import download from './details/download.vue'
import volume from './details/volume.vue'

export default {
  props: ['activeterminal', 'clearIntervalFromParent'],
  watch: {
    clearIntervalFromParent (newV, oldV) {
      if (newV) {
        this.click_close()
        this.$emit('update: clearIntervalFromParent', false)
      }
    }
  },
  components: {
    playlist, screenshot, download, volume
  },
  data () {
    return {
      showDetails: false,
      activeName: 'download',
      isclearInterval: false
    }
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'screenshot') {
        this.isclearInterval = false
      } else {
        this.isclearInterval = true
      }
    },
    click_close () {
      let self = this
      this.isclearInterval = true
      setTimeout(function () {
        self.$emit('showDetails', false)
      }, 10)
    }
  }
}
</script>

<style lang="sass" scoped>
  section
    position: relative;
    ul
      li.float
        + li.float
          border-top: 1px solid #f5f5f5;
        > div
          float: left;
          height: 25px;
          line-height: 25px;
          font-weight: 600;
          &:first-child
            width: 30%;
          &:nth-child(2)
            width: 70%;
            text-align: right;
            color: #99A9BF;

  .el-icon-circle-close
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 16px;
    color: #99A9BF;
    cursor: pointer;
    &:hover
      color: #C0CCDA;
</style>
