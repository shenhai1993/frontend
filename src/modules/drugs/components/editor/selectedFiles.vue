<template>
  <div>
    <el-button-group v-if="activeRegion.type=='image'">
      <el-tooltip class="item" content="默认模式, 图片时长有效" placement="top-start">
        <el-button :type="showMode==0?'primary' : ''" @click="setShowMode(0)">默认</el-button>
      </el-tooltip>
      <el-tooltip class="item" content="按钮模式, 响应点击事件进行内容跳转" placement="top-start">
        <el-button :type="showMode==1?'primary' : ''" @click="setShowMode(1)">按钮</el-button>
      </el-tooltip>
      <el-tooltip class="item" content="画廊模式, 终端显示为一组图片画廊, 可响应点击事件进行内容跳转" placement="top-start">
        <el-button :type="showMode==2?'primary' : ''" @click="setShowMode(2)">画廊</el-button>
      </el-tooltip>
    </el-button-group>

    <sortable-table @updateFiles="updateFiles" class="table sortable-table" :tableData="activeRegionFiles" :columns="columns" :showheader="true"
    @sortFiles="sortFiles"
    :showMode="showMode"
    :activeRegionType="activeRegionType"
    @removeFile="removeFile"></sortable-table>
  </div>
</template>

<script>
// import SortableTable from '@/components/SortableTable'
import SortableTable from './SortableTable'
import {mapState, mapMutations} from 'vuex'

export default {
  components: {
    SortableTable
  },

  data () {
    return {
      columns: [{id: 1, prop: 'name', name: '文件名', width: 110, slot: false}, {id: 2, prop: 'time', name: '时间', width: 110, slot: true, slotHTML: `
      <el-input v-model="scope.row.time"></el-input>
      `}],
      activeRegionFiles: [],
      showMode: 0, // 0 - 默认; 1 - 按钮; 2 - 画廊
      activeRegionType: ''
    }
  },

  props: {
    activeTplIndex: {
      type: Number,
      required: true
    },

    activeRegion: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapState({
      selectedFiles: state => state.drugs.selectedFiles,
      selectedTpl: state => state.drugs.selectedTpl,
      selectedChange: state => state.drugs.selectedChange,
      reginsShowMode: state => state.drugs.reginsShowMode
    }),
  },

  methods: {
    ...mapMutations([
      'SORT_DRUGS_SELECTEDFILE',
      'REMOVE_SELECTED_ELEMENT_BY_INDEX_DRUGS',
      'UPDATE_TIME_GROUP',
      'SET_REGINS_SHOW_MODE'
    ]),

    updateFiles (seconds, index) {
      if (this.activeRegionFiles.length>0){
        this.activeRegionFiles[index].seconds = seconds
      }
      this.UPDATE_TIME_GROUP({tplIndex: this.activeTplIndex, region: this.activeRegion.id, seconds, listIndex: index})
    },

    setShowMode(mode) {
      this.showMode = mode
      this.SET_REGINS_SHOW_MODE({ regionIndex: this.activeRegion.id, value: this.showMode})
    },

    sortFiles (files) {
      let _files = [].concat(files)
      this.activeRegionFiles = []
      this.$nextTick(() => {
        this.activeRegionFiles = _files
        this.SORT_DRUGS_SELECTEDFILE({index: this.activeTplIndex, files: files, region: this.activeRegion.id})
    })
    },

    removeFile (index) {
      this.REMOVE_SELECTED_ELEMENT_BY_INDEX_DRUGS({tplIndex: this.activeTplIndex, fileIndex: index, region: this.activeRegion.id})
      this.activeRegionFiles = []
      this.$emit('removeChange' )
      this.$nextTick(() => {
        this._setActiveRegionFiles()
      })
    },

    _setActiveRegionFiles () {
      if (this.activeRegion && JSON.stringify(this.activeRegion) !== '{}') {
        let files = this.selectedFiles[this.activeTplIndex][this.activeRegion.id]
        if (files) {
          this.activeRegionFiles = JSON.parse(JSON.stringify(files))
        } else {
          this.activeRegionFiles = []
        }
      } else {
        this.activeRegionFiles = []
      }
    }
  },
  //离开当前页面后执行
  // destroyed () {
  //   this.setShowMode(0)
  // },
  watch: {
    selectedChange(){
        this._setActiveRegionFiles()
    },

    activeRegion(val) {
        this._setActiveRegionFiles()
        if (val.type==='image') {
          this.showMode = this.selectedTpl[0].regions[val.id].showMode
        }
       this.activeRegionType = typeof(this.activeRegion.type) != 'undefined' ? this.activeRegion.type : ''
        // if(typeof(this.reginsShowMode[this.activeTplIndex]) != 'undefined' && typeof(this.reginsShowMode[this.activeTplIndex][this.activeRegion.id]) != 'undefined') {
        //   this.showMode = this.reginsShowMode[this.activeTplIndex][this.activeRegion.id]
        // }
     // deep: true
    }
  }

}
</script>
