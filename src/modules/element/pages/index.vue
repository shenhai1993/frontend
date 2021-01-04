<template>
  <div class="twoColumnLayout element-index">
    <div>
        <sub-menu slot="component"></sub-menu>
    </div>

    <transition name="el-fade-in">
      <router-view>
        <span slot="submenuName">{{ title }}</span>
      </router-view>
    </transition>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import RouterView from '@/components/RouterView.vue'
import SubMenu from '@/modules/element/components/SubMenu.vue'

import { mapState } from 'vuex'

export default {
  components: {
    SideBar, RouterView, SubMenu
  },
  data () {
    return {
      titles: {
        'all': '全部素材',
        'link': '网页',
        'image': '图片',
        'video': '视频',
        'audio': '音频',
        'stream': '直播流',
        'webpage': '网页'
      }
    }
  },
  computed: {
    ...mapState({
      fileType: state => state.element.fileType
    }),
    title: function () {
      return this.titles[this.fileType]
    }
  }
}
</script>

<style lang="scss" scoped>
.element-index {
  > div {
    &:nth-child(1) {
      width: 300px;
    }
    &:nth-child(2) {
      margin-left: 300px;
    }
  }
}
</style>
