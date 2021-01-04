<template>
  <div
    ref="menuCustom"
    class="simscoms menu-custom"
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
    <div
      class="product-main"
      :style="{
        width: product.width + 'px',
        height: product.height + 'px',
        top: product.top + 'px',
        left: product.left + 'px'
      }">
      <div class="pro-cus-main-item pro-cus-main-list pro-cus-main-add" @click="addProduct"></div>
      <div
        v-for="(item, index) in productData"
        :key="item.key"
        class="pro-cus-main-item pro-cus-main-list"
        :class="{'level-state': levelState == 2 && itemIndex == index}"
        @click="selectItem(index)"
        :style="{
          height: item.height + 'px'
        }">
        <div
          v-for="(proItem, i) in item.data"
          :key="item.key + '-' + proItem.key"
          class="pro-cus-main-list"
          :class="{'level-state': levelState == 2 && itemIndex == index && selectIndex == i}"
          @click="selectProduct(index, i)"
          :style="{
            width: proItem.width + 'px',
            height: proItem.height + 'px',
            top: proItem.top + 'px',
            left: proItem.left + 'px'
          }">
          <component
            :is="proItem.type"
            :itemData="proItem">
          </component>
        </div>
        <i
          v-if="levelState == 2 && itemIndex == index"
          class="icon-delete"
          @click.stop="doDelete(index)">
        </i>
      </div>
    </div>

    <div
      v-if="menuData.key > 0"
      :style="{
        width: menuData.width + 'px',
        height: menuData.height + 'px',
        top: menuData.top + 'px',
        left: menuData.left + 'px'
      }">
      <component
        :is="menuData.type"
        :itemData="menuData">
      </component>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'

export default {
  components: {
    MenuLeft: () => import ('./menuLeft.vue'),
    MenuTop: () => import ('./menuTop.vue'),
    ProductLeft: () => import ('./productLeft.vue'),
    ProductTop: () => import ('./productTop.vue')
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
      itemIndex: -1,
      selectIndex: -1,
      modelData: {},
      clickState: false,
      product: {},
      productDefault: {},
      productData: [],
      menuData: {
        key: 0,
        list: {
          0: '全部'
        }
      }
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

  methods: {
    ...mapMutations([
      'SET_INDEXPAGE_EDITDATA',
      'UPDATE_SIMS_VIEW_DATA'
    ]),

    ...mapActions([
      'setIndexPageEditData',
      'updateSimsViewData'
    ]),

    cencelEditFunc (event) {
      const e = event || window.event
      if (this.$refs.menuCustom && !this.$refs.menuCustom.contains(e.target)) {
        const path = e.path
        for (let i = 0; i < path.length; i++) {
          const className = path[i].className
          if (className && className.search('terminaltemp-index-col-3') > -1) {
            return false
          }
        }
        this.levelState = 0
        this.itemIndex = -1
        this.selectIndex = -1
      }
    },

    initData () {
      let data = JSON.parse(JSON.stringify(this.comData))
      let comData = JSON.parse(data.comData)
      comData.id = data.id
      this.modelData = comData
      const item = this.modelData.comData
      if (item.menu) {
        this.menuData = Object.assign({}, this.menuData, item.menu)
      }
      this.product = item.product
      this.productDefault = item.product.default
      if (item.product.data.length > 0) {
        this.productData = item.product.data
      } else {
        let initProduct = JSON.parse(JSON.stringify(this.productDefault))
        initProduct.key = 1
        this.productData.splice(0, 0, initProduct)
      }
      this.getMenuList(this.productData)
    },

    selectItem (index) {
      setTimeout(() => {
        this.levelState = 2
        this.itemIndex = index
      }, 200)
    },

    selectProduct (index, i) {
      this.clickState = true
      if (this.itemIndex == index && this.selectIndex == i) {
        setTimeout(() => {
          this.clickState = false
        }, 200)
        return
      }
      setTimeout(() => {
        this.clickState = false
        this.levelState = 2
        this.itemIndex = index
        this.selectIndex = i
      }, 200)
    },

    getMenuList (v) {
      const data = JSON.parse(JSON.stringify(v))
      delete this.menuData.list
      let list = {
        0: '全部'
      }
      this.menuData = Object.assign({}, this.menuData, { list: list })
      for (let i = 0; i < data.length; i++) {
        const item = data[i].data
        for (let i = 0; i < item.length; i++) {
          const id = item[i].category_id
          let menu = {}
          menu[id] = item[i].cname
          list = Object.assign({}, list, menu)
        }
      }
      this.menuData = Object.assign({}, this.menuData, { list: list })
    },

    addProduct () {
      setTimeout(() => {
        this.levelState = 2
        this.itemIndex = -1
        this.selectIndex = -1
        let initProduct = JSON.parse(JSON.stringify(this.productDefault))
        let key = this.productData.length > 0 ? this.productData[0].key + 1 : 1
        const data = Object.assign({}, initProduct, { key: key })
        this.productData.splice(0, 0, data)
      }, 200)
    },

    doDelete (i) {
      this.levelState = 1
      this.itemIndex = -1
      this.selectIndex = -1
      this.productData.splice(i, 1)
      this.getMenuList(this.productData)
    },

    showPositionInfo () {
      if (this.clickState) {
        return
      }
      setTimeout(() => {
        this.levelState = 1
        this.itemIndex = -1
        this.selectIndex = -1
      }, 100)
    },

    commitData () {
      let newData = JSON.parse(JSON.stringify(this.comData))
      let comData = JSON.parse(JSON.stringify(this.modelData))
      let oldData = JSON.parse(JSON.stringify(this.productData))
      let oldCom = []
      for (let i = 0; i < oldData.length; i++) {
        const item = oldData[i].data
        for (let i = 0; i < item.length; i++) {
          if (item[i].id > 0) {
            oldCom.push(item[i])
          }
        }
      }
      let _oldData = JSON.parse(JSON.stringify(oldData))
      let oldIndex = 0
      let _oldIndex = 0
      const oldLength = oldData.length
      for (let i = 0; i < oldLength; i++) {
        const newLength = oldData[i].data.length
        let newIndex = 0
        for (let j = 0; j < newLength; j++) {
          if (oldIndex < oldCom.length) {
            newIndex++
            _oldData[i].data[j] = Object.assign({}, _oldData[i].data[j], { attr: oldCom[oldIndex].attr, category_id: oldCom[oldIndex].category_id, cname: oldCom[oldIndex].cname, id: oldCom[oldIndex].id, packet_id: oldCom[oldIndex].packet_id })
          } else {
            oldData[i].data.splice(newIndex, 1)
          }
          oldIndex++
        }
        if (oldData[i].data.length == 0) {
          _oldData.splice(_oldIndex, 1)
        } else {
          _oldIndex++
          _oldData[i].data.length = oldData[i].data.length
        }
      }
      comData.comData.product.data = _oldData
      newData.comData = JSON.stringify(comData)
      this.updateSimsViewData({ index: this.modelIndex, data: newData })
    }

    // commitData () {
    //   let newData = JSON.parse(JSON.stringify(this.comData))
    //   let comData = JSON.parse(JSON.stringify(this.modelData))
    //   let oldData = JSON.parse(JSON.stringify(this.productData))
    //   for (let i = 0; i < oldData.length; i++) {
    //     const item = oldData[i].data
    //     let newCom = []
    //     for (let i = 0; i < item.length; i++) {
    //       if (item[i].id > 0) {
    //         newCom.push(item[i])
    //       }
    //     }
    //     oldData[i].data = newCom
    //   }
    //   comData.comData.product.data = oldData
    //   newData.comData = JSON.stringify(comData)
    //   this.updateSimsViewData({ index: this.modelIndex, data: newData })
    // }
  },

  beforeDestroy () {
    document.removeEventListener('click', this.cencelEditFunc)
  },

  watch: {
    levelState (v, ov) {
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
      let newData = JSON.parse(JSON.stringify(this.productData[this.itemIndex].data[this.selectIndex]))
      newData.id = data.id
      newData.packet_id = data.packet_id
      newData.cname = data.cname
      newData.category_id = data.category_id
      for (let i = 0; i < newData.attr.length; i++) {
        newData.attr[i].val = data[newData.attr[i].tname]
      }
      this.productData[this.itemIndex].data.splice(this.selectIndex, 1, newData)
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
  .menu-custom {
    position: relative;
    overflow: hidden;
    width: 100%;
    > div {
      position: absolute;
    }
    .product-main {
      overflow: auto;
      .pro-cus-main-add {
        width: 80px;
        height: 80px;
        background-image: url(../../static/images/icon-plus.png);
        background-size: 80px 80px;
        background-repeat: no-repeat;
      }
      .pro-cus-main-item {
        position: relative;
        > div {
          position: absolute;
        }
        .icon-delete {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 1px;
          right: 1px;
          background-image: url(../../static/images/icon-delete.png);
          background-size: 100%;
          background-repeat: no-repeat;
          cursor: pointer;
        }
      }
      .pro-cus-main-item + .pro-cus-main-item {
        margin-top: 9px;
      }
    }
    .product-main::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    .product-main::-webkit-scrollbar-thumb {
      background: transparent;
    }
    .product-main::-webkit-scrollbar-track {
      background: transparent;
    }
  }
  .level-state, .pro-cus-main-list:hover {
    border: 1px solid #3F94EF;
    cursor: pointer;
  }
</style>
