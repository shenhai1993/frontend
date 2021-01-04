<template>
  <el-table class="filelist-table"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            highlight-current-row height="calc(100% - 85px)"
            v-loading="loading"
            :data="tableData" row-key="id">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" label="ID" width="60px"></el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column label="模板ID">
       <template  slot-scope="scope">
        <div v-if="scope.row.h5template">{{scope.row.h5template.id}}</div>
        <div v-else-if="scope.row.template">{{scope.row.template.id}}</div>
      </template>
    </el-table-column>
    <el-table-column   label="模板名称" width="160">
      <template  slot-scope="scope">
        <div v-if="scope.row.h5template">{{scope.row.h5template.name}}</div>
        <div v-else-if="scope.row.template">{{scope.row.template.name}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="duration" label="时长" width="160"></el-table-column>
    <el-table-column label="屏幕方位">
      <template slot-scope="scope">
        <div v-if="scope.row.direction=== 0">横屏</div>
        <div v-else>竖屏</div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="创建时间" prop="created_at" width="160"></el-table-column>
    <el-table-column align="center" label="更新时间" prop="updated_at" width="160"></el-table-column>

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
      defaultRow:{
        type: Array
      },
      canNext: {
        type: Boolean
      },
      loading: {
        type: Boolean
      }
    },
    watch:{
    },
    computed: {
      data () {
        return this.tableData
      }
    },

    methods: {
      rowSelect() {
            let data = this.tableData.filter(item => this.defaultRow.some(ele=>ele===item.id))
            if(data.length>0){
              data.forEach((item) => {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              })
            }
      },
      handleSelectionChange (val) {
        let arrId = (val.length !== 0) ? val : []
        let result= arrId.map(v=>v.id)
        this.$emit('changeArrId', result)
        if (val.length>0){
          this.$emit('update:canNext', true)
        } else {
          this.$emit('update:canNext', false)
        }
        // this.tableData[scope.$index]
      }
    },
    mounted () {
      this.$nextTick(function(){
        this.rowSelect()
      })
    },
    watch: {
      defaultRow: {
        handler () {
          this.$nextTick(() => {
            this.rowSelect()
          })
        }
      }
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
