<template>
  <div>
    <el-dialog title="商品上架" :visible="isWayVisible" width='800px'
               :t_id = "t_id"
               @close="click_cancel">
      <h2 slot="title">
        商品上架
      </h2>
      <small slot="title">
        支持货道一致的多台设备批量上架商品。<br />
        可设置该商品在本设备销售的特殊价格, 其优先级高于商品的默认销售价, 如设置则此价格直接向购物者展示, 请慎重填写; 可不设置, 则使用默认销售价。
      </small>
      <el-form :model="formData" :rules="rules" ref="formData">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="way_number"
            label="货道编号">
          </el-table-column>
          <el-table-column
            prop="drug_id"
            label="商品">
            <template slot-scope="scope">
              <el-select v-model="scope.row.drug_id" placeholder="请选择" style="width: 200px;" :disabled="scope.row.disabled" @change="selectTrigger(scope.row)">
                <el-option
                  v-for="item in drugs"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="depth"
            label="货道深度">
            <template slot-scope="scope">
              <el-input v-model="scope.row.depth" style="width:50px;"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="custom_sell_price"
            label="当前售价 - 特殊售价">
            <template slot-scope="scope">
              {{ scope.row.sell_price }}
              <el-input v-model="scope.row.custom_sell_price" style="width:100px;"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="click_cancel">取 消</el-button>
        <el-button type="primary" @click="saveTermialSetWays">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../static/js/api'
  export default {
    props:{
      isWayVisible:{
        type: Boolean,
        default: false,
      },
      t_id:{
        type: Number,
        default: 0,
      }
    },
    data () {
      return {
        dialogVisible: false,
        drugs: [],
        mapDrugs: [],
        tableData: [],
        mapTableData: {}, // 快速查找对应货道用
        multipleSelection: [],
        formData: {},
        set_ways:{
          rows: '',
          data:[]
        },
        rules: {
        },
        formLadder: {
          name:[{required: true, message: '模板名称不能为空'}]
        }
      }
    },

    computed: {
    },
    mounted(){
      this.getDrugs()
    },
    methods: {

      // 获取商品列表
      getDrugs(){
        api.getDrugs()
          .then(res => {
            this.drugs = res.data.message
            this.mapDrugs = []
            this.drugs.map(item => {
              this.mapDrugs[item.id] = item
            })
          }).catch(e => {
          console.log(e)
        })
      },

      // 批量设置时,选中的第一个可设置,剩下的不可设置,且自动批量设置
      handleSelectionChange(selects) {
        let selectKeys = []
        selects.map( item => {
          selectKeys.push(item.way_number)
        })
        this.multipleSelection = selects
        let setFirst = false
        for(let i = 0; i < this.tableData.length; i++) {
          let way_number = this.tableData[i].way_number
          if(selectKeys.indexOf(way_number) >= 0) {
            if(!setFirst) {
              this.tableData[i].disabled = false
              setFirst = true
            }
            else {
              this.tableData[i].disabled = true
            }
          }
          else {
            this.tableData[i].disabled = false
          }
        }
      },

      // 选择值时,批量设置的下拉框等自动批量设置
      selectTrigger(scope){
        let drug_id = scope.drug_id
        let way_number = scope.way_number
        let selectKeys = []
        this.multipleSelection.map( item => {
          selectKeys.push(item.way_number)
        })

        // 非批量选中项选中
        if(selectKeys.indexOf(way_number) == -1) {
          scope.sell_price = this.mapDrugs[drug_id].sell_price + ' - '
          return
        }

        for(let i = 0; i < this.tableData.length; i++) {
          if(selectKeys.indexOf(this.tableData[i].way_number) >= 0) {
            this.tableData[i].drug_id = drug_id
            this.tableData[i].sell_price = this.mapDrugs[drug_id].sell_price + ' - '
          }
        }
      },

      /***
       * * *关闭弹窗
       **/
      click_cancel () {
        this.$emit('update:isWayVisible', false)
      },

      // 初始化
      initData() {
        this.tableData = []
        this.mapTableData = {}
        // this.multipleSelection = []
      },

      // 将 way_tpl 转化为 set_ways 的数据格式
      parseWayTpl (tpl) {
        // 初始化
        this.initData()
        tpl = JSON.parse(tpl)
        let set_ways = {rows: '',data:[]}
        set_ways.rows = tpl.rows
        for(let i = 0; i < tpl.data.length; i++) {
          set_ways.data[i] = {}
          set_ways.data[i].columns = tpl.data[i].columns
          let items = []
          for(let j=0; j < tpl.data[i].depths.length; j++) {
            let item = {}
            item.way_number = '#' + this.prefixInteger(i+1, 2) + this.prefixInteger(j+1, 2)
            item.drug_id = ''
            item.depth = tpl.data[i].depths[j]
            item.custom_sell_price = ''
            items.push(item)
          }
          set_ways.data[i].items = items
        }
        this.set_ways = set_ways
        this.setWays2TableData(set_ways)
      },

      // 编辑商品上架
      setWays (set_ways) {
        this.initData()
        set_ways = JSON.parse(set_ways)
        this.set_ways = set_ways
        this.setWays2TableData(set_ways)
      },

      // 将 set_ways 转化成表格数据渲染
      setWays2TableData(set_ways) {
        for(let i = 0; i < set_ways.data.length; i++) {
          for(let j=0; j < set_ways.data[i].items.length; j++) {
            let temp = JSON.parse(JSON.stringify(set_ways.data[i].items[j])) // clone
            temp['disabled'] = false
            temp['sell_price'] = ' - ' // 下拉选中商品的售价
            this.tableData.push(temp)

          }
        }
        for(let i = 0; i < this.tableData.length; i++) {
          if(this.tableData[i].drug_id) {
            this.tableData[i].sell_price = this.mapDrugs[this.tableData[i].drug_id].sell_price + ' - '
          }
        }
      },

      // 将表格数据转化为set_ways数据格式存储
      tableData2SetWays() {
        let set_ways = this.set_ways
        let mapTableData = {}
        this.tableData.map(item => {
          mapTableData[item.way_number] = item
        })
        for(let i = 0; i < set_ways.data.length; i++) {
          for(let j=0; j < set_ways.data[i].items.length; j++) {
            let way_number = set_ways.data[i].items[j].way_number
            set_ways.data[i].items[j].drug_id = mapTableData[way_number].drug_id
            set_ways.data[i].items[j].depth = mapTableData[way_number].depth
            set_ways.data[i].items[j].custom_sell_price = mapTableData[way_number].custom_sell_price
          }
        }
        return set_ways
      },

      // 数字格式化填充0
      prefixInteger(num, length) {
        return ( "0000000000000000" + num ).substr( -length );
      },

      /***
       * 更新终端货道商品设置
       **/
      saveTermialSetWays () {
        let data = {
          id: this.t_id,
          set_ways: this.tableData2SetWays()
        }
        api.saveSetWays(data)
          .then(res => {
            this.$notify.success({
              title: '操作成功！'
            })
            this.$emit('update:isWayVisible', false)
            this.$emit('refresh')
          }).catch(e => {
          console.log(e)
        })
      }

    }
  }
</script>

<style lang="scss">

</style>
