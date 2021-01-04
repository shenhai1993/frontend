<template>
  <div class="twoColumnLayout">
    <div>
      <side-bar>
        <span slot="title" class="title">跑马灯</span>
        <el-menu slot="component" close="el-menu-vertical-demo" :default-active="activedPath" router>
          <el-menu-item index="list">
            <i class="el-icon-circle-check-outline"></i>
            <span>可用跑马灯</span>
            <el-tag size="mini" type="info">{{ avaiable }}</el-tag>
          </el-menu-item>
          <el-menu-item index="published">
            <i class="el-icon-circle-check"></i>
            <span>已发布跑马灯</span>
            <el-tag size="mini" type="info">{{ published }}</el-tag>
          </el-menu-item>
          <el-menu-item v-if="audit" index="audit">
            <i class="fa fa-bell fa-to-el"></i>
            <span>待审核跑马灯</span>
            <el-tag size="mini" type="info">{{ inaudit }}</el-tag>
          </el-menu-item>
          <el-menu-item v-if="audit" index="unpassed">
            <i class="fa fa-to-el fa-ban"></i>
            <span>未过审跑马灯</span>
            <el-tag size="mini" type="info">{{ ban }}</el-tag>
          </el-menu-item>
          <el-menu-item index="expired">
            <i class="el-icon-remove-outline"></i>
            <span>过期跑马灯</span>
            <el-tag size="mini" type="info">{{ expired }}</el-tag>
          </el-menu-item>
          <!-- <el-menu-item :index="menu.path" v-for="menu in menus" :key="menu.path" v-if="!menu.audit || menu.audit === audit">
            <i :class="menu.icon"></i>
            <span>{{ menu.name }}</span>
          </el-menu-item> -->
        </el-menu>
      </side-bar>
    </div>
    <router-view>
      <span slot="submenuName">跑马灯管理</span>
    </router-view>
  </div>
</template>

<script>
import Status from '@static/js/utils/status'
import RouterView from '@/components/RouterView.vue'
import SideBar from '@/components/SideBar.vue'
import api from '@static/js/api/index'
import { mapState } from 'vuex'

export default {
  components: {
    RouterView, SideBar
  },

  data () {
    return {
      audit: 0
    }
  },

  computed: {
    ...mapState({
      statusCount: state => state.marquee.statusCount,
      marqueeList: state => state.marquee.marqueeList
    }),

    activedPath () {
      let path = this.$route.path

      return path.split('/').pop()
    },

    avaiable () {
      this.marqueeList.map(m => {
        console.log(m.status)
      })
      return this.marqueeList.filter(marquee => {
        return marquee.status === Status.AVAILABLE
      }).length || 0
    },

    published () {
      return this.marqueeList.filter(marquee => {
        return marquee.status === Status.PUBLISHED
      }).length || 0
    },

    inaudit () { // 审核中 1
      return this.marqueeList.filter(marquee => {
        return marquee.status === Status.AUDIT
      }).length || 0
    },

    ban () { // 驳回 2
      return this.marqueeList.filter(marquee => {
        return marquee.status === Status.UNPASSED
      }).length || 0
    },

    expired () { // 过期 4
      return this.marqueeList.filter(marquee => {
        return marquee.status === Status.EXPIRED
      }).length || 0
    }
  },

  created () {
    api.getAudit('marquees').then(res => {
      this.audit = res.data.marquee.status
    })
  }
}
</script>

<style lang="scss" scoped>
  .twoColumnLayout {
    > div {
      &:nth-child(1) {
        width: 180px;
      }
      &:nth-child(2) {
        margin-left: 180px;
      }
    }
    .fa-to-el {
      width: 20px;
      font-size: 18px;
      margin-right: 5px;
      margin-left: 5px;
    }
  }
</style>