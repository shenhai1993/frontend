<template>
  <div class="marquees">
     <el-table :data="marquees" style="width: 100%" v-loading="isLoading">
      <el-table-column prop="state" label="状态" show-overflow-tooltip :width="80">
        <!-- 0 可用 1 未审核 2 驳回 3 已发布 4 已过期-->
        <template slot-scope="scope">
          <!-- 审核中 -->
          <el-tooltip v-if="scope.row.status === 1" effect="dark" content="审核中" placement="bottom">
            <i class="fa fa-bell"></i>
          </el-tooltip>
          <!-- 未通过 -->
          <el-tooltip v-if="scope.row.status === 2" effect="dark" content="未通过" placement="bottom">
            <i class="fa fa-ban"></i>
          </el-tooltip>
          <!-- 已过期 -->
          <el-tooltip class="item" effect="dark" :content="`已过期: ${scope.row.enddate}`" placement="bottom"
                      v-if="scope.row.status === 4">
            <i class="fa fa-warning"></i>
          </el-tooltip>
          <!-- 已发布 -->
          <el-tooltip 
            class="item"
            effect="dark"
            v-if="scope.row.status === 3" content="已发布" placement="bottom">
            <i class="fa fa-check"></i>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="content" label="跑马灯内容" show-overflow-tooltip></el-table-column>

      <el-table-column width="100px" label="制作人">
        <template slot-scope="scope">
          <span>{{ scope.row.user.name }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from '../../../static/js/TerminalGroup'

export default {
  mounted () {
    if (this.activeName === 'marquee') {
      this._loadMarquee()
    }
  },

   props: {
    activeterminal: {
      type: Object
    },

    activeName: {
      type: String
    }
  },

  data () {
    return {
      marquees: [],
      isLoading: false
    }
  },

  methods: {
    _loadMarquee () {
      this.isLoading = true
      api.getMarquee(this.activeterminal.id).then(res => {
        this.marquees = res.data.marquees
      })
      // do loading

      setTimeout(() => {
        this.isLoading = false
      }, 500)
    }
  },

  watch: {
    activeName (v, ov) {
      if (v === 'marquee') {
        this._loadMarquee()
      }
    },
  }
}
</script>

<style lang="sass">
  .marquees
    .el-table
      font-size: 12px;
      th
        height: 15px;
        background-color: white;
        font-weight: 600;
        div
          height: 20px;
          line-height: 20px;
          background-color: white;
      td
        height: 20px;
        line-height: 20px;
</style>
