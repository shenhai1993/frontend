<template>
  <div id="app">
    <section id="content" class="container">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      authUser: {}
    }
  },

  methods: {
    ...mapMutations([
      'SET_ORIGIN'
    ]),

    // getRoutes (user) {
    //   let permissions = [
    //     {
    //       "id": 1,
    //       "name": "terminal",
    //       "parent_id": null,
    //       "route": "terminal"
    //     },
    //     {
    //       "id": 2,
    //       "name": "terminal",
    //       "parent_id": 1,
    //       "route": "index"
    //     },
    //     {
    //       "id": 4,
    //       "name": "terminal",
    //       "parent_id": 1,
    //       "route": "group/:id"
    //     },
    //     {
    //       "id": 3,
    //       "name": "roles",
    //       "parent_id": null,
    //       "route": "roles"
    //     }
    //   ]
    //   let arrayMenus = this.buildMenu(permissions)
    //   let hashMenus = {}
    //   let allowedRouter = []
    //   let setMenu2Hash = function(array, base) {
    //     array.map(key => {
    //       if (key.route) {
    //         let hashKey = ((base ? base + '/' : '') + key.route).replace(/^\//, '')
    //         hashMenus['/' + hashKey] = true
    //         if (Array.isArray(key.children)) {
    //           setMenu2Hash(key.children, key.route)
    //         }
    //       }
    //     });
    //   };
    //   setMenu2Hash(arrayMenus)
    //   this.$root.hashMenus = hashMenus
    //   console.log(`hashMenus:==>`)
    //   console.log(hashMenus)
    //   let findLocalRoute = function(array, base) {
    //     let replyResult = []
    //     array.forEach(function(route) {
    //       let pathKey = (base ? base + '/' : '') + route.path
    //       if (hashMenus[pathKey]) {
    //         if (Array.isArray(route.children)) {
    //           route.children = findLocalRoute(route.children, route.path)
    //         }
    //         replyResult.push(route)
    //       }
    //     })
    //     if (base) {
    //       return replyResult
    //     } else {
    //       allowedRouter = allowedRouter.concat(replyResult)
    //     }
    //   }
    //   let originPath = deepcopy(userPath[0].children)
    //   console.log(`originPath:==>`)
    //   console.log(originPath)
    //   findLocalRoute(originPath)
    //   console.log(`allowedRouter:==>`)
    //   console.log(allowedRouter)
    //   return allowedRouter
    // },
    // extendRoutes (allowedRouter) {
    //   console.log('extend')
    //   let vm = this;
    //   let actualRouter = deepcopy(allowedRouter);
    //   actualRouter.map(e => {
    //     //复制子菜单信息到meta用于实现导航相关效果，非必需
    //     if (e.children) {
    //       if (!e.meta) e.meta = {};
    //       e.meta.children = e.children;
    //     }
    //     //为动态路由添加独享守卫
    //     return e.beforeEnter = function(to, from, next){
    //       if(vm.$root.hashMenus[to.path]){
    //         next()
    //       }else{
    //         next('/401')
    //       }
    //     }
    //   });
    //   console.log(`actualRouter:==>`)
    //   console.log(actualRouter)
    //   let originPath = deepcopy(userPath);
    //   originPath[0].children = actualRouter;
    //   console.log(`originPath:==>`)
    //   console.log(originPath)
    //   //注入路由
    //   vm.$router.addRoutes(originPath);
    //   console.log(`vm.$router:==>`)
    //   console.log(vm.$router)
    // },
    // singin () {
    //   let allowedRouter = this.getRoutes()
    //   console.log(`allowedRouter:==>`)
    //   console.log(allowedRouter)
    //   if (!allowedRouter || !allowedRouter.length) {
    //       return document.body.innerHTML = ('<h1>账号访问受限，请联系系统管理员！</h1>')
    //     }
    //   this.extendRoutes(allowedRouter)
    //   console.log(`this.$router:==>`)
    //   console.log(this.$router)
    // },
    // //菜单数据组织
    // buildMenu (array, ckey) {
    //   let menuData = []
    //   let indexKeys = Array.isArray(array) ? array.map((e) => {return e.id}) : []
    //   ckey = ckey || 'parent_id'
    //   array.forEach(function (e, i) {
    //     //一级菜单
    //     if (!e[ckey] || (e[ckey]===e.id)) {
    //       delete e[ckey]
    //       menuData.push(deepcopy(e)) //深拷贝
    //     }else if(Array.isArray(indexKeys)){
    //       //检测ckey有效性
    //       let parentIndex = indexKeys.findIndex(function(id){
    //         return id == e[ckey]
    //       })
    //       if(parentIndex===-1){
    //         menuData.push(e)
    //       }
    //     }
    //   })
    //   let findChildren = function (parentArr) {
    //     if (Array.isArray(parentArr) && parentArr.length) {
    //       parentArr.forEach(function (parentNode) {
    //         array.forEach(function (node) {
    //           if (parentNode.id === node[ckey]) {
    //             if (parentNode.children) {
    //               parentNode.children.push(node)
    //             } else {
    //               parentNode.children = [node]
    //             }
    //           }
    //         })
    //         if (parentNode.children) {
    //           findChildren(parentNode.children)
    //         }
    //       })
    //     }
    //   };
    //   findChildren(menuData)
    //   console.log(`menuData:==>`)
    //   console.log(menuData)
    //   return menuData
    // }
  },

  created () {
    // this.singin()
  },

  mounted () {
    let _originState = JSON.stringify(this.$store.state)
    this.SET_ORIGIN(JSON.parse(_originState))
    // this.authUser = JSON.parse(VueCookie.get('authUser'))
  },
}
</script>

<style lang="scss">
@import '../static/css/base.css';
@import '../static/css/main.scss';

[class^='el-icon-fa'],
[class*='el-icon-fa'] {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome !important;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
