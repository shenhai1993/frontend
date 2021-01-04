<template>
  <div
    class="menu-table"
    :style="{
      width: menuData.width + 'px',
      height: menuData.height + 'px',
      top: menuData.top + 'px',
      left: menuData.leftlength + 'px'
    }">
    <el-menu
      default-active="0"
      text-color="#343434"
      active-text-color="#FF8F1F">
      <el-menu-item
        v-for="(item, index) in menuData.comData"
        :key="item.category_id"
        :index="index + ''"
        style="padding: 0;">
        <span slot="title">{{item.cname}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { Terminaltemp } from '../../static/js/terminaltemp.js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {

  },

  props: {

  },

  data () {
    return {
      menuData: {
        "id": 0,
        "item_type": "0",
        "special_name": "menu模型",
        "special_type": "menu-tabs",
        "item_data": "",
        "thumbImage": "/static/images/model_thumb/model_thumb_005.jpg",
        "width": 183,
        "height": 897,
        "top": 514,
        "leftlength": 40,
        "comData": [
          {
            category_id: 0,
            cname: '全部'
          },
          {
            category_id: 3,
            cname: '分类1'
          },
          {
            category_id: 4,
            cname: '分类2'
          },
          {
            category_id: 5,
            cname: '分类3'
          },
          {
            category_id: 6,
            cname: '分类4'
          }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      simsResetWH: state => state.terminaltemp.simsResetWH
    })
  },

  created () {
    this.initData()
  },

  methods: {
    initData () {
      const wh = '1080x1920'.split('x')
      const oldSimsWH = [parseFloat(wh[0]), parseFloat(wh[1])]
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      this.menuData.width = Terminaltemp.getNewW(this.menuData.width, oldSimsWH, newSimsWH)
      this.menuData.height = Terminaltemp.getNewH(this.menuData.height, oldSimsWH, newSimsWH)
      this.menuData.leftlength = Terminaltemp.getNewW(this.menuData.leftlength, oldSimsWH, newSimsWH)
      this.menuData.top = Terminaltemp.getNewH(this.menuData.top, oldSimsWH, newSimsWH)
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-table {
    position: absolute;
    border-radius: 6px;
    box-shadow: 0 0 5px 2px #DFE3E9;
    background-color: #FFFFFF;
    overflow-x: hidden;
    overflow-y: auto;
    .el-menu {
      width: 55%;
      height: 100%;
      border: 0;
      margin: 0 auto;
      .el-menu-item {
        text-align: center;
        padding: 0;
      }
      .el-menu-item + .el-menu-item {
        border-top: 1px solid #DFE3E9;
      }
    }
  }
  .menu-table::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }
  .menu-table::-webkit-scrollbar-thumb {
    border-radius: 1px;
    background: #EAE9EA;
  }
  .menu-table::-webkit-scrollbar-track {
    border-radius: 1px;
    background: transparent;
  }
</style>
