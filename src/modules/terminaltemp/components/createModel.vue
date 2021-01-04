<template>
  <el-drawer
    title="自定义模型"
    :visible="showCreateModel"
    :before-close="handleClose"
    :with-header="false"
    size="60%"
    v-loading="loading">
    <el-container>
      <el-header>自定义模型</el-header>
      <el-container>
        <el-aside width="50%">
          <div class="card" style="margin-top: 15px;" :style="{ width: simsResetWH[0], height: simsResetWH[1] }">
            <component
              :is="componentName"
              :comData="commitData"
              @currentModelDataEmit="currentModelDataEmit">
            </component>
          </div>
        </el-aside>
        <el-main v-if="commitData.special_type == 'product-model'">
          <steps-list
            :comData="commitData"
            @stepsEmit="stepsEmit"
            @stepsIdEmit="stepsIdEmit">
          </steps-list>
        </el-main>
        <el-main v-else-if="commitData.special_type == 'ad-carousel'">
          <ad-update
            :adList="adListData"
            @adUpdateEmit="adUpdateEmit">
          </ad-update>
        </el-main>
        <el-main v-else-if="commitData.special_type == 'logo-model'">
          <logo-update
            :logoList="logoListData"
            @logoUpdateEmit="logoUpdateEmit">
          </logo-update>
        </el-main>
      </el-container>
      <el-footer>
        <span>
          <el-button @click="commitModelData" type="primary">完 成</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../static/js/terminaltemp.js'

export default {
  components: {
    EditAdCarousel: () => import ('./editcoms/editAdCarousel.vue'),
    EditProductModel: () => import ('./editcoms/editProductModel.vue'),
    EditLogoModel: () => import ('./editcoms/editLogoModel.vue'),
    StepsList: () => import ('./editcoms/stepsList.vue'),
    AdUpdate: () => import ('./editcoms/adUpdate.vue'),
    LogoUpdate: () => import ('./editcoms/logoUpdate.vue')
  },

  props: {
    isShow: {
      type: Boolean
    },

    currentData: {
      type: Object
    },

    originData: {
      type: Object
    }
  },

  data () {
    return {
      showCreateModel: this.isShow,
      componentName: 'edit-product-model',
      commitData: {},
      productId: {
        id: 0,
        category_id: 0,
        cname: ''
      },
      adListData: [],
      logoListData: []
    }
  },

  computed: {
    ...mapState({
      simsResetWH: state => state.terminaltemp.simsResetWH,
      baseWH: state => state.terminaltemp.baseWH,
      simsViewData: state => state.terminaltemp.simsViewData,
      loading: state => state.terminaltemp.loading
    })
  },

  created() {
    this.getCurrentModelData()
  },

  mounted() {

  },

  methods: {
    ...mapMutations([
      'GET_TEMPLATE_DATA',
      'DRAG_SIMS_VIEW_MODEL',
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'getTemplateData',
      'dragSimsViewModel',
      'loadingStatus'
    ]),

    handleClose (done) {
      this.$confirm('正在编辑，确认关闭吗？', '提示', {
        type: 'warning'
      }).then(() => {
          this.$emit('closeCreateModel')
          this.showCreateModel = false
          done()
      }).catch(() => {})
    },

    getCurrentModelData () {
      this.commitData = JSON.parse(JSON.stringify(this.currentData))
      this.componentName = 'edit-' + this.commitData.special_type
      if (this.commitData.special_type == 'ad-carousel') {
        this.adListData = this.commitData.comData
      }
      if (this.commitData.special_type == 'logo-model') {
        this.logoListData = this.commitData.comData
      }
    },

    currentModelDataEmit (data) {
      this.commitData = JSON.parse(JSON.stringify(data))
    },

    getCommitModelData () {
      let data = JSON.parse(JSON.stringify(this.commitData))
      data.comData[0].id = this.productId.id
      //let comData = JSON.stringify(data.comData)
      //data.comData = comData
      return data
    },

    commitModelData () {
      if (this.productId.id == 0 && this.commitData.special_type == 'product-model') {
        this.$message({
          message: '请添加关联商品：选择商品 > 添加内容',
          type: 'warning'
        })
        return false
      }
      this.loadingStatus(true)
      const data = this.getCommitModelData()
      let modelData = {
        id: data.id,
        special_name: data.special_name,
        special_type: data.special_type,
        thumbImage: data.thumbImage,
        comData: JSON.stringify(this.originData)
      }
      Terminaltemp.createModel(modelData).then(res => {
        if (res.data.success) {
          const data = res.data.message
          this.commitTempData(data.id)
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    commitTempData (id) {
      const data = this.getCommitModelData()
      const top = Terminaltemp.getSimsViewModelTop(this.simsViewData, this.simsViewData.length)
      const oldSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      const newSimsWH = [parseFloat(this.baseWH[0]), parseFloat(this.baseWH[1])]
      let comData = data.comData
      if (data.special_type == 'product-model') {
        for (let i = 0; i < comData.length; i++) {
          let attr = comData[i].attr
          for (let i = 0; i < attr.length; i++) {
            if (attr[i].type == 'image') {
              attr[i].width = Terminaltemp.getNewW(attr[i].width, oldSimsWH, newSimsWH)
              attr[i].height = Terminaltemp.getNewH(attr[i].height, oldSimsWH, newSimsWH)
            }
            attr[i].left = Terminaltemp.getNewW(attr[i].left, oldSimsWH, newSimsWH)
            attr[i].top = Terminaltemp.getNewH(attr[i].top, oldSimsWH, newSimsWH)
          }
          comData[i].attr = attr
        }
      }
      let item_data = {
        simsWH: newSimsWH,
        special_id: id,
        item_type: data.item_type,
        special_name: data.special_name,
        special_type: data.special_type,
        thumbImage: data.thumbImage,
        width: data.width || 0,
        height: data.height,
        top: top,
        leftlength: data.leftlength || 0,
        comData: JSON.stringify(comData)
      }
      item_data.width = Terminaltemp.getNewW(item_data.width, oldSimsWH, newSimsWH)
      item_data.leftlength = Terminaltemp.getNewW(item_data.leftlength, oldSimsWH, newSimsWH)
      item_data.height = Terminaltemp.getNewH(item_data.height, oldSimsWH, newSimsWH)
      item_data.top = Terminaltemp.getNewH(item_data.top, oldSimsWH, newSimsWH)
      let tempData = {
        id: data.id,
        special_id: id,
        item_type: data.item_type,
        special_type: data.special_type,
        item_data: JSON.stringify(item_data)
      }
      Terminaltemp.createTemplate(tempData).then(res => {
        if (res.data.success) {
          this.saveTemplateData()
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    saveTemplateData () {
      Terminaltemp.getShow(1, 100).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          const data = res.data.message
          this.getTemplateData(data)
          this.$emit('closeCreateModel')
          this.showCreateModel = false
          //this.dragSimsViewModel()
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
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

    stepsEmit (val) {
      const data = JSON.parse(JSON.stringify(val))
      const comData = [{
        id: this.productId.id,
        category_id: this.productId.category_id,
        cname: this.productId.cname,
        attr: data
      }]
      this.commitData.comData = []
      this.$nextTick(() => {
        this.commitData = Object.assign({}, this.commitData, {comData: comData})
      })
    },

    stepsIdEmit (v) {
      this.productId = JSON.parse(JSON.stringify(v))
    },

    adUpdateEmit (data) {
      let dataArr = []
      for (let i = 0; i < data.length; i++) {
        dataArr.push({
          mainImg: data[i].url
        })
      }
      this.commitData.comData = dataArr
    },

    logoUpdateEmit (data) {
      let dataArr = []
      for (let i = 0; i < data.length; i++) {
        dataArr.push({
          mainImg: data[i].url
        })
      }
      this.commitData.comData = dataArr
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../static/css/terminaltemp.scss';

  .terminaltemp-index {
    .el-container {
      .card {
        overflow: hidden;
      }
    }
  }
</style>
