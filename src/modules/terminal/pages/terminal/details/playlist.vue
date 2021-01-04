<template>
  <div class="playlist">
     <el-table :data="playlists" style="width: 100%" v-loading="isLoading">
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
          <el-tooltip class="item" effect="dark" :content="`已过期: ${scope.row.schedule.date.end}`" placement="bottom"
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

      <el-table-column prop="name" label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button @click="showPlaylist(scope.row)" type="text">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>

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
    if (this.activeName === 'playlist') {
      this._loadPlaylist()
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
      isLoading: false,
      playlists: [],
      previewShow: false,
      playlist: {}
    }
  },

  methods: {
    _loadPlaylist () {
      this.isLoading = true
      api.getPlaylist(this.activeterminal.id).then(res => {
        this.playlists = res.data.playlists
      })

      // do loading

      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },

    async showPlaylist (list) {
      this.playlist = await this._getPlaylist(list.id)

      this.previewShow = true
    },

    previewClose () {
      this.currentPlaylist = {}
    },

    async _getPlaylist (id) {
      this.$store.dispatch('getPlaylistById', id)
    }
  },

  watch: {
    activeName (v, ov) {
      if (v === 'playlist') {
        this._loadPlaylist()
      }
    },
  }
}
</script>

<style lang="sass">
  .playlist
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
