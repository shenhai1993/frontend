<template>
  <list :list="filteredTpls" @remove="doDelete" :groupId="groupId" v-loading="loading" v-on:reload="load"></list>
</template>

<script>
import list from '../components/List.vue'
import headerbar from '@/components/HeaderBar'
import http from '@static/js/utils/http'

export default {
  components: {
    headerbar, list
  },

  data () {
    return {
      searchQuery: '',
      tpls: [],
      groupId: 0,
      loading: false
    }
  },

  mounted () {
    this.load()
  },

  computed: {
    filteredTpls () {
      let ret = this.tpls.filter(tpl => {
        return tpl.name.indexOf(this.searchQuery) !== -1
      })

      return ret || []
    }
  },

  methods: {
    load () {
      // this.groupId = JSON.parse(this.$cookies.get('authUser')).group_id

      this.loading = true
      http.get(`templates`) // ?group_id=${this.groupId}
        .then((res) => {
          this.tpls = res.data.message
          setTimeout(() => {
            this.loading = false
          }, 200)
        })
        .catch(e => console.log(e))
    },

    doDelete (item, index, groupId) {
      if (item.use_status === 1) {
        return this.$notify.warning({
          title: '提示',
          message: '该模板处于使用状态，不能删除！'
        })
      }

      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {group_id: groupId}
        http.delete(`/templates/${item.id}`, data)
          .then((res) => {
            if (res.data.success){
              this.$notify({
                type: 'success',
                message: '删除成功!'
              })
              this.tpls.splice(index, 1)
              this.load()
            }else {
              this.$notify({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }).catch(e => {})
    }
  }
}
</script>
