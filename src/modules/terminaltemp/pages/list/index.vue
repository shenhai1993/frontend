<template>
  <div class="terminaltemp-list" v-loading="loading">
    <div class="terminaltemp-list-header">
      <span>版面管理</span>
    </div>
    <div class="drug-warpper">
      <div class="new-btn">
        <el-button @click="createTemp" type="primary" size="small">新增版面</el-button>
        <el-dropdown @command="handleCommand">
          <el-button size="small">
            请选择<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="all">全部</el-dropdown-item>
            <el-dropdown-item command="open">已上线</el-dropdown-item>
            <el-dropdown-item command="close">未上线</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--<el-button @click="showMaterial = true" size="small">选择素材</el-button>-->
      </div>
      <div class="drug-warpper-main">
        <el-table
          :data="pagesList"
          style="width: 100%"
          height="100%">
          <el-table-column prop="item_type" label="版面ID" width="150"></el-table-column>
          <el-table-column prop="item_name" label="版面名称" width="150"></el-table-column>
          <el-table-column label="投放设备">
            <template slot-scope="scope">
              {{getDevice(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="ontime" label="上线时间" width="170"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.online == 1" class="dot-open"><span></span>已上线</div>
              <div v-else="" class="dot-close"><span></span>未上线</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="onlineTemp(scope.row)" type="text" size="small">{{scope.row.online == 1 ? '下线' : '上线'}}</el-button>
              <el-button @click="editTemp(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteTemp(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="useTemp(scope.row)" type="text" size="small">关联设备</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <terminals-form
      v-if="showForm"
      :array="deviceArray"
      :item="currItem"
      :show="showForm"
      @hideTerminalsForm="hideTerminalsForm"
      @commitTerminalsForm="commitTerminalsForm">
    </terminals-form>
    <select-material
      v-if="showMaterial"
      :show="showMaterial"
      @submitSelectMaterial="submitSelectMaterial"
      @closeSelectMaterial="closeSelectMaterial">
    </select-material>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'
import TerminalsForm from './terminalsForm.vue'
import SelectMaterial from '@/components/selectMaterial.vue'

export default {
  components: {
    TerminalsForm,
    SelectMaterial
  },

  data () {
    return {
      currentPage: 1,
      customizePages: 100,
      orgPagesList: [],
      pagesList: [],
      showForm: false,
      currItem: {},
      showMaterial: false,
      deviceArray: []
    }
  },

  computed: {
    ...mapState({
      loading: state => state.terminaltemp.loading
    })
  },

  mounted () {
    this.getList()
  },

  methods: {
    ...mapMutations([
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'loadingStatus'
    ]),

    createTemp() {
      const params = { id: 0, name: '' }
      this.$router.push({ path: '/terminaltemps/main', query: params })
    },

    async onlineTemp (row) {
      this.loadingStatus(true)
      const state = row.online == 1 ? 0 : 1
      const message = state == 1 ? '上线成功！' : '下线成功！'
      if (state == 1) {
        try {
          let s = await Terminaltemp.updateTempData(row)
          console.log('更新状态', s)
        } catch (err) {
          console.log('更新状态', err)
          this.$alert('数据更新失败，上线失败，请重试！', '错误', {
            confirmButtonText: '知道了'
          })
          this.loadingStatus(false)
          return
        }
      }
      Terminaltemp.modelOnline({ id: row.id, online: state }).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          this.$message({
            message: message,
            type: 'success'
          })
          this.getList()
          Terminaltemp.getModelShow(row.id)
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.loadingStatus(false)
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    editTemp(row){
      const state = row.online
      if (state == 1) {
        this.$alert('请下线后再编辑！', '提示', {
          confirmButtonText: '知道了'
        })
        return
      }
      const params = { id: row.id, name: row.item_name }
      this.$router.push({ path: '/terminaltemps/main', query: params })
    },

    deleteTemp(row){
      const state = row.online
      if (state == 1) {
        this.$alert('请下线后再删除！', '提示', {
          confirmButtonText: '知道了'
        })
        return
      }
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loadingStatus(true)
        Terminaltemp.removeTemp(row.id).then(res => {
          this.loadingStatus(false)
          if (res.data.success) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          } else {
            this.$alert(res.data.message, '错误', {
              confirmButtonText: '知道了'
            })
          }
        }).catch(() => {
          this.loadingStatus(false)
          this.$alert('出错啦，请重试！', '错误', {
            confirmButtonText: '知道了'
          })
        })
      }).catch(() => {})
    },

    useTemp (row) {
      const state = row.online
      if (state == 1) {
        this.$alert('请下线后再关联设备！', '提示', {
          confirmButtonText: '知道了'
        })
        return
      }
      this.currItem = row
      this.showForm = true
    },

    getList () {
      this.loadingStatus(true)
      Terminaltemp.getShow(this.currentPage, this.customizePages).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          this.pagesList = this.orgPagesList = res.data.message.data
          this.getDeviceData(res.data.message.data)
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.loadingStatus(false)
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    getDeviceData (val) {
      const data = val
      this.deviceArray = []
      for (let i = 0; i < data.length; i++) {
        const device = data[i].device
        if (device === null || device == '') {
          return
        }
        const deviceData = JSON.parse(device).data
        for (let j = 0; j < deviceData.length; j++) {
          let curr = deviceData[j]
          curr = Object.assign({}, curr, { model_Id: data[i].id })
          this.deviceArray.push(curr)
        }
      }
    },

    getDevice (row) {
      if (row.device === null) {
        return
      }
      const deviceData = JSON.parse(row.device)
      const data = deviceData.data
      let device = ''
      for (let i = 0; i < data.length; i++) {
        device += i == 0 ? data[i].name : '、' + data[i].name
      }
      return device
    },

    commitTerminalsForm () {
      this.showForm = false
      this.getList()
    },

    hideTerminalsForm () {
      this.showForm = false
    },

    handleCommand (com) {
      if (com == 'all') {
        this.pagesList = this.orgPagesList
      } else if (com == 'open') {
        let newData = []
        for (let i = 0; i < this.orgPagesList.length; i++) {
          if (this.orgPagesList[i].online == 1) {
            newData.push(this.orgPagesList[i])
          }
        }
        this.pagesList = newData
      } else if (com == 'close') {
        let newData = []
        for (let i = 0; i < this.orgPagesList.length; i++) {
          if (this.orgPagesList[i].online == 0) {
            newData.push(this.orgPagesList[i])
          }
        }
        this.pagesList = newData
      }
    },

    submitSelectMaterial (data) {
      this.showMaterial = false
      console.log(data)
    },

    closeSelectMaterial () {
      this.showMaterial = false
    }
  }
}
</script>

<style lang="scss">
  .terminaltemp-list {
    .el-table__header-wrapper th {
      background-color: #F5F7FA;
    }
    .el-table .el-button--text {
        color: #409EFF;
    }
  }
</style>
<style lang="scss" scoped>
  .terminaltemp-list {
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    .terminaltemp-list-header {
      display: block;
      height: 52px;
      line-height: 52px;
      color: #1989fa;
      font-size: 16px;
      border-bottom: 1px solid #EBEEF5;
      padding: 0 30px;
      > span {
        display: block;
        position: relative;
        width: 76px;
        text-align: center;
      }
      > span:after {
        content: "";
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        width: 76px;
        height: 2px;
        background: #409eff;
      }
    }
    .drug-warpper{
      height: calc(100% - 75px);
      padding: 15px;
      .new-btn{
        margin-bottom: 20px;
        .el-dropdown {
          margin-left: 10px;
        }
      }
      .drug-warpper-main {
        height: calc(100% - 50px);
        .dot-open > span, .dot-close > span {
          display: inline-block;
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          margin: -3px 10px 0 0;
          background-color: #077df5;
          vertical-align: middle;
        }
        .dot-close > span {
          background-color: #606266;
        }
      }
    }
    .el-icon-question{
      font-size: 18px;
      vertical-align: text-bottom
    }
    .pages-block {
      margin-top: 20px;
      text-align: right;
      .customize-box {
        text-align: right;
        font-size: 13px;
        font-weight: 400;
        color: #606266;
        .customize-pages {
          width: 130px;
          display: inline-block;
          margin: 5px 10px;
        }
      }
    }
  }
</style>
