<template>
  <div id="mainpage">
    <div class="nav-box">
      易秀信息发布管理系统
    </div>
    <nav class="navigation" ref="navBox">
      <header>
        <div class="top-area">
          <a  href="javascript:;"
              class="logo"
              title="eshow">
            <img src="../../static/images/logo.png" alt="eshow">
          </a>
        </div>
        <div class="middle-area" ref="menuBox">
          <el-menu  class="el-menu-vertical"
                    router
                    :collapse="isCollapse"
                    :default-active="activeMenu">
            <el-menu-item v-for="menu in allowedMenu"
                          :index="menu.url"
                          :key="menu.url">
              <i :class="menu.icon" />
              <font>{{ menu.name }}</font>
<!--              <span slot="title">{{ menu.name }}</span>-->
            </el-menu-item>
            <!-- <el-menu-item index="/logout">
              <i class="fa fa-sign-out" />
              <span slot="title">退出登录</span>
            </el-menu-item> -->
          </el-menu>
        </div>
      </header>
    </nav>

    <section>
      <current-user></current-user>
      <router-view />
    </section>
  </div>
</template>

<script>
import VueCookie from "vue-cookies"
import currentUser from '@/modules/currentUser/pages/index'
import menus from '@static/js/api/menu.json'

export default {
  components: {
    currentUser
  },

  created () {
    console.log('menus:==>', menus)
    // this.authUser = JSON.parse(VueCookie.get('authUser')
    let objAuth = VueCookie.get('authUser')
    this.authUser = (typeof objAuth === 'string') ? JSON.parse(objAuth) : objAuth
    console.log(`this.authUser:==>`)
    console.log(this.authUser)
  },
  mounted () {

    let temp = this.$route.path.split('/')

    if (temp[1] !== '') {
      this.activeMenu = '/' + this.$route.path.split('/')[1]
    }
    this.getAllowedMenu()
    // this.$router.push(this.activeMenu)
  },
  watch: {
    $route (v, ov) {
      this.activeMenu = '/' + v.path.split('/')[1]
    }
  },

  data () {
    return {
      isCollapse: true,
      authUser: {},
      activeMenu: '/terminals',
      // menus: [
      //   {
      //     name: '终端',
      //     icon: 'fa fa-television',
      //     iconhover: 'fa fa-television',
      //     url: '/terminals',
      //     permission: '终端管理'
      //   },
      //   {
      //     name: '终端维护',
      //     icon: 'fa fa-television',
      //     iconhover: 'fa fa-television',
      //     url: '/manage',
      //     permission: '终端管理'
      //   },
      //   {
      //     name: '素材',
      //     icon: 'fa fa-file-image-o',
      //     iconhover: 'fa fa-file-image-o',
      //     url: '/elements',
      //     permission: '素材管理'
      //   },
      //   // {
      //   //   name: '新素材',
      //   //   icon: 'fa fa-file',
      //   //   iconhover: 'fa fa-file',
      //   //   url: '/files',
      //   //   permission: '素材管理'
      //   // },
      //   {
      //     name: '模板',
      //     icon: 'fa fa-window-restore',
      //     url: '/tpl',
      //     permission: '模板管理'
      //   },
      //   {
      //     name: '播出单',
      //     icon: 'fa fa-calendar',
      //     iconhover: 'fa fa-calendar',
      //     url: '/playlistmutipletpl',
      //     permission: '播出单管理'
      //   },
      //   {
      //     name: '拼接屏',
      //     icon: 'fa fa-th',
      //     url: '/mpdp',
      //     permission: '拼接屏管理'
      //   },
      //   {
      //     name: '跑马灯',
      //     icon: 'fa fa-exchange',
      //     url: '/marquee',
      //     permission: '跑马灯管理'
      //   },
      //   // {
      //   //   name: '节目排单',
      //   //   icon: 'fa fa-indent',
      //   //   url: '/playbill'
      //   // },
      //   // {
      //   //   name: '服务器',
      //   //   icon: 'fa fa-server',
      //   //   url: '/server'
      //   // },
      //   //  {
      //   //   name: '点播',
      //   //   icon: 'fa fa-laptop',
      //   //   url: '/vod'
      //   // },
      //   {
      //     name: '角色',
      //     icon: 'fa fa-address-card',
      //     iconhover: 'fa fa-address-card',
      //     url: '/roles',
      //     permission: '角色管理'
      //   },
      //   {
      //     name: '用户',
      //     icon: 'fa fa-user-o',
      //     iconhover: 'fa fa-user-o',
      //     url: '/users',
      //     permission: '用户管理'
      //   },
      //   {
      //     name: '系统设置',
      //     icon: 'fa fa-cog',
      //     iconhover: 'fa fa-cog',
      //     url: '/setting',
      //     permission: '系统设置'
      //   },
      //   {
      //     name: '系统审核',
      //     icon: 'fa fa-adjust',
      //     iconhover: 'fa fa-adjust',
      //     url: '/examine',
      //     permission: '系统审核'
      //   },
      //   {
      //     name: '操作日志',
      //     icon: 'fa fa-file-text-o',
      //     iconhover: 'fa fa-file-text',
      //     url: '/logs',
      //     permission: '查看日志'
      //   }
      //   // ,
      //   // {
      //   //   name: '测试',
      //   //   icon: 'fa fa-question',
      //   //   url: '/demo/test'
      //   // }
      // ]
      menus: menus.menus
    }
  },

  computed: {
    allowedMenu () {
      return this.getAllowedMenu()
    }
  },
  methods: {
    getMenuHeight () {
      let silderHeight = this.$refs.navBox.clientHeight - 56
      let menuHeight = this.$refs.menuBox.clientHeight
      if(menuHeight > silderHeight){
        this.isMoreMenu = true
      } else {
        this.isMoreMenu = false
      }
    },

    getAllowedMenu () {
      let permissions = this.authUser.permission_names
      let allowedMenu = []
      this.menus.forEach(menu => {
        for (let i = 0; i < permissions.length; i++) {
          const permission = permissions[i];
          if (permission === menu.permission) {
            allowedMenu.push(menu)
            break
          }
        }
      })
      return allowedMenu
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.navigation {
  overflow: hidden;
  overflow-y: auto !important;
}

.navigation::-webkit-scrollbar {
    width: 2px;
    /*height: .1px;*/
}
/* 滚动槽 */
.navigation::-webkit-scrollbar-track {
  background-color: #fbfbfb;
}

/* 滚动条滑块 */
.navigation::-webkit-scrollbar-thumb {
  background-color: #e1e3e4;
  background-clip: content-box;
  border-radius: 2px;
}
.el-menu.el-menu--collapse{
  width: 100%;
}
.el-menu {
  border-right: 1px solid #d0e0f2;
  background-color: #ffffff;
  padding-top: 30px;
  padding-left: 15px;
  padding-right: 15px;
  .el-menu-item {
    font-weight: bold;
    text-align: left;
    height: 36px;
    line-height: 36px;
    margin-bottom: 20px;
    border-radius: 20px;
    i {
      /*color: #60626b;*/
      width: 25px;
      margin-left: 10px;
      font-weight: bold;
    }

    &:hover,
    &.is-active {
      background-color: #3f94ef; // 激活和鼠标hover的颜色
      color: #ffffff;
      i {
        color: #ffffff;
      }
    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
