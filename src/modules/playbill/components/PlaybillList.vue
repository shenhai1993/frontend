<template>
  <div class="playbill-context">

    <!-- 按钮区 -->
    <div class="btn-context">
      <refresh-button v-on:refresh="refresh"></refresh-button>
      <el-button  @click="createPlaybill" plain>
        <i class="fa fa-plus"></i>
      </el-button>
    </div>

    <!-- 弹出框 -->
    <playbill-create 
      :playbill="playbill" 
      :type="type"
      :index="index"
      :title="title"
    ></playbill-create>

    <!-- 列表区 -->
    <el-table :data="playbillList" class="playbill-table">
      <el-table-column prop="status" label="状态" width="50"></el-table-column>
      <el-table-column prop="name" label="名称" width="100"></el-table-column>
      <el-table-column prop="creator" label="创建人"></el-table-column>
      <el-table-column label="播放日期" width="100"></el-table-column>
      <el-table-column label="开始时间" width="150"></el-table-column>
      <el-table-column label="总时长" width="150"></el-table-column>
      <el-table-column label="结束时间" width="150"></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="bottom">
            <i class="fa fa-pencil" @click="editPlaybill(scope)"></i>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status !== 1" effect="dark" content="删除" placement="bottom">
            <i class="fa fa-remove" @click="removePlaybill(scope)"></i>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 0" effect="dark" content="发布" placement="bottom">
            <i class="fa fa-arrow-circle-o-right" @click="release(scope)"></i>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 1" effect="dark" content="停止" placement="bottom">
            <i class="fa fa-stop-circle-o" @click="stop(scope)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import RefreshButton from '@/components/RefreshButton'
import PlaybillCreate from './PlaybillCreate'
import {mapState, mapMutations} from 'vuex'
import http from '@static/js/utils/http'

const TYPE_CREATE = 1
const TYPE_EDIT = 2

export default {
  components: {
    RefreshButton, PlaybillCreate
  },

  data () {
    return {
      searchText: '',
      playbill: {},
      type: TYPE_CREATE,
      index: -1,
      title: '创建直播流'
    }
  },

  computed: {
    ...mapState({
      playbillList: state => state.playbill.playbillList
    })
  },

  methods: {
    ...mapMutations([
      'SHOW_PLAYBILL_EDIT'
    ]),

    refresh () {
      console.log('do refresh')
    },

    createPlaybill () {
      this.type = TYPE_CREATE
      this.playbill = null
      this.title =
      this._showEdit()
    },

    editPlaybill (scope) {
      console.log(`scope:==>`)
      console.log(scope)
      this.type = TYPE_EDIT
      this.playbill = scope.row
      this.index = scope.$index
      this._showEdit()
    },

    removePlaybill (scope) {
      console.log('remove')
    },

    release (scope) {
      console.log('release')
    },

    stop (scope) {
      console.log('stop')
    },

    _showEdit () {
      this.SHOW_PLAYBILL_EDIT(true)
    },
  },

  mounted () {
    http.get('http://localhost:3000/posts').then(res => {
      console.log(`res:==>`)
      console.log(res)
    })
  }
}
</script>

<style lang="scss" scoped>
.playbill-context{
  .el-input{
    width: 200px;
  }
  .playbill-table{
    .fa{
      margin-right: 8px;
      cursor: pointer;
    }
  }
}
</style>
