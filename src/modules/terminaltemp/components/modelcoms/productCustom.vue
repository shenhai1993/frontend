<template>
  <div
    ref="productCustom"
    class="simscoms product-custom"
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
      v-for="(product, index) in productData"
      :key="product.key"
      class="pro-cus-main-list"
      :class="{'level-state': levelState == 2 && selectIndex == index}"
      @click="selectProduct(index)"
      :style="{
        width: product.width + 'px',
        height: product.height + 'px',
        top: product.top + 'px',
        left: product.left + 'px'
      }">
      <component
        :is="product.type"
        :itemData="product">
      </component>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'

export default {
  components: {
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
      selectIndex: -1,
      modelData: {},
      productData: [],
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
      if (this.$refs.productCustom && !this.$refs.productCustom.contains(e.target)) {
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
      this.productData = this.modelData.comData
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
      let newData = JSON.parse(JSON.stringify(this.productData[this.selectIndex]))
      newData.id = data.id
      newData.packet_id = data.packet_id
      newData.cname = data.cname
      newData.category_id = data.category_id
      for (let i = 0; i < newData.attr.length; i++) {
        newData.attr[i].val = data[newData.attr[i].tname]
      }
      this.productData.splice(this.selectIndex, 1, newData)
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
  .product-custom {
    position: relative;
    overflow: hidden;
    width: 100%;
    > div {
      position: absolute;
      cursor: pointer;
    }
  }
  .level-state, .pro-cus-main-list:hover {
    border: 1px solid #3F94EF;
  }
</style>
