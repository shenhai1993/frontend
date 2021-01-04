<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>天气预报</span>
    </headerbar>
    <!-- container -->
    <div class="templateContainer">
      <!-- 按钮区 -->
      <div class="btn-context">
        <refresh-button v-on:refresh="refresh"></refresh-button>
        <el-tooltip class="item" effect="dark" content="添加" placement="bottom">
          <el-button icon="el-icon-plus" @click="dialogVisible = true"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
          <el-button disabled icon="el-icon-delete"></el-button>
        </el-tooltip>
      </div>
      <!-- 数据表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="编号" width="200"></el-table-column>
        <el-table-column prop="backgroundMusic" label="名称"></el-table-column>
        <el-table-column prop="screenOrientation" label="英文名" width="200"></el-table-column>
        <el-table-column prop="creater" label="天气" width="120"></el-table-column>
        <el-table-column prop="temperature" label="温度" width="160"></el-table-column>      
        <el-table-column prop="created" label="更新时间" width="200"></el-table-column>      
        <el-table-column prop="" label="更新" width="60" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="更新" placement="bottom">
              <el-button type="text" size="mini">
                <i class="fa fa-refresh"></i>
              </el-button>
            </el-tooltip>
            <!-- <el-tooltip effect="dark" content="删除" placement="bottom">
              <el-button type="text" @click="_delete(scope.row, scope.$index)" size="mini">
                <i class="fa fa-remove"></i>
              </el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加城市弹出层 -->
      <el-dialog  title="添加城市" :visible.sync="dialogVisible" width="30%">
        <el-form  label-width="80px">
          <el-form-item label="天气城市">
            <!-- <el-input v-model="form.name" auto-complete="off"></el-input> -->
            <el-select v-model="weatherCity" placeholder="请选择" size="medium">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">保存</el-button>
        </div>
      </el-dialog>
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
        name: '深圳试点播1',
        backgroundMusic: '菊次郎的春天.mp3',
        screenOrientation: '横屏',
        creater: '管理员',
        created: '2018-04-02 15:20:00',
        address: '上海市普陀区金沙江路 1518 弄',
        temperature: '35℃'
      },{
        name: '深圳试点播2',
        backgroundMusic: '菊次郎的春天.mp3',
        screenOrientation: '横屏',
        creater: '管理员',
        created: '2018-04-02 15:20:00',
        address: '上海市普陀区金沙江路 1518 弄',
        temperature: '35℃'
      },{
        name: '深圳试点播3',
        backgroundMusic: '菊次郎的春天.mp3',
        screenOrientation: '横屏',
        creater: '管理员',
        created: '2018-04-02 15:20:00',
        address: '上海市普陀区金沙江路 1518 弄',
        temperature: '35℃'
      },{
        name: '深圳试点播4',
        backgroundMusic: '菊次郎的春天.mp3',
        screenOrientation: '横屏',
        creater: '管理员',
        created: '2018-04-02 15:20:00',
        address: '上海市普陀区金沙江路 1518 弄',
        temperature: '35℃'
      }],
      options: [
        {
          label: '北京',
          value: '1'
        },
        {
          label: '上海',
          value: '2'
        },
        {
          label: '成都',
          value: '3'
        }
      ]
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    refresh () {
      // this.getPlayList()
    },

    _delete (item, index) {
      let me = this
      me.$confirm('是否删除此条天气？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {id: item.id}
        let res = me.deletePlayingList({item, data})
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
    }
  }
}
</script>

<style lang="scss" scoped>
.planting-content {
  height: 100%;
  width: 100%;
}
.btn-context {
  width: 100%;
  height: 80px;
}
</style>
