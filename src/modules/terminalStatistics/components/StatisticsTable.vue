<template>
    <div>
      <el-table  :data="tableData" :height="tableHeight" highlight-current-row style="width: 100%" class="terminalsTab">
        <el-table-column  width="48">
          <template slot-scope="scope">
            <!-- label可以使用tableData中的某个字段，注意该字段的值不要重复 -->
            <el-radio v-model="radioVal" :label="scope.row.id" @change.native="getCurrentRow(scope.row)">&thinsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="number" align="left" :show-overflow-tooltip="true" label="终端编号" ></el-table-column>
        <el-table-column prop="type" align="left" :show-overflow-tooltip="true"  label="型号" >
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    import {  mapMutations } from 'vuex'
    export default {
      props: {
        tableData: {
          type: Array,
          default: []
        }
      },
      data() {
        return{
          radioVal: '',
          tableHeight: window.innerHeight - 180,
          templateSelection: []
        }
      },
      watch: {
        tableData (){
          if (this.tableData.length>0){
            this.radioVal = this.tableData[0].id
            this.getCurrentRow(this.tableData[0])
          }
        }
      },
      created() {
        if (this.tableData.length>0){
          this.radioVal = this.tableData[0].id
          this.getCurrentRow(this.tableData[0])
        }
      },
      methods:{
        ...mapMutations(['SET_TERMINALS_ID']),
        getCurrentRow(row){
          // this.templateSelection = row
          this.SET_TERMINALS_ID(row.name)
        },
      }
    }
</script>

<style lang="scss">
  .terminalsTab.el-table{
    td, th.is-leaf{
      border-bottom: 0px;
    }
    padding: 0 15px;
  }
</style>
