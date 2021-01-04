<template>
  <!-- 外面包裹的容器 里面包含两部分header与container -->
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>我的模板</span>
    </headerbar>

    <!-- container -->
    <div class="templateContainer">
      <div v-if="tpls.length === 0">您还没有任何模板噢，请到模板商城购买</div>
      <div v-for="(item, index) in tpls" :key="item.id" class="item">
        <div class="ribbon ribbon-badge" v-if="item.use_status !== '0'">
          <span class="ribbon-inner check">使用中</span>
        </div>
        <div :class="{'vertical': item.direction == '1', 'horizon': item.direction == '0'}"
            class="image">
          <div class="overlay">
          </div>
          <img :src="item.thumb_path" />
        </div>
        <div class="item-bottom">
          <div class="title" :title="item.name">
          <p class="m-t-15 m-b-15"> {{ item.name }} </p>
          </div>
          <div style="padding-bottom:16px;">
            <el-tooltip effect="dark" content="删除" placement="bottom">
              <el-button title="删除" @click="remove(item, index)" size="mini" type="danger">
                <i class="el-icon-delete"></i>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../../static/js/api/index.js'
import http from '../../../../static/js/utils/http'
import headerbar from '@/components/HeaderBar'

export default {
  components: {
    headerbar
  },

  data () {
    return {
      searchQuery: '',
      tpls: []
    }
  },
  mounted () {
    http.get(`templates?type=list`).then((res) => {
      this.tpls = res.data
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
    remove (item, index) {
      if (item.use_status !== '0') {
        this.$notify({
          message: '模板正在使用中，不能删除',
          type: 'error'
        })
        return
      }
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.removeTemplate(item.id).then(res => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.tpls.splice(index, 1)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../static/template.scss";
</style>
