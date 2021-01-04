<template>
<div>
  <el-table 
    ref="datatable"
    :data="tableData"
    :show-header="showheader"
    style="width: 100%">
    <el-table-column v-for="col in columns" :key="col.id"
      :prop="col.prop"
      :label="col.name"
      :width="col.width"
    >
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-button @click="show(scope)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
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
        this.$emit('sort', e)
        // this.tableData.splice(e.oldIndex, 1)
        // this.tableData.splice(e.newIndex, 0, item)
        // improve me!
        // this.$refs.datatable.$destroy()
        // this.$refs.datatable.$mount()
      }
    })
  },
  methods: {
    show (s) {
      console.log(`index:==>`)
      console.log(s.$index)
    }
  }
}
</script>
