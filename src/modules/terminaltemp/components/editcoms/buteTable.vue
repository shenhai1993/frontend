<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="sname"
      label="内容选项">
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'

export default {
  components: {

  },

  props: {
    active: {
      type: Number
    },

    currData: {
      type: Object
    },

    comData: {
      type: Object
    }
  },

  data () {
    return {
      tableData: [],
      oldId: 0,
      currProduct: {},
      commitData: this.comData
    }
  },

  created () {

  },

  mounted() {

  },

  methods: {
    ...mapMutations([
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'loadingStatus'
    ]),

    handleSelectionChange (val) {
      const data = JSON.parse(JSON.stringify(val))
      this.$emit('buteEmit', data)
    },

    toggleAllSelection () {
      //this.$refs.multipleTable.toggleAllSelection()
      let rows = []
      for (let i = 0; i < this.tableData.length; i++) {
        const row = this.tableData[i]
        if (row.tname == 'img_url' || row.tname == 'name' || row.tname == 'buy_price') {
          rows.push(row)
        }
      }
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },

    getAllBute () {
      this.loadingStatus(true)
      Terminaltemp.getAllBute().then(res => {        
        if (res.data.success) {
          const data = res.data.message
          this.getTableData(data)
          this.$nextTick(() => {
            this.toggleAllSelection()
            this.loadingStatus(false)
          })
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
    },

    getTableData (res) {
      this.tableData = []
      const data = JSON.parse(JSON.stringify(res))
      const attr = JSON.parse(JSON.stringify(this.commitData.comData[0].attr))

      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        let hasItem = false
        for (let i = 0; i < attr.length; i++) {
          let oldItem = attr[i]
          if (item.tname == oldItem.tname) {
            hasItem = true
            item = oldItem
            break
          }
        }
        if (!hasItem) {
          if (item.type == 'text') {
            item.size = 12
            item.color = "#BF1616"
            item.weight = "normal"
          } else if (item.type == 'image') {
            const newItem = attr[0]
            item.width = newItem.width
            item.height = newItem.height
          }
          item.top = 0
          item.left = 0
        }
        item.val = this.currProduct[item.tname]
        this.tableData.splice(i, 0, item)
      }
    }
  },

  watch: {
    active (v) {
      this.currProduct = JSON.parse(JSON.stringify(this.currData))
      if (this.active == 1 && Object.keys(this.currProduct).length == 0) {
        this.$message({
          message: '请添加关联商品：选择商品 > 添加内容',
          type: 'warning'
        })
        return false
      }
      if (this.active == 1 && this.oldId != this.currProduct.id) {
        this.oldId = this.currProduct.id
        this.getAllBute()
      }
    }
  }
}
</script>
