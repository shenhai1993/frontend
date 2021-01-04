<template>
  <el-table :data="tabData"
            ref="multipleTable"
            :height="tableHeight"
            :class="{isexpired: isexpiredPlayLists}"
            tooltip-effect="dark"
            style="width: 100%;"
            stripe
            @selection-change="tableSelectionChange"
            empty-text="没有播出单">
    <el-table-column type="selection" width="55" align="center"></el-table-column>
    <el-table-column  prop="status" align="center"
                      label="状态"
                      width="60"
                      show-overflow-tooltip>
      <template slot-scope="scope">
        <!-- 0 可用 1 未审核 2 驳回 3 已发布 4 已过期-->
        <el-tooltip v-if="scope.row.status === Status.AUDIT" effect="dark" content="审核中" placement="bottom">
          <i class="fa fa-bell"></i>
        </el-tooltip>
        <el-tooltip v-if="scope.row.status === Status.AVAILABLE" effect="dark" content="可用" placement="bottom">
          <i class="fa fa-caret-right "></i>
        </el-tooltip>
        <el-tooltip v-if="scope.row.status === Status.UNPASSED" effect="dark" :content="`未通过: ${scope.row.audit_reason}`" placement="bottom">
          <i class="fa fa-ban"></i>
        </el-tooltip>
        <!-- 已过期 -->
        <el-tooltip class="item" effect="dark" content="已过期" placement="bottom"
                    v-if="scope.row.status === Status.EXPIRED">
          <i class="fa fa-warning"></i>
        </el-tooltip>
        <!-- 已发布 -->
        <el-tooltip
          class="item"
          effect="dark"
          v-if="scope.row.status === Status.PUBLISHED" content="已发布" placement="bottom">
          <i class="fa fa-check"></i>
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
            <span :class="scope.row.direction === 1 ? 'vertical' : 'horizontal'">
              {{ scope.row.direction === 1 ? '竖屏' : '横屏' }}
            </span>
      </template>
    </el-table-column>
    <el-table-column prop="startdate"
                     label="播放日期"
                     align='center'
                     show-overflow-tooltip>
      <template slot-scope="scope">
        <p>{{ scope.row.schedule.date.start }}</p>
        <p>|</p>
        <p>{{ scope.row.schedule.date.end }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="starttime"
                     label="播出时段"
                     align='center'
                     show-overflow-tooltip>
      <template slot-scope="scope">
        <p>{{ scope.row.schedule.time.start }}</p>
        <p>|</p>
        <p>{{ scope.row.schedule.time.end }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="size"
                     label="素材大小"
                     width="120"
                     show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.total_size | filesize }}
      </template>
    </el-table-column>
    <el-table-column label="创建人" prop="user.name"></el-table-column>

    <!-- 操作区 -->
    <el-table-column label="操作" align="center" width="150">
      <template slot-scope="scope">
        <router-link v-if="[Status.EXPIRED, Status.AVAILABLE].includes(scope.row.status)" :to="`edit/${scope.row.id}`">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
            <el-button type="text" size="mini" @click="itemTabData(scope.row)">
              <i class="fa fa-pencil"></i>
            </el-button>
          </el-tooltip>
        </router-link>

        <!-- <span v-if="scope.row.status === Status.AVAILABLE || scope.row.status === Status.PUBLISHED" @click="click_isrelease(scope.row)"> -->
        <el-tooltip v-if="scope.row.status === Status.AVAILABLE" class="item" effect="dark" content="发布" placement="bottom">
          <el-button @click="click_tab_isrelease(scope.row)" type="text" size="mini">
            <i class="fa fa-arrow-circle-o-right"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip v-if="scope.row.status === Status.PUBLISHED" class="item" effect="dark" content="停止" placement="bottom">
          <el-button @click="click_tab_isrelease(scope.row)" type="text" size="mini">
            <i class="fa fa-stop-circle-o"></i>
          </el-button>
        </el-tooltip>
        <!-- </span> -->
        <el-tooltip v-if="scope.row.status !== Status.PUBLISHED" class="item" effect="dark" content="删除" placement="bottom">
          <el-button type="text" size="mini" @click="tab_delete(scope.row, scope.$index)">
            <i class="fa fa-trash"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
          <el-button type="text" size="mini" @click="tab_preview(scope.row)">
            <i class="fa fa-play-circle"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="查看更多" placement="bottom">
          <el-button type="text" size="mini" @click="click_tab_more(scope.$index, scope.row)">
            <i class="fa fa-ellipsis-v"></i>
          </el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
    import Status from '@static/js/utils/status'
    export default {
        props:{
          tabData:{
            type: Array,
            default: []
          },
          isexpiredPlayLists: {

          }
        },
        data(){
          return{
            tableHeight: window.innerHeight - 270,
            Status
          }
        },
      mounted() {
      },
      methods:{
          tableSelectionChange(val){
            this.$emit('handleSelectionChange', val)
          },
          clearSelection(){
            this.$refs.multipleTable.clearSelection()
          },
          itemTabData(row){
            this.$emit('itemData', row)
          },
          click_tab_isrelease(row) {
            this.$emit('click_isrelease', row)
          },
          tab_delete(row, index) {
            this.$emit('_delete', row,index)
          },
          tab_preview(row) {
            this.$emit('_preview', row)
          },
          click_tab_more(index, row) {
            this.$emit('click_more', index, row)
          },
        }
    }
</script>

<style scoped>

</style>
