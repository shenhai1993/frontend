<template>
  <!-- 外面包裹的容器 里面包含两部分header与container -->
  <div class="parentConent">
    <!-- container -->
      <listview :list="filteredTpls" v-on:remove="doDelete"></listview>
  </div>
</template>

<script>
import listview from '../../components/listview.vue'
import headerbar from '@/components/HeaderBar'
import http from '../../../../../static/js/utils/http'

export default {
  components: {
    headerbar, listview
  },

  data () {
    return {
      searchQuery: '',
      tpls: [],
      groupId: 0
    }
  },

  mounted () {
    let objAuth = this.$cookies.get('authUser')
    let authUser = (typeof objAuth === 'string') ? JSON.parse(objAuth) : objAuth
    this.groupId = authUser.group_id
    http.get(`mpdp/scenes`).then((res) => { // { 'group_id': 1 }
      this.tpls = res.data.message
    }).catch(e => console.log(e))
  },

  computed: {
    filteredTpls: function () {
      this.tpls = this.tpls || []
      return this.tpls.filter(tpl => {
        return tpl.name.indexOf(this.searchQuery) !== -1
      })
    }
  },

  methods: {
    doDelete (item, index) {
      if (item.status === '1') {
        this.$notify({
          message: '场景正在使用中，不允许删除',
          type: 'error'
        })
        return
      }
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.delete(`mpdp/scenes/${item.id}?group_id=${this.groupId}`)
          .then((res) => {
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
            this.tpls.splice(index, 1)
          })
          .catch((error) => {
            console.log(error)
          })
      })
    }
  }
}
</script>
