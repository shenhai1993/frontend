<template>
  <sortable-table @updateFiles="updateFiles" class="table sortable-table" :tableData="activeRegionFiles" :columns="columns" :showheader="true"
  @sortFiles="sortFiles"
  @removeFile="removeFile"></sortable-table>
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
      activeRegionFiles: []
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
      selectedFiles: state => state.playlistMutipleTPL.selectedFiles,
    })
  },

  methods: {
    ...mapMutations([
      'SORT_SELECTEDFILE',
      'REMOVE_SELECTED_ELEMENT_BY_INDEX',
      'UPDATE_TIME'
    ]),

    updateFiles (seconds, index) {
      this.activeRegionFiles[index].seconds = seconds
      this.UPDATE_TIME({tplIndex: this.activeTplIndex, region: this.activeRegion.id, seconds, listIndex: index})
    },

    sortFiles (files) {
      let _files = [].concat(files)
      this.activeRegionFiles = []
      this.$nextTick(() => {
        this.activeRegionFiles = _files
        this.SORT_SELECTEDFILE({index: this.activeTplIndex, files: files, region: this.activeRegion.id})
    })
    },

    removeFile (index) {
      this.REMOVE_SELECTED_ELEMENT_BY_INDEX({tplIndex: this.activeTplIndex, fileIndex: index, region: this.activeRegion.id})
      this.activeRegionFiles = []
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

  watch: {
    selectedFiles: {
      handler () {
        this._setActiveRegionFiles()
        console.log(this.activeRegionFiles)
      },
      deep: true
    },

    activeRegion: {
      handler (n) {
        this._setActiveRegionFiles()
      },
      deep: true
    }
  }

}
</script>
