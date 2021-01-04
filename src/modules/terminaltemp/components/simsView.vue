<template>
  <el-container style="position: relative;">
    <!--
    <el-header height="40px">
      <el-row>
        <el-col :span="24">模拟显示区</el-col>
        <el-col :span="12">
          <el-select v-model="resValue" @change="changeValue" placeholder="请选择" size="mini" style="width: 70%;">
            <el-option
              v-for="item in resArray"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-header>
    -->
    <el-main>
<!--      <div class="card" :style="{ width: simsResetWH[0], height: simsResetWH[1] }"></div>
 -->
      <div class="terminaltemp-sims" :style="{ width: simsResetWH[0], minHeight: simsResetWH[1] }">
        <ul ref="terminaltempSortable" class="terminaltemp-sortable">
          <li
            v-for="(item, index) in newSimsViewData"
            :key="item.key"
            :data-key="item.key"
            @click="selectLiDelete(item.key)">
            <component
              :is="item.special_type"
              :comData="item"
              :modelIndex="index"
              @getActionIndex="getActionIndex">
            </component>
            <div
              v-show="item.key == simsviewDeleteShow"
              class="simsview-main-delete-icon"
              @click="doDelete(index)">
            </div>
          </li>
        </ul>
      </div>

<!--        <component
          v-for="(item, index) in newSimsViewData"
          :key="item.key"
          :is="item.special_type"
          :comData="item"
          :modelIndex="index"
          @getActionIndex="getActionIndex">
        </component>
 -->
    </el-main>
  </el-container>
</template>

<script>
import { EditAction } from '../static/js/editAction.js'
import { Terminaltemp } from '../static/js/terminaltemp.js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    AdCarousel: () => import ('./modelcoms/adCarousel.vue'),
    AdSingle: () => import ('./modelcoms/adSingle.vue'),
    LogoModel: () => import ('./modelcoms/logoModel.vue'),
    MenuProductOne: () => import ('./modelcoms/menu-product-one.vue'),
    MenuProductTwo: () => import ('./modelcoms/menu-product-two.vue'),
    AdCustom: () => import ('./modelcoms/adCustom.vue'),
    ProductCustom: () => import ('./modelcoms/productCustom.vue'),
    MenuCustom: () => import ('./modelcoms/menuCustom.vue'),
    DividerCustom: () => import ('./modelcoms/dividerCustom.vue')
  },

  data () {
    return {
      resArray: [
        {
          value: '768x1024'
        },
        {
          value: '1024x768'
        },
        {
          value: '375x667'
        }
      ],
      resValue: '1080x1920',
      simsOffsetWH: ['100%', '100%'],
      simsResetWH: ['489px', '868px'],
      newSimsViewData: [],
      actionType: 'init',
      actionIndex: 0,
      currentModelData: {},
      showEditModel: false,
      showFooter: false,
      simsviewDeleteShow: -1
    }
  },

  computed: {
    ...mapState({
      simsViewData: state => state.terminaltemp.simsViewData,
      simsviewDragData: state => state.terminaltemp.simsviewDragData
    })
  },

  created () {

  },

  mounted () {
    this.initPage()
    this.$nextTick(() => {
      document.addEventListener('click', this.cencelDeleteFunc)
    })
  },

  methods: {
    ...mapMutations([
      'REMOVE_SIMS_VIEW_DATA',
      'SIMS_RESET_WH',
      'BASE_WH',
      'GET_TEMPLATE_DATA',
      'DRAG_SIMS_VIEW_MODEL',
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'removeSimsViewData',
      'setSimsResetWH',
      'setBaseWH',
      'getTemplateData',
      'dragSimsViewModel',
      'loadingStatus'
    ]),

    cencelDeleteFunc (event) {
      const e = event || window.event
      if (this.$refs.terminaltempSortable && !this.$refs.terminaltempSortable.contains(e.target)) {
        const path = e.path
        for (let i = 0; i < path.length; i++) {
          const className = path[i].className
          if (className && className.search('terminaltemp-index-col-3') > -1) {
            return false
          }
        }
        this.simsviewDeleteShow = -1
      }
    },

    initPage () {
      this.baseWH(this.resValue)
      this.getSimsOffsetWH('terminaltemp-sims')
      this.setSimsWH(this.resValue, this.simsOffsetWH)
      this.$nextTick(() => {
        EditAction.Sortable('.terminaltemp-sortable', { axis: 'y', placeholder: 'ui-state-highlight', update: this.sortableUpdate })
      })
    },

    getSimsOffsetWH (name) {
      this.simsOffsetWH = Terminaltemp.getOffsetWH(name)
    },

    setSimsWH (val, wh) {
      this.simsResetWH = Terminaltemp.setWidthXHeight(val, wh)
      this.setSimsResetWH(this.simsResetWH)
    },

    baseWH (val) {
      const wh = val.split('x')
      const data = [parseFloat(wh[0]), parseFloat(wh[1])]
      this.setBaseWH(data)
    },

    changeValue (val) {
      this.setSimsWH(val, this.simsOffsetWH)
      this.baseWH(val)
    },

    getActionIndex (data) {
      this.actionType = data.t
      this.actionIndex = data.i
    },

    sortableUpdate (event, ui) {
      //console.log('Update: ', event, ui)
    },

    selectLiDelete (k) {
      this.simsviewDeleteShow = k
    },

    doDelete (idx) {
      this.$confirm('确定要移除该模块吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.simsviewDeleteShow = -1
        this.getActionIndex({ t: 'remove', i: idx })
        this.removeSimsViewData(idx)
        this.$message({
          message: '点击右上角 <保存> 后生效！'
        })
      }).catch(() => {})
    }
  },

  beforeDestroy () {
    document.removeEventListener('click', this.cencelDeleteFunc)
  },

  watch: {
    simsViewData (v) {
      //console.log(v)
      if (this.actionType == 'remove') {
        this.actionType = 'init'
        this.newSimsViewData.splice(this.actionIndex, 1)
      } else {
        this.newSimsViewData = JSON.parse(JSON.stringify(v))
      }
      //console.log(this.newSimsViewData)
    }
  }
}
</script>

<style lang="scss">
  .terminaltemp-sortable {
    .ui-state-highlight {
      height: 200px;
      border: 1px solid #dad55e;
      background: #fffa90;
    }
  }
</style>
<style lang="scss" scoped>
  @import '../static/css/terminaltemp.scss';

  .terminaltemp-sims {
    position: relative;
    box-shadow: 0 0 5px 2px #E0E0E0;
    background-color: #F1F4F8;
    .terminaltemp-sortable {
      width: 100%;
      height: auto;
      li {
        position: relative;
        width: 100%;
        height: auto;
        cursor: pointer;
      }
      li:hover {
        border: 1px solid #3F94EF;
      }
    }
  }
  .terminaltemp-sims::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .terminaltemp-sims::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #606266;
  }
  .terminaltemp-sims::-webkit-scrollbar-track {
    border-radius: 2px;
    background: transparent;
  }
  .simsview-main-delete-icon {
    position: absolute;
    width: 85px;
    height: 40px;
    top: 50%;
    right: -85px;
    transform: translateY(-50%);
    background-image: url(../static/images/icon-delete-outline.png);
    background-size: 100%;
    background-repeat: no-repeat;
    cursor: pointer;
  }
</style>
