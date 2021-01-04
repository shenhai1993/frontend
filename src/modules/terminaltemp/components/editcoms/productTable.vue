<template>
  <div class="table-height">
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      :height="height"
      @current-change="handleCurrentChange">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        label="商品列表">
        <template slot-scope="scope">
          <div
            class="product-list"
            :style="{ 'backgroundImage': 'url(' + scope.row.img_url + ')' }">
            {{scope.row.name}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="list-more">
      <el-button @click="getMore" size="mini" :disabled="!showMore">{{showMoreText}}</el-button>
    </div>
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
      height: 300,
      tableData: [],
      page: 1,
      perpage: 10,
      showMore: false,
      showMoreText: '没有更多了'
    }
  },

  mounted() {
    setTimeout(() => {
      const h = document.getElementsByClassName('table-height')[0].offsetHeight
      this.height = h - 38
    }, 0)

    this.getProduct(this.page)
  },

  methods: {
    ...mapMutations([
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'loadingStatus'
    ]),

    handleCurrentChange (val) {
      const data = JSON.parse(JSON.stringify(val))
      this.$emit('productEmit', data)
    },

    getProduct (page) {
      this.loadingStatus(true)
      Terminaltemp.getProductsList(page, this.perpage).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          const data = res.data.message.data
          this.tableData = this.tableData.concat(data)
          if (data.length >= this.perpage) {
            this.showMore = true
            this.showMoreText = '加载更多'
          } else {
            this.showMore = false
            this.showMoreText = '没有更多了'
          }
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

    getMore () {
      this.page++
      this.getProduct(this.page)
    }
  }
}
</script>

<style lang="scss">
  .table-height {
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
      background: #F2F6FC;
    }
  }
</style>
<style lang="scss" scoped>
  .table-height {
    height: calc(100% - 46px);
    overflow: hidden;
  }
  .product-list {
    height: 40px;
    line-height: 40px;
    background-size: 60px 40px;
    background-repeat: no-repeat;
    padding-left: 70px;
    cursor: pointer;
  }
  .list-more {
    margin-top: 10px;
    text-align: center;
  }
</style>
