<template>
  <!-- 外面包裹的容器 里面包含两部分header与container -->
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>模板列表</span>
    </headerbar>

    <!-- container -->
    <div class="templateContainer">
      <listview :list="filteredTpls" v-on:remove="doDelete"></listview>
    </div>
  </div>
</template>

<script>
import listview from '../components/listview.vue'
import headerbar from '@/components/HeaderBar'
import http from '../../../../static/js/utils/http.js'
export default {
  components: {
    headerbar, listview
  },

  data () {
    return {
      searchQuery: '',
      tpls: []
    }
  },

  mounted () {
    http.get(`mpdp/scenes`).then((res) => {
      this.tpls = res.data.message
    })
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
        http.delete(`mpdp/scenes/${item.id}`)
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
