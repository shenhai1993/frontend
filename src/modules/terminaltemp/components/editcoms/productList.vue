<template>
  <div class="product-list">
    <div class="product-list-header">选择关联商品</div>
    <el-tabs v-model="tabsValue" @tab-click="tabClick">
      <el-tab-pane label="单品选择" name="first">
        <el-table
          ref="singleTable"
          :data="tableShowData"
          highlight-current-row
          :show-header="false"
          height="90%"
          @current-change="handleCurrentChange">
          <el-table-column
            label="单品列表">
            <template slot-scope="scope">
              <div
                class="product-list-li"
                :style="{ 'backgroundImage': 'url(' + scope.row.img_url + ')' }">
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="list-more">
          <el-button @click="getMore" size="mini" :disabled="!showMore">{{showMoreText}}</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="套餐选择" name="second">
        <el-table
          ref="packetTable"
          :data="packetShowData"
          highlight-current-row
          :show-header="false"
          height="90%"
          @current-change="handleCurrentChange">
          <el-table-column
            label="套餐列表">
            <template slot-scope="scope">
              <div
                class="product-list-li"
                :style="{ 'backgroundImage': 'url(' + scope.row.img_url + ')' }">
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="list-more">
          <el-button @click="getMorePacket" size="mini" :disabled="!showMorePacket">{{showMorePacketText}}</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'

export default {
  components: {

  },

  props: {

  },

  data () {
    return {
      tabsValue: 'first',
      tableData: [],
      tableShowData: [],
      page: 1,
      perpage: 10,
      showMore: false,
      showMoreText: '没有更多了',
      packetData: [],
      packetShowData: [],
      pagePacket: 1,
      perpagePacket: 10,
      showMorePacket: false,
      showMorePacketText: '没有更多了'
    }
  },

  mounted() {
    this.initProductData()
    this.initPacketData()
  },

  methods: {
    ...mapMutations([
      'LOADING_STATUS',
      'PRODUCT_CURRENTCHANGE'
    ]),

    ...mapActions([
      'loadingStatus',
      'getProductCurrentData'
    ]),

    initProductData () {
      const data = sessionStorage.getItem('terminaltemp_productListData')
      if (data) {
        this.tableData = JSON.parse(data)
        this.getTableShowData()
        let round = this.tableData.length / this.perpage
        let rem = this.tableData.length % this.perpage
        if (rem > 0) {
          this.page = round + 1
        } else {
          this.page = round
          rem = this.perpage
        }
        this.showMoreBtn(rem)
      } else {
        this.getProduct(this.page)
      }
    },

    initPacketData () {
      const data = sessionStorage.getItem('terminaltemp_packetListData')
      if (data) {
        this.packetData = JSON.parse(data)
        this.getPacketShowData()
        let round = this.packetData.length / this.perpagePacket
        let rem = this.packetData.length % this.perpagePacket
        if (rem > 0) {
          this.pagePacket = round + 1
        } else {
          this.pagePacket = round
          rem = this.perpagePacket
        }
        this.showMorePacketBtn(rem)
      } else {
        this.getPacket(this.pagePacket)
      }
    },

    tabClick (val) {
      if (val.name == 'first') {
        this.$refs.packetTable.setCurrentRow()
      } else if (val.name == 'second') {
        this.$refs.singleTable.setCurrentRow()
      }
    },

    handleCurrentChange (val) {
      let data = JSON.parse(JSON.stringify(val))
      if (data == null) {
        return
      }
      if (this.tabsValue == 'first') {
        data.packet_id = 0
      } else if (this.tabsValue == 'second') {
        data.packet_id = data.id
        data.name = data.name + '（套餐）'
        data.buy_price = data.pack_price
        data.sell_price = data.pack_price
        data.spec = ''
        const pack = JSON.parse(JSON.stringify(data.pack_product))
        for (let i = 0; i < pack.length; i++) {
          data.spec += i == 0 ? pack[i].name : '+' + pack[i].name
        }
      }
      this.getProductCurrentData(data)
      this.$refs.singleTable.setCurrentRow()
      this.$refs.packetTable.setCurrentRow()
    },

    getProduct (page) {
      this.loadingStatus(true)
      Terminaltemp.getProductsList(page, this.perpage).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          const data = res.data.message.data
          this.tableData = this.tableData.concat(data)
          this.getTableShowData()
          this.showMoreBtn(data.length)
          sessionStorage.setItem('terminaltemp_productListData', JSON.stringify(this.tableData))
        } else {
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

    getTableShowData () {
      const data = JSON.parse(JSON.stringify(this.tableData))
      this.tableShowData = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].expiry_status == 1) {
          this.tableShowData.push(data[i])
        }
      }
    },

    getPacket (page) {
      this.loadingStatus(true)
      Terminaltemp.getPacketsList(page, this.perpagePacket).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          const data = res.data.message.data
          this.packetData = this.packetData.concat(data)
          this.getPacketShowData()
          this.showMorePacketBtn(data.length)
          sessionStorage.setItem('terminaltemp_packetListData', JSON.stringify(this.packetData))
        } else {
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

    getPacketShowData () {
      const data = JSON.parse(JSON.stringify(this.packetData))
      this.packetShowData = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].expiry_status == 1) {
          this.packetShowData.push(data[i])
        }
      }
    },

    showMoreBtn (length) {
      if (length >= this.perpage) {
        this.showMore = true
        this.showMoreText = '加载更多'
      } else {
        this.showMore = false
        this.showMoreText = '没有更多了'
      }
    },

    showMorePacketBtn (length) {
      if (length >= this.perpage) {
        this.showMorePacket = true
        this.showMorePacketText = '加载更多'
      } else {
        this.showMorePacket = false
        this.showMorePacketText = '没有更多了'
      }
    },

    getMore () {
      this.page++
      this.getProduct(this.page)
    },

    getMorePacket () {
      this.pagePacket++
      this.getPacket(this.pagePacket)
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-list {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    .product-list-header {
      width: 90%;
      height: 40px;
      line-height: 40px;
      color: #928E8E;
      font-size: 14px;
      margin: 0 auto;
    }
    .el-tabs {
      height: calc(100% - 40px);
      .el-table {
        width: 90%;
        border: 1px solid #EAE9EA;
        margin: 0 auto;
      }
      .product-list-li {
        height: 40px;
        line-height: 40px;
        background-size: 60px 40px;
        background-repeat: no-repeat;
        padding-left: 70px;
        cursor: pointer;
      }
      .list-more {
        padding: 10px;
        text-align: center;
      }
    }
  }
</style>
<style lang="scss">
  .product-list {
    .el-tabs__nav-scroll {
      width: 90%;
      margin: 0 auto;
    }
    .el-tabs__content {
      height: calc(100% - 55px);
      .el-tab-pane {
        height: 100%;
      }
    }
    .el-table td {
      border: 0;
    }
    .el-table__body-wrapper::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: #606266;
    }
    .el-table__body-wrapper::-webkit-scrollbar-track {
      border-radius: 2px;
      background: transparent;
    }
  }
</style>
