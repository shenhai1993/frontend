<template>
  <div class="mainpage twoColumnLayout">
    <div>
      <side-bar>
        <span slot="title" class="title">系统审核</span>
        <el-menu slot="component" class="el-menu-vertical-demo"  :default-active="$route.path" router>
          <el-menu-item :index="menu.path" v-for="menu in menus" :key="menu.path">
            <i :class="menu.icon"></i><span>{{ menu.name }}</span>
            <el-badge v-if="menu.type === 'elements'" :value="elementsList.length" class="mark" />
            <el-badge v-if="menu.type === 'play'" :value="playList.length" class="mark" />
            <el-badge v-if="menu.type === 'marquees'" :value="marqueesList.length" class="mark" />
          </el-menu-item>
        </el-menu>  
      </side-bar>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import VueCookie from "vue-cookies"

export default {
  components: {
    SideBar
  },

  data () {
    return {
      menus: []
    }
  },

  computed: {
    ...mapState({
      marqueesList: state => state.examine.marqueesList,
      playList: state => state.examine.playList,
      elementsList: state => state.examine.elementsList
    })
  },

  mounted () {
    this.getMarqueeList()
    this.getPlayList()
    this.getElementsList()

    let objAuth = VueCookie.get('authUser')
    let authUser = (typeof objAuth === 'string') ? JSON.parse(objAuth) : objAuth
    let elementAuth = authUser.permission_names.includes('素材管理')
    let playlistAuth = authUser.permission_names.includes('播出单管理')
    let marqueesAuth = authUser.permission_names.includes('跑马灯管理')

    if(elementAuth){
      this.menus.push({name: '素材', path: '/examine/elements', icon: 'fa fa-file-image-o', type: 'elements'})
    }
    if(playlistAuth){
      this.menus.push({name: '播出单', path: '/examine/playList', icon: 'fa fa-calendar', type: 'play'},)
    }
    if(marqueesAuth){
      this.menus.push({name: '跑马灯', path: '/examine/marquee', icon: 'fa fa-exchange', type: 'marquees'})
    }
  },

  methods: {
    ...mapActions([
      'getMarqueeList', 'getPlayList', 'getElementsList'
    ])
  }
}
</script>

<style lang="scss" scoped>
.el-menu-item [class^=fa] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
</style>
