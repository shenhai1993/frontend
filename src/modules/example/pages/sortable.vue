<template>
  <div>
    <el-button @click="remove">http.delete</el-button>
    <input type="checkbox" v-model="toggle" :true-value="true" :false-value="false" />
    显示表头
    <sortable-table :tableData="td" 
    @sort="sort"
    :columns="columns" :showheader="toggle"></sortable-table>
  </div>
</template>

<script>
import SortableTable from '@/components/SortableTable'

import http from '../../../../static/js/utils/http'

export default {
  components: {
    SortableTable
  },

  data() {
    return {
      toggle: true,

      columns: [
        { id: 1, prop: 'id', name: 'ID', width: 50 },
        { id: 2, prop: 'date', name: '日期', width: 180 },
        { id: 3, prop: 'name', name: '姓名', width: 180 },
        { id: 4, prop: 'address', name: '地址' }
      ],
      tableData: [{
        id: 1,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        id: 4,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }

  },

  computed: {
    td () {
      return this.tableData
    }
  },
  methods: {
    remove () {
      http.delete('abc')
    },

    sort(e) {
      const _tableData = [].concat(this.tableData)
      this.tableData = []
      this.$nextTick(() => {
        const item = _tableData[e.oldIndex]
        _tableData.splice(e.oldIndex, 1)
        _tableData.splice(e.newIndex, 0, item)
        this.tableData = _tableData
      })
    }
  },
  watch: {
    tableData: {
      handler (n) {
        console.log(`father n:==>`)
        console.log(n)
      }
    }
  }
}
</script>

