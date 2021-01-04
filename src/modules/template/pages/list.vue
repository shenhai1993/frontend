<template>
  <!-- 外面包裹的容器 里面包含两部分header与container -->
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>模板列表</span>
    </headerbar>

    <!-- container -->
    <div class="templateContainer">
      <listview :list="filteredTpls" @remove="doDelete" :groupId="groupId"></listview>
    </div>
  </div>
</template>

<script>
import listview from '../components/listview.vue'
import headerbar from '@/components/HeaderBar'
import http from '@static/js/utils/http'

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
    // this.groupId = JSON.parse(this.$cookies.get('authUser')).group_id
    let objAuth = this.$cookies.get('authUser')
    this.groupId = (typeof objAuth === 'string') ? JSON.parse(objAuth).group_id : objAuth.group_id
    http.get(`templates?group_id=${this.groupId}`).then((res) => {
      this.tpls = res.data.message
    })
  },

  computed: {
    filteredTpls: function () {
      return this.tpls.filter(tpl => {
        return tpl.name.indexOf(this.searchQuery) !== -1
      })
    }
  },

  methods: {
    doDelete (item, index, groupId) {
      // if (item.status !== '0') {
      //   this.$notify({
      //     message: '模板正已上架，不允许删除',
      //     type: 'error'
      //   })
      //   return
      // }
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {group_id: groupId}
        http.delete(`/templates/${item.id}`, data)
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
