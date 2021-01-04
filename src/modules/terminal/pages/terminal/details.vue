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
          <div class='ellipsis'>在线</div>
          <!-- 0: 离线, 1: 在线, 2: 待机 -->
          <div class='ellipsis' v-if="activeterminal.online_status === 0">离线</div>
          <div class='ellipsis' v-if="activeterminal.online_status === 1">在线</div>
          <div class='ellipsis' v-if="activeterminal.online_status === 2">待机</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>IP地址</div>
          <div class="ellipsis">{{ activeterminal.online_status === 1 ? activeterminal.ip : '-' }}</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>MAC地址</div>
          <div class="ellipsis">{{ activeterminal.mac | macstyle }}</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>屏幕方向</div>
          <div class="ellipsis">{{ activeterminal.direction | direction }}</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>网络</div>
          <div class="ellipsis">{{ activeterminal.network_type | network }}</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>信号</div>
          <div class="ellipsis">{{ activeterminal.signal || '-' }}</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>软件版本</div>
          <div class="ellipsis">{{ activeterminal.version }}</div>
        </li>
        <!-- <li class="clearfix float">
          <div class='ellipsis'>磁盘空间</div>
          <div class="ellipsis">{{ activeterminal.disk_size }}</div>
        </li> -->
        <li class="clearfix float">
          <div class='ellipsis'>标签</div>
          <div class="ellipsis">{{ tags || '-' }}</div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>注册时间</div>
          <div class="ellipsis" :title="activeterminal.created_at">
            {{ activeterminal.created_at }}
          </div>
        </li>
        <li class="clearfix float">
          <div class='ellipsis'>播放类型</div>
          <div class="ellipsis">{{ getPlayType(activeterminal.play_type) }}</div>
        </li>
        <!-- <li class="clearfix float">
          <div class='ellipsis'>安装地址</div>
          <div class="ellipsis">{{ activeterminal.address }}</div>
        </li> -->
      </ul>
    </section>
    <section class="m-t-20 info">
      <el-tabs @tab-click="handleClick" v-model="activeName">
        <!-- 播出单 -->
        <el-tab-pane name="playlist" v-if="!showGroupSelect">
          <span slot="label">播出单</span>
          <playlist :activeName='activeName' :activeterminal="activeterminal"></playlist>
        </el-tab-pane>

        <!-- 跑马灯 -->
        <el-tab-pane name="marquee" v-if="!showGroupSelect">
          <span slot="label">跑马灯</span>
          <marquee :activeName='activeName' :activeterminal="activeterminal"></marquee>
        </el-tab-pane>

        <!-- 下载监控 -->
        <el-tab-pane name="download">
          <span slot="label">
            <!-- <i class="fa fa-download"></i><br/> -->
            下载监控
          </span>
          <download
            :activeName='activeName'
            :activeterminal='activeterminal'>
          </download>
        </el-tab-pane>

        <!-- 屏幕截图 -->
        <el-tab-pane name="screenshot">
          <span slot="label">
            <!-- <i class="fa fa-cut"></i><br/> -->
            屏幕截图
          </span>
          <screenshot
            :activeterminal='activeterminal'
            :activeName='activeName'>
          </screenshot>
        </el-tab-pane>

        <!-- 音量调节 -->
        <el-tab-pane name="volume">
          <span slot="label">
            <!-- <i class="fa fa-volume-up"></i><br/> -->
            音量调节
          </span>
          <volume :activeterminal='activeterminal'></volume>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script>
import playlist from './details/playlist.vue'
import marquee from './details/marquee.vue'
import screenshot from './details/screenshot.vue'
import download from './details/download.vue'
import volume from './details/volume.vue'
import http from '@static/js/utils/http'

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
    playlist, marquee, screenshot, download, volume
  },

  data () {
    return {
      showDetails: false,
      activeName: 'playlist',
      showGroupSelect: false
    }
  },

  created () {
    if (/ungrouped/.test(window.location.href)) {
      this.showGroupSelect = true
    }
  },

  methods: {
    handleClick (tab, event) {
      http.cancel()
    },
    click_close () {
      let self = this
      this.activeName = ''
      setTimeout(function () {
        self.$emit('showDetails', false)
      }, 10)
    },
    getPlayType (v) {
      let type = '无'
      switch (v) {
        case 0:
          type = '单机播放'
          break
        case 1:
          type = '云播放'
          break
        case 2:
          type = '局域网播放'
          break
        case 3:
          type = '信源播放'
          break
        default:
          type = '无'
      }
      return type
    }
  },

  computed: {
    tags: function () {
      let tags = []
      for (let i = 0; i < this.activeterminal.tagged.length; i++) {
        tags.push(this.activeterminal.tagged[i].tag_name)
      }

      return tags.join(', ')
    }
  }
}
</script>

<style lang="sass" scoped>
  section
    position: relative
    ul
      li.float
        + li.float
          border-top: 1px solid #f5f5f5
        > div
          float: left
          height: 25px
          line-height: 25px
          font-weight: 600
          &:first-child
            width: 30%
          &:nth-child(2)
            width: 70%
            text-align: right
            color: #99A9BF

  .el-icon-circle-close
    position: absolute
    right: 20px
    top: 20px
    font-size: 16px
    color: #99A9BF
    cursor: pointer
    &:hover
      color: #C0CCDA
</style>
