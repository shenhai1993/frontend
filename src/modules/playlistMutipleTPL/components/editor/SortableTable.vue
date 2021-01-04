<template>
    <el-table class="filelist-table"
      height="560px"
      ref="datatable"
      :data="tableData"
      >
      <el-table-column class-name="pointer" type="index" width="40"></el-table-column>
      <el-table-column class-name="pointer"
        prop="name"
        label="文件名"
        width="106"
        :show-overflow-tooltip= "true"
      >
      </el-table-column>
      <el-table-column
        prop="time"
        label="时长"
        width="80"
      >
        <template slot-scope="scope">
          <el-input :disabled="scope.row.type === 'video' || scope.row.type === 'tv'" class="p10-lr" size="small" @blur="updateDuration(scope)" v-model="scope.row.seconds"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="32">
        <template slot-scope="scope">
          <el-button class="remove-btn" @click="removeFile(scope.$index)" type="danger" size="mini" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  props:{
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    showheader: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    data () {
      return this.tableData
    }
  },

  methods: {
    removeFile (index) {
      console.log(`index:==>`)
      console.log(index)
      this.$emit('removeFile', index)
    },

    updateDuration (scope) {
      this.$emit('updateFiles', scope.row.seconds, scope.$index)
      // this.tableData[scope.$index]
    }

    // timeToSecond (time) {
    //   let reg = /\d{2}/g
    //   let _time = time.match(reg)
    //   _time.reverse()
    //   let seconds = 0
    //   _time.forEach((item, index) => {
    //     seconds += item * Math.pow(60, index)
    //   });
    //   console.log(`seconds:==>`)
    //   console.log(seconds)
    // }
  },

  mounted () {
    let el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    let sortable = Sortable.create(el, {
      animation: 150,
      delay: 0,
      setData: function (dataTransfer) {
        dataTransfer.setData('Text', '')
        // to avoid Firefox bug
        // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      },
      onEnd: e => {
        const item = this.tableData[e.oldIndex]
        this.tableData.splice(e.oldIndex, 1)
        this.tableData.splice(e.newIndex, 0, item)
        this.$emit('sortFiles', this.tableData)
      }
    })
  }
}
</script>

<style lang="scss">
.filelist-table{
  .pointer{
    cursor: pointer;
  }
  .remove-btn{
    padding: 4px;
  }
  .p10-lr{
    .el-input__inner{
      padding: 0 6px;
      font-size: 12px;
    }
  }
}
</style>
