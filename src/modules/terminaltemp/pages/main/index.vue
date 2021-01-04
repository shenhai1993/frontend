<template>
  <div class="terminaltemp-index" v-loading="loading">
    <div class="terminaltemp-index-header">
      <div class="terminaltemp-index-header-col-1">版面列表</div>
      <div class="terminaltemp-index-header-col-2">新增版面</div>
      <div class="terminaltemp-index-header-col-3">
        <el-button @click="doCommit" type="primary" round>保存</el-button>
        <el-button @click="cancelAllModelData" round>取消</el-button>
      </div>
    </div>
    <div class="terminaltemp-index-shadow"></div>
    <div class="terminaltemp-index-row">
      <div class="terminaltemp-index-col-1">
        <select-model></select-model>
      </div>
      <div class="terminaltemp-index-col-2">
        <sims-view></sims-view>
      </div>
      <div class="terminaltemp-index-col-3">
        <component
          :is="indexPageEditData.name">
        </component>
        <div
          v-show="indexPageEditData.name == ''"
          style="font-size: 16px; padding: 20px;">请在模拟器选择要编辑的模块</div>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="showModelName"
      width="325px"
      center>
      <el-form :model="modelInfo">
        <el-form-item label="版面名称：" label-width="100px">
          <el-input v-model="modelInfo.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commitModelName" type="primary" size="small" round>保存</el-button>
        <el-button @click="showModelName = false" size="small" round>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SimsView from '../../components/simsView.vue'
import SelectModel from '../../components/selectModel.vue'
import { Terminaltemp } from '../../static/js/terminaltemp.js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    SimsView,
    SelectModel,
    PositionInfo: () => import ('../../components/editcoms/positionInfo.vue'),
    ProductList: () => import ('../../components/editcoms/productList.vue'),
    EditSimsAd: () => import ('../../components/editcoms/editSimsAd.vue'),
    EditSimsAdsingle: () => import ('../../components/editcoms/editSimsAdsingle.vue'),
    EditSimsLogo: () => import ('../../components/editcoms/editSimsLogo.vue'),
    EditAdCustom: () => import ('../../components/editcoms/editAdCustom.vue')
  },

  data () {
    return {
      modelInfo: {
        id: 0,
        name: ''
      },
      showModelName: false
    }
  },

  computed: {
    ...mapState({
      simsViewData: state => state.terminaltemp.simsViewData,
      loading: state => state.terminaltemp.loading,
      indexPageEditData: state => state.terminaltemp.indexPageEditData,
      simsResetWH: state => state.terminaltemp.simsResetWH
    })
  },

  created () {
    const query = this.$route.query
    this.modelInfo = Object.assign({}, this.modelInfo, query)
  },

  mounted () {
    if (this.modelInfo.id != 0) {
      this.getTemplate()
    }
  },

  methods: {
    ...mapMutations([
      'GET_TEMPLATE_DATA',
      'LOADING_STATUS',
      'COMMIT_STATUS',
      'CLEAR_SIMS_VIEW_DATA',
      'SET_INDEXPAGE_EDITDATA'
    ]),

    ...mapActions([
      'getTemplateData',
      'loadingStatus',
      'setCommitStatus',
      'clearSimsViewData',
      'setIndexPageEditData'
    ]),

    getTemplate () {
      this.loadingStatus(true)
      Terminaltemp.getModelShow(this.modelInfo.id).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          const data = JSON.parse(res.data.message.item_data)
          this.getTemplateData(data)
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

    doCommit () {
      if (this.simsViewData.length == 0) {
        this.$alert('您还没有添加内容！', '提示', {
          confirmButtonText: '知道了',
          type: 'warning'
        })
        return
      }
      this.showModelName = true
    },

    commitModelName () {
      this.commitAllModelData()
    },

    commitAllModelData () {
      this.loadingStatus(true)
      this.setCommitStatus(true)
      this.showModelName = false
      setTimeout(() => {
        let newSimsViewData = []
        const oldSimsViewData = JSON.parse(JSON.stringify(this.simsViewData))
        const nodes = document.getElementsByClassName('terminaltemp-sortable')[0].children
        for (let i = 0; i < nodes.length; i++) {
          const key = parseInt(nodes[i].attributes['data-key'].value)
          for (let k = 0; k < oldSimsViewData.length; k++) {
            if (key == oldSimsViewData[k].key) {
              newSimsViewData.push(oldSimsViewData[k])
              oldSimsViewData.splice(k, 1)
              break
            }
          }
        }
        const sims_wh = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
        const tempData = {
          sims_wh: JSON.stringify(sims_wh),
          id: this.modelInfo.id,
          item_name: this.modelInfo.name,
          item_data: JSON.stringify(newSimsViewData)
        }
        Terminaltemp.createTemplate(tempData).then(res => {
          if (res.data.success) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            setTimeout(() => {
              this.setCommitStatus(false)
              this.loadingStatus(false)
              //退回模板列表
              this.$router.go(-1)
            }, 2000)
          } else {
            this.loadingStatus(false)
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
      }, 100)
    },

    cancelAllModelData () {
      this.$confirm('确定要取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        //退回模板列表
        this.$router.go(-1)
      }).catch(() => {})
    }
  },

  beforeDestroy () {
    this.clearSimsViewData()
    this.setIndexPageEditData({ name: '' })
  }
}
</script>
