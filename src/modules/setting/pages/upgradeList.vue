<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>下发记录</span>
    </headerbar>
    <!-- container -->
    <div class="templateContainer">
      <!-- 按钮区 -->
      <div class="btn-context">
        <refresh-button v-on:refresh="refresh"></refresh-button>
        <el-tooltip class="item" effect="dark" content="返回" placement="bottom">
          <el-button icon="el-icon-plus"></el-button>
        </el-tooltip>
      </div>
      <!-- 数据表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="文件名" width="200"></el-table-column>
        <el-table-column prop="size" label="大小"></el-table-column>
        <el-table-column prop="username" label="下发人" width="200"></el-table-column>     
        <el-table-column prop="created" label="下发时间" width="200"></el-table-column>      
        <el-table-column prop="" label="查看" width="60" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看分组" placement="bottom">
              <el-button type="text" size="mini">
                <i class="fa fa-refresh"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import RefreshButton from '@/components/RefreshButton'
import headerbar from '@/components/HeaderBar'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    RefreshButton, headerbar
  },
  data() {
    return {
      form: {
        name: '',
        screenOrientation: '横屏',
        backgroundMusic: '',
        time: ''
      },
      weatherCity: '',
      dialogVisible: false,
      tableData: [{
        name: 'tset.zip',
        size: '13.25MB',
        username: '管理员',
        created: '2018-04-02 15:20:00'
      }]
    }
  },
  methods: {
    refresh () {
      // this.getPlayList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-context {
    width: 100%;
    height: 80px;
  }
</style>
