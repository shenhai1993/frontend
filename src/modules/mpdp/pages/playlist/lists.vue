<template>
  <div class="parentConent mpdp-playlist-content">
    <div v-if='!isexpiredPlayLists'>
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
              :data=" isexpiredPlayLists ? expiredPlaylists : playlists"
              :class="{isexpired: isexpiredPlayLists}"
              tooltip-effect="dark"
              style="width: 100%;"
              height='calc(100% - 36)'
              stripe
              empty-text="没有播出单">
      <el-table-column  prop="status"
                        align="center"
                        label="状态"
                        width="80"
                        show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- 0:可用， 1:已发,2:过期，3:在切 -->
          <!-- <el-tooltip class="item" effect="dark" v-if="String(scope.row.status) !== '2'"
                      :content="String(scope.row.status) === '1' ? '已发布' : '未发布'" placement="bottom">
            <el-button type="text" size="mini">
              <i :class="String(scope.row.status) === '1' ? 'fa fa-check' : 'fa fa-circle'"></i>
            </el-button>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="未发布" placement="bottom"
                      v-if="String(scope.row.status) === '0'">
            <el-button type="text" size="mini">
              <i class="fa fa-circle"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="准备中" placement="bottom"
                      v-if="String(scope.row.status) === '3'">
            <el-button type="text" size="mini">
              <i class="fa fa-spinner fa-spin"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="已发布" placement="bottom"
                      v-if="String(scope.row.status) === '1'">
            <el-button type="text" size="mini">
              <i class="fa fa-check"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="已过期" placement="bottom"
                      v-if="String(scope.row.status) === '2'">
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
          <span :class="String(scope.row.direction) === '1' ? 'vertical' : 'horizontal'">
            {{ String(scope.row.direction) === '1' ? '竖屏' : '横屏' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column  prop="publish_type" align="center"
                        label="发布方式"
                        width="110">
        <template slot-scope="scope">
          <span>
            {{ String(scope.row.publish_type) === '1' ? '按拼接屏发布' : '按分组发布' }}
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
      <!-- <el-table-column prop="time_length"
                        label="总时长"
                        width="120"
                        show-overflow-tooltip>
        <template slot-scope="scope">
        {{ scope.row.time_length }}s
        </template>
      </el-table-column> -->
      <el-table-column width="100" label="创建人" prop="user.name"></el-table-column>
      <el-table-column label="操作" align="center"
                        width="150">
        <template slot-scope="scope">
          <!--  v-if="scope.row.status !== '1'" -->
          <!-- <router-link
                       :to="{name: 'playlistedit', params: {id: scope.row.id}}">
            <i class="fa fa-pencil" title="编辑"></i>
          </router-link> -->
            <router-link :to="{name: 'mpdpplaylistedit', params: {cid: scope.row.id, id: scope.row.scene_id}}">
              <el-tooltip v-if="String(scope.row.status) !== '1' && String(scope.row.status) !== '3'" class="item" effect="dark" content="编辑" placement="bottom">
                <el-button type="text" size="mini" @click="_edit">
                  <i class="fa fa-pencil"></i>
                </el-button>
              </el-tooltip>
            </router-link>
            <el-tooltip v-if="String(scope.row.status) !== '1' && String(scope.row.status) !== '3'" class="item" effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click="_delete(scope.row, scope.$index)">
                <i class="fa fa-remove"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="String(scope.row.status) === '3'" class="item" effect="dark" content="进度" placement="bottom">
              <el-button type="text" size="mini" @click="showProgress(scope.row)">
                <i class="fa fa-file-text-o"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
              <el-button type="text" size="mini" @click="showScreens(scope.row)">
                <i class="el-icon-tickets"></i>
              </el-button>
            </el-tooltip>

            <span v-if="!isexpiredPlayLists" @click="click_isrelease(scope.row, scope.$index)">
              <el-tooltip v-if="String(scope.row.status) === '0'" class="item" effect="dark" content="发布" placement="bottom">
                <el-button type="text" size="mini">
                  <i class="fa fa-arrow-circle-o-right" />
                </el-button>
              </el-tooltip>
              <el-tooltip v-else-if="String(scope.row.status) === '1'" class="item" effect="dark" content="停止" placement="bottom">
                <el-button type="text" size="mini">
                  <i class="fa fa-stop-circle-o" />
                </el-button>
              </el-tooltip>
            </span>
            <!-- 查看 -->
            <!-- <el-tooltip v-if = "String(scope.row.status) !== '2'" class="item" effect="dark" content="查看" placement="bottom">
              <el-button type="text" size="mini" @click="click_check(scope.row, scope.$index)">
                <i class="fa fa-eye"></i>
              </el-button>
            </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <playlistdetails :listitem.sync='listitem' :isvisible.sync='isshow'></playlistdetails>
    <el-dialog title="播出单素材准备进度" :visible.sync="isShowProgress">
      <div class="virtualShow"
               :class="{verticalSceen: String(scene.direction) === '1'}">
            <!-- 拼接屏预览 -->
            <div :style="{width: (Number(scene.column) === 1 && String(scene.direction) === '0' ? 292 : 585) + 'px'}">
              <!-- 横拼 -->
              <div v-if="String(scene.direction) === '0'"
                   class="screenRow"
                   v-for="(vnum, vindex) in scene.row"
                   :key="vnum"

                   >
                <!--  class="active" 选中的样式已写 -->
                <div @click="click_screen( scene.column, vindex, tnum)"
                     v-for="tnum in scene.column"
                     :class="{active: activeTnum === (Number(scene.column) * vindex + tnum)}"
                     :key="tnum"
:style="{height: 218 * 0.56 + 'px', width: '218px'}">
                  {{ Number(scene.column) * vindex + tnum }}
                 <div>{{ allProgress[Number(scene.column) * vindex + tnum ]}}</div>
                </div>
              </div>
              <!-- 竖拼 -->
              <div v-if="String(scene.direction) === '1'"
                   class="screenRow"
                   v-for="(vnum, vindex) in scene.row"
                   :key="vnum">
                <!--   选中的样式已写 -->
                <div @click="click_screen( scene.column, vindex, tnum)"
                     v-for="tnum in scene.column"
                     :class="{active: activeTnum === (Number(scene.column) * vindex + tnum)}"
                     :key="tnum"

                     :style="{width: 218 * 0.56 + 'px', height: 218 + 'px'}">
                  {{ Number(scene.column) * vindex + tnum }}
                  <div>{{ allProgress[Number(scene.column) * vindex + tnum ]}}</div>
                </div>
              </div>
            </div>
            <!-- 切割素材列表 -->
            <el-table style="width:100px" :data="progress">
              <el-table-column width="150px" prop="name" label="名称"></el-table-column>
              <el-table-column width="60px" prop="progress" label="进度(%)"></el-table-column>
            </el-table>
      </div>
    </el-dialog>
    <el-drawer
      title="播出单所关联的终端"
      :visible.sync="isShowScreens"
      :with-header="false">
      <div style="padding: 20px;">
        <h2>播出单所关联的终端</h2>
        <div>
          <p style="padding: 20px 0 0; font-size: 18px;">分组</p>
          <div style="max-height: 400px; overflow: auto;">
            <template v-if="checkedDefault.length > 0">
              <group-panel
                :strictly="true"
                gtype="trees"
                :defaultChecked="checkedDefault"
                :showCheckbox="true"
                disabled>
              </group-panel>
            </template>
            <template v-else>
              <div style="padding: 10px; font-size: 14px;">未选择分组</div>
            </template>
          </div>
        </div>
        <div style="margin-top: 20px; border-top: 1px solid #e6e6e6;">
          <p style="padding: 20px 0 0; font-size: 18px;">标签</p>
          <template v-if="tagged.length > 0">
            <ul class="labelAll-box">
              <li class="label-options" v-for="(item, index) in tagged" :key="index">{{ item.tag_name }}</li>
            </ul>
          </template>
          <template v-else>
            <div style="padding: 10px; font-size: 14px;">未选择标签</div>
          </template>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import refreshbutton from '@/components/RefreshButton.vue'
import playlistdetails from '@/modules/mpdp/pages/playlist/lists/listdetails.vue'
import GroupPanel from '@/modules/group/components/group'

export default {
  components: {
    refreshbutton, playlistdetails, GroupPanel
  },

  data () {
    return {
      listitem: null,
      isshow: false,
      scene: {},
      isShowProgress: false,
      progress: [],
      activeTnum: 0,
      allProgress: {},
      isShowScreens: false,
      screens: {},
      checkedDefault: [],
      tagged: [],
      screensTimeout: -1
    }
  },

  mounted () {
    let ismpdpPage = this.$route.path.indexOf('/mpdp/playlist') > -1
    this.IS_MPDP_PAGE_MPDP(ismpdpPage)

    if (this.isexpiredPlayLists) {
      this.getmpdpExpiredPlaylists()
    } else {
      this.getmpdpPlaylists()
    }
  },

  computed: {
    ...mapState({
      playlists: state => state.mpdp.playlists,
      expiredPlaylists: state => state.mpdp.expiredPlaylists,
      cutList: state => state.mpdp.cutList
    }),
    isexpiredPlayLists () {
      return this.$route.path.indexOf('playlist/expired') > -1
    }
  },

  methods: {
    ...mapMutations([
      'DEL_PLAYLIST_MPDP', 'IS_MPDP_PAGE_MPDP', 'UPDATE_PLAYSTS_MPDP', 'SET_RECUT_STATE'
    ]),
    ...mapActions([
      'getFileList', 'getmpdpPlaylists', 'deletempdpPlaylist', 'pubStopMpdpPlaylist', 'getmpdpExpiredPlaylists',
      'mpdpPlaylistProgress'
    ]),

    refresh () {
      this.getmpdpPlaylists()
    },

    // toolbar
    async querySearch (queryString, cb) {
      let result = await this.getFileList()
      cb(result)
    },

    _edit () {
      this.SET_RECUT_STATE(0)
    },

    _delete (item, index) {
      let me = this
      this.$confirm('此操作将永久删除该播出单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let res = this.deletempdpPlaylist(item)
        res.then(r => {
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

    async showProgress (playlist) {
      await this.mpdpPlaylistProgress(playlist.id)
      this.activeTnum = 1
      console.log('this.cutList:==>', this.cutList)
      for (const key in this.cutList) {
        if (this.cutList.hasOwnProperty(key)) {
          const element = this.cutList[key]
          let count = 0
          element.forEach(file => {
            if (file.progress === 100) {
              count++
            }
          })
          this.allProgress[key] = `${count}/${element.length}`
        }
      }
      console.log('this.allProgress:==>', this.allProgress)
      this.scene = playlist.content.scene
      this.isShowProgress = true
      // this.progress = this.cutList
      this.$nextTick(() => {
        this.click_screen(this.scene.column, 0, 1)
        this.screensTimeout = setTimeout(() => {
          this.resetProgress(playlist)
        }, 5000)
      })
    },

    async resetProgress (playlist) {
      console.log('resetProgress')
      await this.mpdpPlaylistProgress(playlist.id)
      for (const key in this.cutList) {
        if (this.cutList.hasOwnProperty(key)) {
          const element = this.cutList[key]
          let count = 0
          element.forEach(file => {
            if (file.progress === 100) {
              count++
            }
          })
          this.allProgress[key] = `${count}/${element.length}`
        }
      }
      this.scene = playlist.content.scene
      this.$nextTick(() => {
        this.progress = this.cutList[this.activeTnum]
        this.screensTimeout = setTimeout(() => {
          this.resetProgress(playlist)
        }, 5000)
      })
    },

    showScreens (val) {
      this.isShowScreens = true
      this.checkedDefault = []
      if (val.trees) {
        let data = []
        const trees = val.trees
        for (let i = 0; i < trees.length; i++) {
          data.push(trees[i].id)
        }
        this.checkedDefault = data
      }
      if (val.tagged) {
        let data = []
        const tags = val.tagged
        for (let i = 0; i < tags.length; i++) {
          data.push(tags[i])
        }
        this.tagged = data
      }
    },

    click_screen (col, vindex, tnum) {
      this.activeTnum = Number(col) * vindex + tnum
      this.progress = this.cutList[this.activeTnum]
      console.log('progress:==>', this.progress)
    },

    handleSelect (item) {
      console.log(item)
    },

    von_outerHide (data) {
      this.outerVisible = data
    },

    click_isrelease (item, index) {
      let me = this
      let msg = '是否要发布此播出单'
      if (item.status === 1) {
        msg = '是否要停止此播出单'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let res = this.pubStopMpdpPlaylist(item)
        res.then(res => {
          me.$notify.success({
            title: '操作成功！'
          })
          this.refresh()
          // me.UPDATE_PLAYSTS_MPDP(obj)
        })
        .catch(err => {
          me.$notify.error({
            title: `操作失败: ${err.message}!`
          })
        })
      })
    },
    click_check (item, index) {
      console.log(`item:==>`)
      console.log(item)
      this.listitem = item
      this.isshow = true
    }
  },

  watch: {
    playlists (v) {
      const data = JSON.parse(JSON.stringify(v))
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 3) {
          setTimeout(() => {
            //this.refresh()
          }, 2000)
          break
        }
      }
    },

    isShowProgress (v) {
      if (!v) {
        clearTimeout(this.screensTimeout)
        this.refresh()
      }
    }
  }
}
</script>
<style lang="scss">
.mpdp-playlist-content {
  .label-options {
    padding: 7px 10px 7px;
    border-radius: 4px;
    height: 36px;
    border: 1px solid #409EFF;
    margin: 10px 0 0 10px;
    color: #409EFF;
    font-size: 14px;
    display: inline-block;
  }
  .el-table {
    height: calc(100% - 36px);
    &.isexpired {
      height: 100%;
    }
  }
  .el-button {
    margin-left: 5px;
  }
  .fa-check,
  .fa-arrow-circle-o-right {
    color: #67C23A;
  }
  i.fs {
    font-size: 18px;
  }
  .virtualShow {
    // width: 825px;
    // margin-left: calc(50% - 412px);
    overflow-y: auto;
    display: table;
    &.verticalSceen {
      width: 525px;
      // margin-left: calc(50% - 262px);
      > div {
        &:nth-child(1) {
          width: 285px;
        }
      }
    }
    > div {
      // float: left;
      display: table-cell;
      vertical-align: top;
      &:nth-child(1) {
        // width: calc(100% - 240px);
        width: 585px;
        .screenRow {
          // display: table;
          // table-layout: fixed;
          width: 100%;
          > div {
            cursor: pointer;
            &.active {
              background-color: #909399;
              color: white;
            }
            font-size: 20px;
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            border: 1px solid #DCDFE6;
          }
        }
      }
      &:nth-child(2) {
        width: 240px;
        padding-left: 30px;
        // border-left: 1px solid #DCDFE6;
        .terminalInfo {
          position: sticky;
          top: 0;
          .el-form-item {
            margin-bottom: 0;
            .el-form-item__label {
              line-height: 30px;
            }
            .el-form-item__content {
              line-height: 30px;
              .el-progress {
                line-height: 30px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
