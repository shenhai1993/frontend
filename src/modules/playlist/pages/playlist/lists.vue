<template>
  <div class="parentConent">
    <div class="p-10" v-if='!isexpiredPlayLists'>
      <refreshbutton v-on:refresh="refresh"></refreshbutton>
      <router-link to="edit" slot="subbutton">
        <el-tooltip class="item" effect="dark" content="新建播出单" placement="bottom">
          <el-button class="subbutton">
            <i class="fa fa-plus"></i>
          </el-button>
        </el-tooltip>
      </router-link>
    </div>
    <el-table ref="multipleTable"
              :data=" isexpiredPlayLists ? expiredPlaylists : playlistsWithoutExpired"
              :class="{isexpired: isexpiredPlayLists}"
              tooltip-effect="dark"
              style="width: 100%;"
              height='100%'
              stripe
              empty-text="没有播出单">
      <el-table-column  prop="status" align="center"
                        label="状态"
                        width="80"
                        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" v-if="String(scope.row.status) !== '2'"
                      :content="String(scope.row.status) === '1' ? '已发布' : '未发布'" placement="bottom">
            <el-button type="text" size="mini">
              <i :class="String(scope.row.status) === '1' ? 'fa fa-check' : 'fa fa-circle'"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="已过期" placement="bottom" v-if="String(scope.row.status) === '2'">
            <el-button type="text" size="mini">
              <i class="fa fa-warning"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column  prop="name"
                        label="名称"
                        show-overflow-tooltip>
      </el-table-column>
      <el-table-column  prop="direction" align="center"
                        label="屏幕方向"
                        width="80">
        <template slot-scope="scope">
          <span :class="scope.row.direction === '1' ? 'vertical' : 'horizontal'">
            {{ scope.row.direction === '1' ? '竖屏' : '横屏' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="startdate"
                      label="播放日期"
                      width="120"
                      align='center'
                      show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.startdate }}</p>
            <p>|</p>
            <p>{{ scope.row.enddate }}</p>
          </template>
      </el-table-column>
      <el-table-column prop="starttime"
                      label="播出时段"
                      width="120"
                      align='center'
                      show-overflow-tooltip>
        <template slot-scope="scope">
          <p>{{ scope.row.starttime }}</p>
          <p>|</p>
          <p>{{ scope.row.endtime }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="size"
                        label="素材大小"
                        width="120"
                        show-overflow-tooltip>
        <template slot-scope="scope">
        {{ scope.row.size | filesize }}
        </template>
      </el-table-column>
      <el-table-column prop="time_length"
                        label="总时长"
                        width="120"
                        show-overflow-tooltip>
        <template slot-scope="scope">
        {{ scope.row.time_length }}s
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"
                        width="150">
        <template slot-scope="scope">
          <!--  v-if="scope.row.status !== '1'" -->
          <!-- <router-link
                       :to="{name: 'playlistedit', params: {id: scope.row.id}}">
            <i class="fa fa-pencil" title="编辑"></i>
          </router-link> -->
            <el-tooltip v-if="String(scope.row.status) !== '1'" class="item" effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click="_delete(scope.row, scope.$index)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>

            <span v-if="!isexpiredPlayLists" @click="click_isrelease(scope.row)">
              <el-tooltip v-if="String(scope.row.status) === '0'" class="item" effect="dark" content="发布" placement="bottom">
                <el-button type="text" size="mini">
                  <i class="fa fa-arrow-circle-o-right" />
                </el-button>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="dark" content="停止" placement="bottom">
                <el-button type="text" size="mini">
                  <i class="fa fa-stop-circle-o" />
                </el-button>
              </el-tooltip>
            </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import refreshbutton from '@/components/RefreshButton.vue'

export default {
  data () {
    return {
      groupId: 0
    }
  },
  components: {
    refreshbutton
  },

  mounted () {
    this.groupId = JSON.parse(this.$cookies.get('authUser')).group_id

    let ismpdpPage = this.$route.path.indexOf('/mpdp/playlist') > -1
    this.IS_MPDP_PAGE(ismpdpPage)

    if (this.isexpiredPlayLists) {
      this.getExpiredPlaylists(this.groupId)
    } else {
      this.getPlaylists(this.groupId)
    }
  },

  computed: {
    ...mapState({
      playlists: state => state.playlist.playlists,
      expiredPlaylists: state => state.playlist.expiredPlaylists
    }),
    isexpiredPlayLists () {
      return this.$route.path.indexOf('playlist/expired') > -1
    },
    playlistsWithoutExpired () {
      return this.playlists.filter(list => {
        return list.status !== 2
      })
    }
  },

  methods: {
    ...mapMutations([
      'DEL_PLAYLIST', 'IS_MPDP_PAGE'
    ]),
    ...mapActions([
      'getFileList', 'getPlaylists', 'deletePlaylist', 'pubStopPlaylist', 'getExpiredPlaylists'
    ]),

    refresh () {
      this.getPlaylists(this.groupId)
    },

    // toolbar
    async querySearch (queryString, cb) {
      let result = await this.getFileList()
      cb(result)
    },

    _delete (item, index) {
      let me = this
      me.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {group_id: this.groupId}
        let res = me.deletePlaylist({item, data})
        res.then(res => {
          me.$notify.success({
            title: '操作成功！'
          })
        }).catch(err => {
          me.$notify.error({
            title: `操作失败: ${err.message}!`
          })
        })
      })
    },

    handleSelect (item) {
      console.log(item)
    },

    von_outerHide (data) {
      this.outerVisible = data
    },

    click_isrelease (item) {
      let me = this
      let res = this.pubStopPlaylist({ item, groupId: this.groupId })

      res
        .then(res => {
          me.$notify.success({
            title: '操作成功！'
          })
        })
        .catch(err => {
          me.$notify.error({
            title: `操作失败: ${err.message}!`
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-table {
    height: calc(100% - 60px);
    &.isexpired {
      height: 100%;
    }
  }
  .el-button {
    margin-left: 5px;
  }
  i {
    margin-right: 5px;
  }
  .fa-check,
  .fa-arrow-circle-o-right {
    color: #67C23A;
  }
  i.fs {
    font-size: 18px;
  }
</style>
