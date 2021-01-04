<template>
  <div class="clearfix playlist-editor-stepone">
    <el-row :gutter="10" type="flex">
      <el-col class="w150 no-shrink">
        <el-card>
          <div class="clearfix" slot="header">
            <el-tooltip content="选择模板" effect="dark" placement="top">
              <el-button size="mini" @click="selectTpl">
                <i class="fa fa-plus"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除选中模板" placement="top">
              <el-button size="mini" @click="removeTpl">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </div>
          <div @click="setActiveTpl(item,index)" :class="['tpl-item',{active: index === activeTplIndex}]" v-for="(item, index) in selectedTpl" :key="index">
            <div class="img-wrapper">
              <img :src="item.thumb_path" :class="[item.direction === 0?'imgH':'imgV']" alt="">
            </div>
            <span>{{item.name}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col  class="tpl-wrapper">
        <el-card v-if="activeTplIndex===-1" class="no-active-tpl">
          <span class="no-active-tpl-span">请选择模板</span>
        </el-card>
        <!-- <template-content v-else :selectItem="activeTpl"
                      :canEdit="true"
                      v-on:addClicked="onAddClicked"
                      :class="[{ transversePreview: activeTpl?activeTpl.direction === 0: true,}, 'tpl-content']"
                      v-on:elementIndex='vonElementIndex'>
        </template-content> -->
         <!-- TODO: bgm -->
         <!-- <border-box v-show="activeTplIndex!==-1" class="btn">
           <div slot="borderboxContent">
            <el-button @click="addElement('bgm')">背景音乐</el-button>
            <el-button @click="addElement('bgp')">背景图片</el-button>
           </div>
         </border-box> -->
         <div v-else class="tplcanvas">
          <new-tpl-content
            file="true"
            ref="tpl"
            :editable="false"
            :tpldata="tpldata"
            canvas=".tplcanvas"
            @regionClick="onRegionClick"
            @regionPlus="onRegionPlus"
            >
          </new-tpl-content>
        </div>
      </el-col>
      <el-col class="w330 selected-files no-shrink">
        <el-card>
          <div>
          <selected-files
            :activeTplIndex="activeTplIndex"
            :activeRegion="activeRegion"></selected-files>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog @close="cancelSource" :visible="sourceDialogShow">
      <el-radio-group v-model="source">
        <el-radio label="HDMI1"></el-radio>
        <el-radio label="HDMI2"></el-radio>
        <el-radio label="VGA"></el-radio>
        <el-radio label="CVBS"></el-radio>
      </el-radio-group>
      <div class="footer" slot="footer">
        <dialog-button @clickCancel="cancelSource" @clickConfirm="confirmSource"></dialog-button>
      </div>
    </el-dialog>

    <element-selector
      :elementsdialogshow.sync='elementsDialogShow'
      @fileSelected="onFileSelected"
      :selectedReginType = 'activeRegion.type'>
    </element-selector>

    <template-selector @selectNewTpl="selectNewTpl" :direction="direction"></template-selector>

  </div>

</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import TemplateContent from '@/modules/template/components/Content.vue'
import ElementSelector from '@/modules/element/lib/addelementsdialog.vue'
import SelectedFiles from './selectedFiles'
import TemplateSelector from './TemplateSelector'
import NewTplContent from '@/modules/tpl/components/Editor'
import BorderBox from '@/components/BorderBox'
import DialogButton from '@/components/DialogButton'

export default {
  components: {
    TemplateContent, ElementSelector, SelectedFiles
  , TemplateSelector, NewTplContent, BorderBox, DialogButton},

  props: ['canNext', 'activeSteps'],

  data () {
    return {
      selectId: '',
      elementsDialogShow: false,
      sourceDialogShow: false,
      source: '',
      selectedReginType: '',
      activeTpl: {},
      activeTplIndex: -1,
      activeRegion: {},
      direction: -1
    }
  },
  computed: {
    ...mapState({
      selectedTpl: state => state.playlistMutipleTPL.selectedTpl,
      selectedFiles: state => state.playlistMutipleTPL.selectedFiles
    }),

    tpldata () {
      if (JSON.stringify(this.activeTpl) !== '{}') {
        return this.activeTpl
      }
    }
  },
  methods: {
    ...mapMutations([
      'ADD_SELECTED_ELEMENT_WITHTIME',
      'SHOW_TEMPLATE_SELECTOR',
      'REMOVE_SELECTED_TPL',
      'CLEAR_PLAYLIST_MUTIPLETPL'
    ]),
    // 验证是否可以点击下一步
    canNextFn () {
      let ret = true
      if (this.selectedTpl.length !== 0 && this.selectedFiles.length !== 0) {
        this.selectedTpl.forEach((tpl, index) => {
          let files = this.selectedFiles[index]
          let regionsNeedFile = _regionNeedFileCount(tpl.regions)
          if (_getLengthWithoutUndefined(files) !== regionsNeedFile.length) {
            ret = false
          }
          regionsNeedFile.forEach(region => {
            let index = region.id
            if (!files[index] || files[index].length === 0) {
              ret = false
            }
          })
        })
        return ret
      }

      function _getLengthWithoutUndefined (arr) {
        let length = 0
        arr.forEach(item => {
          length++
        })
        return length
      }

      function _regionNeedFileCount (regions) {
        let ret = regions.filter(r => {
          return r.type !== 'date' && r.type !== 'time'
        })
        return ret
      }
    },

    onAddClicked (region) {
      if (region.type === 'tv') {
        this.sourceDialogShow = true
      } else {
        this.elementsDialogShow = true
      }
    },
    // 文件选中，通过vuex更新
    onFileSelected (files, type) {
      let obj = {}
      if (type === 'tv') {
        obj = [files]
      } else {
        obj.data = files
      }
      this.ADD_SELECTED_ELEMENT_WITHTIME({index: this.activeTplIndex, regionIndex: this.activeRegion.id, selectedElement: obj, type: type})
    },

    onRegionClick(region) {
      this.activeRegion = region
    },

    onRegionPlus(region) {
      this.activeRegion = region
      this.onAddClicked(region)
    },

    // addElement (type) {

    // },

    cancelSource () {
      this.source = ''
      this.sourceDialogShow = false
    },

    confirmSource () {
      if (this.source === '') {
        this.cancelSource()
        return false
      }
      let data = {}
      data.name = this.source
      data.type = 'tv'
      this.onFileSelected (data, 'tv')
      this.cancelSource()
    },

    selectTpl () {
      this.SHOW_TEMPLATE_SELECTOR(true)
    },

    selectNewTpl (tpl) {
      this.direction = tpl.direction
      this.activeTpl = tpl
      this.activeTplIndex = this.selectedTpl.length - 1
      this.activeRegion = {}
    },

    removeTpl () {
      if (this.activeTplIndex === -1) {
        return
      }
      this.REMOVE_SELECTED_TPL(this.activeTplIndex)
      // this.direction = -1
      // 删除前只有一个模板时可设置为 - 1, 但是删除前模板数大于1时,取剩余模板的方向设置作为传入组件的属性设置
      if(this.selectedTpl.length > 0) {
        for (ele of selectedTpl) {
            this.direction = ele.direction
            break
        }
      }
      else {
        this.direction = -1
      }
      this.activeTplIndex = -1
      this.activeRegion = {}
    },

    setActiveTpl (tpl, index) {
      this.activeTpl = tpl
      this.activeTplIndex = index
      this.activeRegion = {}
    },

  },

  watch: {
    selectedFiles: {
      handler (n, o) {
        if (this.activeSteps === 0) {
          this.$emit('update:canNext', this.canNextFn())
        }
      },
      deep: true
    },
    activeSteps (n, o) {
      if (n === 0) {
        if (this.$route.params.id) {
          this.$emit('update:canNext', this.canNextFn())
        }
      }
    },

    activeTpl: {
      handler () {
        this.$nextTick(() => {
          // this.$refs.tpl.template 有可能还是undefined, 先渲染 new-tpl-content 再 渲染 tpl-item, 则OK; 反之, 则 template 还在初始化中, 无法加载事件 , 已改成稳妥的方式即子组件传递事件
          /* this.$refs.tpl.template.on('region_click', (region) => {
            this.activeRegion = region
          })
          this.$refs.tpl.template.on('region_plus', (region) => {
            this.activeRegion = region
            this.onAddClicked(region)
          }) */

      })
      },
      deep: true
    }
  },

  created () {
    this.CLEAR_PLAYLIST_MUTIPLETPL()
  }
}
</script>
<style lang="scss">
.playlist-editor-stepone{
  padding: 10px;
  .el-row{
    align-items: stretch;
    .el-card{
      height: 100%;
      .el-card__body{
        padding: 16px;
      }
      .tpl-item{
        width: 100%;
        border-bottom: 1px solid #ebeef5;
        margin-bottom: 14px;
        cursor: pointer;
        .img-wrapper{
          display: table-cell;
          width: 102px;
          height: 102px;
          vertical-align: middle;
          text-align: center;
          background-color: #f1f4f5;
          .imgH{
            width: 100%;
          }
          .imgV{
            height: 100%;
          }
        }
      }
      .active{
        border: 2px solid;
        border-radius: 4px;
        color: rgba(64, 160, 255, 0.877);
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }
  }
  .no-shrink{
    flex-shrink: 0
  }
  .w330{
    width: 330px;
  }
  .w150{
    width: 150px;
  }
  .tpl-wrapper{
    overflow: auto;
  }
  .no-active-tpl{
    height: 560px;
    text-align: center;
    padding-top: 30px;
    .no-active-tpl-span{
      font-size: 20px;
    }
  }
  .sf{
    height: 100%;
  }
  .tpl-content{
    .el-card__body{
      height: 526px;
      overflow-y: auto;
    }
  }
}
</style>
