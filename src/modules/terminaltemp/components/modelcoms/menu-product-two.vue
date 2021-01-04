<template>
  <div
    ref="menuProductTwo"
    class="simscoms menu-product-two"
    :class="{'level-state': levelState > 0}"
    @click="showPositionInfo"
    :data-index="modelIndex"
    :data-id="modelData.id"
    :style="{
      height: modelData.height + 'px',
      marginTop: modelData.top + 'px',
      marginBottom: modelData.top + 'px',
      zIndex: modelIndex + 10
    }">
    <div class="two-aside">
      <ul>
        <li
          v-for="(value, name, index) in menuList"
          :class="{'two-aside-active': index == 0}">
          {{value}}
        </li>
      </ul>
    </div>
    <div class="two-main">
      <div
        class="two-main-list two-main-list-add"
        @click="addProduct"
        :style="{
          height: productHeight + 'px'
        }">
      </div>
      <div
        v-for="(product, index) in productData"
        :key="product.key"
        class="two-main-list"
        :class="{'level-state': levelState == 2 && selectIndex == index}"
        @click="selectProduct(index)"
        :style="{
          height: productHeight + 'px',
          marginLeft: (index + 1) % 3 == 0 ? '0' : '2.45%'
        }">
        <i
          v-if="levelState == 2 && selectIndex == index"
          class="icon-delete"
          @click.stop="doDelete(index)">
        </i>
        <template
          v-for="(item, i) in product.attr">
          <img v-if="item.type == 'image'" :src="item.val" alt="图片" />
          <div
            v-else-if="item.type == 'text'"
            :style="{ fontSize: item.size + 'px', color: item.color }"
            :data-tname="item.tname">
            <span v-if="item.tname == 'sell_price'" class="one-main-list-price">￥</span>
            <span v-if="item.tname == 'buy_price'">&nbsp;&nbsp;&nbsp;&nbsp;<span style="text-decoration: line-through;">{{item.val}}</span></span>
            <span v-else>{{item.val}}</span>
          </div>
        </template>
      </div>
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
    modelIndex: {
      type: Number
    },

    comData: {
      type: Object
    }
  },

  data () {
    return {
      levelState: 0,
      selectIndex: -1,
      modelData: {},
      menuList: {
        0: '全部'
      },
      defaultData: {
        id: 0,
        key: 0,
        category_id: 0,
        cname: '分类',
        attr: [
          {
            sname: '缩略图',
            tname: 'img_url',
            type: 'image',
            val: '/static/images/model_thumb/model_list_thumb_001.png'
          },
          {
            sname: '名称',
            tname: 'name',
            type: 'text',
            val: '名称',
            size: 12,
            color: '#343434'
          },
          {
            sname: '折扣价',
            tname: 'sell_price',
            type: 'text',
            val: '折扣价',
            size: 10,
            color: '#BF1616'
          },
          {
            sname: '单价',
            tname: 'buy_price',
            type: 'text',
            val: '单价',
            size: 10,
            color: '#343434'
          },
          {
            sname: '属性',
            tname: 'attributes',
            type: 'none',
            val: ''
          }
        ]
      },
      productData: [],
      productHeight: 0,
      clickState: false
    }
  },

  computed: {
    ...mapState({
      productCurrentData: state => state.terminaltemp.productCurrentData,
      commitStatus: state => state.terminaltemp.commitStatus
    })
  },

  created () {
    this.initData()
  },

  mounted () {
    this.productHeight = document.getElementsByClassName('two-main-list')[0].offsetWidth * 1.52
  },

  methods: {
    ...mapMutations([
      'REMOVE_SIMS_VIEW_DATA',
      'SET_INDEXPAGE_EDITDATA',
      'UPDATE_SIMS_VIEW_DATA'
    ]),

    ...mapActions([
      'removeSimsViewData',
      'setIndexPageEditData',
      'updateSimsViewData'
    ]),

    cencelEditFunc (event) {
      const e = event || window.event
      if (this.$refs.menuProductTwo && !this.$refs.menuProductTwo.contains(e.target)) {
        const path = e.path
        for (let i = 0; i < path.length; i++) {
          const className = path[i].className
          if (className && className.search('terminaltemp-index-col-3') > -1) {
            return false
          }
        }
        this.levelState = 0
        this.selectIndex = -1
      }
    },

    initData () {
      let data = JSON.parse(JSON.stringify(this.comData))
      let comData = JSON.parse(data.comData)
      comData.id = data.id
      this.modelData = comData
      if (this.modelData.comData.length > 0) {
        this.productData = this.modelData.comData
        this.getMenuList(this.productData)
        return
      }
      for (let i = 1; i < 6; i++) {
        const data = Object.assign({}, this.defaultData, { key: i})
        this.productData.splice(0, 0, data)
      }
    },

    addProduct () {
      setTimeout(() => {
        this.levelState = 2
        this.selectIndex = -1
        let key = this.productData.length > 0 ? this.productData[0].key + 1 : 1
        const data = Object.assign({}, this.defaultData, { key: key })
        this.productData.splice(0, 0, data)
      }, 200)
    },

    selectProduct (i) {
      this.clickState = true
      if (this.selectIndex == i) {
        setTimeout(() => {
          this.clickState = false
        }, 200)
        return
      }
      setTimeout(() => {
        this.clickState = false
        this.levelState = 2
        this.selectIndex = i
      }, 200)
    },

    doDelete (i) {
      this.selectIndex = -1
      this.productData.splice(i, 1)
      this.getMenuList(this.productData)
    },

    getMenuList (v) {
      const data = JSON.parse(JSON.stringify(v))
      this.menuList = {
        0: '全部'
      }
      for (let i = 0; i < data.length; i++) {
        const id = data[i].category_id
        let menu = {}
        menu[id] = data[i].cname
        this.menuList = Object.assign({}, this.menuList, menu)
      }
    },

    showPositionInfo (e) {
      if (this.clickState) {
        return
      }
      setTimeout(() => {
        this.levelState = 1
        this.selectIndex = -1
      }, 100)
    },

    commitData () {
      let newData = JSON.parse(JSON.stringify(this.comData))
      let comData = JSON.parse(JSON.stringify(this.modelData))
      let newCom = []
      const product = JSON.parse(JSON.stringify(this.productData))
      for (let i = 0; i < product.length; i++) {
        if (product[i].id > 0) {
          newCom.push(product[i])
        }
      }
      comData.comData = newCom
      newData.comData = JSON.stringify(comData)
      this.updateSimsViewData({ index: this.modelIndex, data: newData })
    }
  },

  beforeDestroy () {
    document.removeEventListener('click', this.cencelEditFunc)
  },

  watch: {
    levelState (v) {
      document.removeEventListener('click', this.cencelEditFunc)
      if (v == 0) {
        this.setIndexPageEditData({ name: '' })
      } else if (v == 1) {
        this.setIndexPageEditData({ name: '' })
        document.addEventListener('click', this.cencelEditFunc)
      } else if (v == 2) {
        if (this.selectIndex > -1) {
          this.setIndexPageEditData({ name: 'product-list' })
          sessionStorage.setItem('indexpage_edit_model_index', this.modelIndex)
        } else {
          this.setIndexPageEditData({ name: '' })
        }
        document.addEventListener('click', this.cencelEditFunc)
      }
    },

    selectIndex (v) {
      if (v > -1 && this.levelState == 2) {
        this.setIndexPageEditData({ name: 'product-list' })
        sessionStorage.setItem('indexpage_edit_model_index', this.modelIndex)
      } else {
        this.setIndexPageEditData({ name: '' })
      }
    },

    productCurrentData (v) {
      const index = sessionStorage.getItem('indexpage_edit_model_index') ? parseInt(sessionStorage.getItem('indexpage_edit_model_index')) : -1
      if (index != this.modelIndex) {
        return
      }
      const data = JSON.parse(JSON.stringify(v))
      let newData = JSON.parse(JSON.stringify(this.productData[this.selectIndex]))
      newData.id = data.id
      newData.packet_id = data.packet_id
      newData.cname = data.cname
      newData.category_id = data.category_id
      for (let i = 0; i < newData.attr.length; i++) {
        newData.attr[i].val = data[newData.attr[i].tname]
      }
      this.productData.splice(this.selectIndex, 1, newData)
      this.getMenuList(this.productData)
    },

    commitStatus (v) {
      const status = v
      if (status) {
        this.commitData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-product-two {
    position: relative;
    width: 96.32%;
    margin-left: 1.84%;
    color: #343434;
    .two-aside {
      float: left;
      width: 19.32%;
      height: 90.7%;
      left: 0px;
      top: 0px;
      padding: 5px 0;
      border-radius: 6px;
      box-shadow: 0 1px 5px 2px #DFE3E9;
      background-color: #FFFFFF;
      overflow: hidden;
      ul {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        li {
          width: 80%;
          font-size: 14px;
          padding: 15.3% 0;
          margin: 0 auto;
          text-align: center;
        }
        li + li {
          border-top: 1px solid #DFE3E9;
        }
        .two-aside-active {
          color: #FF8F1F;
        }
      }
      ul::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
      ul::-webkit-scrollbar-thumb {
        background: transparent;
      }
      ul::-webkit-scrollbar-track {
        background: transparent;
      }
    }
    .two-main {
      float: right;
      width: 78.6%;
      height: 100%;
      overflow: auto;
      .two-main-list {
        position: relative;
        float: left;
        width: 31.7%;
        margin-bottom: 2.45%;
        border-radius: 6px;
        background-color: #FFFFFF;
        overflow: hidden;
        cursor: pointer;
        img {
          display: block;
          width: 100%;
          height: 57%;
          border-radius: 6px;
        }
        div {
          width: 85%;
          margin: 0 auto;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: -o-ellipsis-lastline;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        div[data-tname = name] {
          height: 20.4%;
          margin-top: 5px;
        }
        .two-main-list-price {
          font-size: 10px;
        }
      }
      .two-main-list-add {
        background-color: transparent;
        background-image: url(../../static/images/icon-plus.png);
        background-size: 100% 75%;
        background-position-y: 30%;
        background-repeat: no-repeat;
      }
    }
    .two-main::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    .two-main::-webkit-scrollbar-thumb {
      background: transparent;
    }
    .two-main::-webkit-scrollbar-track {
      background: transparent;
    }
  }
  .level-state, .two-main-list:hover {
    border: 1px solid #3F94EF;
  }
  .icon-delete {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 5px;
    right: 5px;
    background-image: url(../../static/images/icon-delete.png);
    background-size: 100%;
    background-repeat: no-repeat;
    cursor: pointer;
  }
</style>
