<template>
  <div class="planting-content">
    <!-- 按钮区 -->
    <div class="btn-context">
      <refresh-button v-on:refresh="refresh"></refresh-button>
      <el-tooltip class="item" effect="dark" content="添加" placement="bottom">
        <el-button icon="el-icon-plus" @click="dialogVisible = true"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="删除" placement="bottom" disabled>
        <el-button icon="el-icon-delete"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="发布" placement="bottom">
        <el-button icon="el-icon-caret-right">发布</el-button>
      </el-tooltip>
    </div>
    <!-- 数据表格 -->
    <el-table :data="playingList" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" ></el-table-column>
      <el-table-column prop="name" label="点播名称" width="200"></el-table-column>
      <el-table-column prop="backgroundMusic" label="背景音乐"></el-table-column>
      <el-table-column prop="screenOrientation" label="点播屏幕方向" width="120"></el-table-column>
      <el-table-column prop="creater" label="创建人" width="120"></el-table-column>
      <el-table-column prop="created" label="创建时间" width="200"></el-table-column>      
      <el-table-column prop="" label="操作" width="80">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改" placement="bottom">
            <el-button type="text" size="mini">
              <i class="fa fa-pencil"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="bottom">
            <el-button type="text" @click="_delete(scope.row, scope.$index)" size="mini">
              <i class="fa fa-remove"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加点播弹出层 -->
    <el-dialog  title="创建点播" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="140px" size="medium">
        <el-form-item label="点播名称">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            accept="mp3,mp4"
            :on-change="handleChange"
            :file-list="fileList3">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload> -->
        </el-form-item>
        <el-form-item label="适应屏幕">
          <el-radio-group v-model="form.screenOrientation">
            <el-radio label="横屏"></el-radio>
            <el-radio label="竖屏"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="返回时间(/秒)">
            <el-input-number v-model="form.time" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RefreshButton from '@/components/RefreshButton'
import { mapActions, mapState } from 'vuex'

export default {
   data() {
    return {
      form: {
        name: '',
        screenOrientation: '横屏',
        backgroundMusic: '',
        time: ''
      },
      dialogVisible: false,
      multipleSelection: []
      // deleteSelection: false
      // tableData: [{
      //   name: '深圳试点播1',
      //   backgroundMusic: '菊次郎的春天.mp3',
      //   screenOrientation: '横屏',
      //   creater: '管理员',
      //   created: '2018-04-02 15:20:00',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // },{
      //   name: '深圳试点播2',
      //   backgroundMusic: '菊次郎的春天.mp3',
      //   screenOrientation: '横屏',
      //   creater: '管理员',
      //   created: '2018-04-02 15:20:00',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // },{
      //   name: '深圳试点播3',
      //   backgroundMusic: '菊次郎的春天.mp3',
      //   screenOrientation: '横屏',
      //   creater: '管理员',
      //   created: '2018-04-02 15:20:00',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // },{
      //   name: '深圳试点播4',
      //   backgroundMusic: '菊次郎的春天.mp3',
      //   screenOrientation: '横屏',
      //   creater: '管理员',
      //   created: '2018-04-02 15:20:00',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }]
    }
  },
  components: {
    RefreshButton
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    refresh () {
      this.getPlayList()
    },

    _delete (item, index) {
      let me = this
      me.$confirm('是否删除此条点播：' + item.name + '？', '提示', {
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
    },

    ...mapActions ([
      'getPlayingList',
      'deletePlayingList'
    ])
  },
  computed: {
    ...mapState({
      playingList: state => state.vod.playingList
    })
  },
  mounted () {
    this.getPlayingList()
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
