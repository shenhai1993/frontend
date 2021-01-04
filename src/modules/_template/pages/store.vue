<template>
  <div class="parentConent">
    <headerbar class='headerbar'>
      <span slot='submenuName'>模板商城</span>
    </headerbar>

    <div class="templateContainer">
      <div v-if="templates.length === 0">商城里还没有任何模板，敬请期待</div>
      <div v-for="(item, index) in templates" :key="item.id" class="item">
        <div class="ribbon ribbon-badge" v-if="item.already_buy === '1'">
          <span class="ribbon-inner check">已购买</span>
        </div>
        <div :class="{'vertical': item.direction == '1', 'horizon': item.direction == '0'}"
            class="image">
          <div class="overlay">
          </div>
          <img :src="item.thumb_path" />
        </div>
        <div class="item-bottom">
          <div class="title" :title="item.name">
            <p class='ellipsis'> {{ item.name }} </p>
            <p>
              <small v-if="item.price > 0" class="price">￥{{ item.price }}</small>
              <small v-else class="price">免费</small>
            </p>
          </div>
          <div style="padding-bottom:16px;">
            <el-tooltip effect="dark" content="预览" placement="bottom">
              <el-button title="预览" @click="previewShow=true;previewTpl=item;" size="mini" type="primary">
                <i class="el-icon-view"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="购买" placement="bottom">
              <el-button title="购买" @click="buy(item, index)"
                         size="mini" type="primary">
                <i class="el-icon-goods"></i>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <anotherconfirm :confirmvisible='confirmvisible'
                    :currentItem='currentItem'
                    v-on:issave='von_issave'></anotherconfirm>

    <preview :dialogshow.sync="previewShow" v-on:buy="buy(previewTpl)" :tpl="previewTpl"></preview>
  </div>
</template>

<script>
import http from '../../../../static/js/utils/http'
import headerbar from '@/components/HeaderBar'
import preview from '../components/Preview'
import anotherconfirm from '@/components/anotherconfirm'

export default {
  components: {
    headerbar, preview, anotherconfirm
  },

  data () {
    return {
      templates: [],
      previewShow: false,
      previewTpl: null,
      confirmvisible: false,
      currentItem: null
    }
  },

  mounted () {
    http.get(`templates?type=store`).then((res) => {
      this.templates = res.data
    })
  },

  methods: {
    buy: function (item) {
      // let priceTips = Number(item.price) === 0 ? '此模板免费！' : `您确定要购买该模板吗? 购买将消耗 ￥${item.price}点券！`
      this.confirmvisible = true
      this.currentItem = item
    },
    von_issave (data) {
      let me = this
      let item = me.currentItem

      if (!data) {
        me.confirmvisible = false
        return
      }
      http.get(`templates/${item.up_id}/buy`)
        .then(res => {
          me.$notify({
            type: 'success',
            message: '购买成功，请到我的模板中查看!'
          })
          me.$set(item, 'already_buy', '1')
          me.confirmvisible = false
        })
        .catch(err => {
          console.log(err)
          me.confirmvisible = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../static/template.scss";
  .price {
    color: #ff7e7e;
  }
</style>
