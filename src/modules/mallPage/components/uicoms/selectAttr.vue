<template>
  <el-dialog
    title="选择规格"
    :visible="showSelect"
    @close="closeDialog"
    custom-class="select-attr"
    :show-close="false"
    width="80%">
    <div>
      <div v-if="currData.attr.img_url" class="select-attr-header">
        <img :src="currData.attr.img_url" />
      </div>
      <div class="select-attr-body">
        <div style="font-size: 1.8rem;">{{currData.attr.name}}</div>
        <div v-if="currData.attr.spec" style="font-size: 1.2rem; color: #777777;">{{currData.attr.spec}}</div>
        <div
          v-for="(item, index) in currData.attr.attributes"
          :key="item.id"
          class="select-attr-item">
          <div>{{item.name}}</div>
          <div style="width: 100%; height: auto; overflow: hidden;">
            <div
              v-for="(attr, idx) in item.con"
              @click="selectItemAttr(index, idx)"
              class="select-attr-item-btn"
              :class="{ 'select-attr-item-active': active[index] == idx }"
              :style="{ marginLeft: idx % 3 == 0 ? '0' : '2rem', marginTop: idx < 3 ? '0' : '1rem' }">
              {{attr}}
            </div>
          </div>
        </div>
        <div style="margin-top: 4rem; margin-right: 1rem; font-size: 2rem;">
          <div v-if="currData.attr.sell_price" style="text-decoration: line-through; text-align: right; font-size: 1.2rem; color: #777777;">￥{{currData.attr.buy_price}}</div>
          <div style="text-align: right;"><span style="font-size: 1.2rem;">￥</span>{{currData.attr.sell_price ? currData.attr.sell_price : currData.attr.buy_price}}</div>
        </div>
      </div>
      <div class="shopping-footer">
        <el-row>
          <el-col :span="1">
            &nbsp;
          </el-col>
          <el-col :span="10">
            <div class="shopping-cancel-btn" @click="closeDialog">取消</div>
          </el-col>
          <el-col :span="2">
            &nbsp;
          </el-col>
          <el-col :span="10">
            <div class="shopping-confirm-btn" @click="submitSelect">确认</div>
          </el-col>
          <el-col :span="1">
            &nbsp;
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {

  },

  props: {
    show: {
      type: Boolean
    },

    data: {
      type: Object
    }
  },

  data () {
    return {
      showSelect: this.show,
      currData: {},
      active: []
    }
  },

  computed: {
    ...mapState({
      shoppingCartData: state => state.mallPage.shoppingCartData
    })
  },

  created () {
    this.initData()
  },

  mounted () {

  },

  methods: {
    initData () {
      this.currData = JSON.parse(JSON.stringify(this.data))
      const attr = this.currData.attr
      let productItem = {}
      for (let i = 0; i < attr.length; i++) {
        let newData = {}
        if (attr[i].tname == 'attributes') {
          let v = attr[i].val
          for (let j = 0; j < v.length; j++) {
            let con = v[j].con.split(',')
            v[j] = Object.assign({}, v[j], { con: con})
            this.active.splice(j, 0, 0)
          }
          newData[attr[i].tname] = v
        } else {
          newData[attr[i].tname] = attr[i].val
        }
        productItem = Object.assign({}, productItem, newData)
      }
      this.currData = Object.assign({}, this.currData, { attr: productItem })
    },

    selectItemAttr (index, idx) {
      this.active.splice(index, 1, idx)
    },

    submitSelect () {
      this.showSelect = false
      let cId = this.currData.id + (this.currData.packet_id > 0 ? 'p' : '')
      let spec = this.currData.attr.spec || ''
      let attributes = this.currData.attr.attributes
      for (let i = 0; i < this.active.length; i++) {
        cId += '-' + this.active[i]
        if (spec == '') {
          spec += attributes[i].con[this.active[i]]
        } else {
          spec += '-' + attributes[i].con[this.active[i]]
        }
      }
      let shopData = {
        id: this.currData.id,
        packet_id: this.currData.packet_id,
        cId: cId,
        num: this.shoppingCartData[cId] == undefined ? 1 : (this.shoppingCartData[cId].num + 1),
        category_id: this.currData.category_id,
        cname: this.currData.cname
      }
      this.currData.attr = Object.assign({}, this.currData.attr, { spec: spec })
      shopData = Object.assign({}, shopData, this.currData.attr)
      this.$emit('confirmSelect', shopData)
    },

    closeDialog () {
      this.showSelect = false
      this.$emit('closeSelect')
    }
  }
}
</script>

<style lang="scss">
  .select-attr {
    border-radius: 0.625rem;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
</style>
<style lang="scss" scoped>
  .select-attr-header {
    width: 100%;
    height: 15rem;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: auto;
      font-size: 0;
      margin: 0 auto;
      transform: translate(0, -20%);
    }
  }
  .select-attr-body {
    color: #3A3A3A;
    font-size: 1.4rem;
    padding: 2rem;
    .select-attr-item {
      margin-top: 2rem;
      .select-attr-item-btn {
        float: left;
        width: 29%;
        height: 2.4rem;
        line-height: 2.4rem;
        text-align: center;
        border-radius: 0.625rem;
        background-color: #F1F1F1;
        background-image: linear-gradient(#FFFDF8, #F1F1F1);
        cursor: pointer;
      }
      .select-attr-item-active {
        color: #FFFFFF;
        background-color: #FF9221;
        background-image: linear-gradient(#FFC241, #FF9221);
      }
    }
  }
  .shopping-footer {
    height: 5.9rem;
    .shopping-cancel-btn, .shopping-confirm-btn {
      width: 100%;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      margin: 1.45rem auto;
      border-radius: 0.625rem;
      font-size: 1.4rem;
      cursor: pointer;
    }
    .shopping-confirm-btn {
      color: #FFFFFF;
      background-color: #FF9221;
      background-image: linear-gradient(#FFC241, #FF9221);
    }
    .shopping-cancel-btn {
      background-color: #F1F1F1;
      background-image: linear-gradient(#FFFDF8, #F1F1F1);
    }
  }
</style>
