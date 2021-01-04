<!--
  author: wangwei(w.w@tcl.com)  2017-11-13
  desc: 模板选择控件
  使用方法：

  <templateSelect :selectItem.sync="item"></templateSelect>
-->
<template>
  <div id="templateList">
    <div class="headerbar">
       <el-input style="display:inline-block;width:200px;" placeholder="请输入名称过滤" prefix-icon="el-icon-search" v-model="searchQuery">
      </el-input>
    </div>

    <div class="container clearfix m-15">
      <div v-if="filteredItems.length == 0" style="margin:10px;">
        暂时没有模板噢
      </div>
      <div v-for="(item, index) in filteredItems" :key="item.id" class="item"
           @click="use(item, index)" :class='{ active: currentClickItemIndex === index }'>
        <div :class="{'item1': item.direction == 1, 'item0': item.direction == 0}" class="image">
          <div class="overlay"></div>
          <img :src="item.thumb_path + '?' + timestamp" />
        </div>
        <div class="item-bottom">
          <div class="title" :title="item.name">{{item.name}}</div>
          <div style="padding-bottom:16px;margin-top:-8px;">
            <el-button title="选择" size="mini" type="danger">
              <i class="el-icon-delete"></i> 使用
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
// import { selected } from '@/modules/terminal/static/js/utils.js'

export default {
  data () {
    return {
      timestamp: new Date().getTime(),
      searchQuery: '',
      items: [],
      currentClickItemIndex: ''
    }
  },
  watch: {
    currentClickItemIndex (v, ov) {
      this.CLEAR_MATERIAL_LIST()
    }
  },
  mounted () {
    let _index = -1

    let ismpdpPage = this.$route.path.indexOf('/mpdp/playlist') > -1

    let url = ismpdpPage ? '/mpdp/scenes' : '/templates'

    axios.get(url).then((resp) => {
      this.items = ismpdpPage ? resp.data.message : resp.data
      // 点击编辑时获取当前的模板
      if (this.$route.params.id) {
        this.items.some((ele, index) => {
          _index = index
          return Number(ele.id) === Number(this.$route.params.id)
        })
        this.use(this.items[_index], _index)
      }
    })
  },
  computed: {
    filteredItems: function () {
      var me = this
      return me.items.filter(function (item) {
        return item.name.indexOf(me.searchQuery) !== -1
      })
    }
  },
  props: {
    selectItem: {
      type: Object
    }
  },
  methods: {
    ...mapMutations([
      'CLEAR_MATERIAL_LIST'
    ]),
    use (item, index) {
      this.$emit('update:selectItem', item)
      this.currentClickItemIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
#templateList {
  height: 100%;
}
.container {
  height: calc(100% - 56px);
  overflow-y: auto;
  .item {
    position: relative;
    // width: 141px;
    // height: 180px;
    float: left;
    border: 1px solid #f5f5f5;
    margin: 10px 12px;
    text-align: center;
    background-color: #f1f4f5;
    border-radius: 3px;
    overflow: hidden;
    &.active {
      border-color: #66b0ff;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.2);
    }
    // .overlay {
    //   transition: opacity .3s ease,transform .3s ease;
    //   opacity: 0;
    //   background-color: rgba(0, 0, 0, .5);
    //   position: absolute;
    //   z-index: 2;
    //   left: 0;
    //   right: 0;
    //   top: 0;
    //   bottom: 0;
    // }
    .item-bottom {
      > div:nth-child(2) {
        height: 0;
        padding: 0!important;
        transition: height  .3s ease,transform .3s ease;
      }
    }
    // &:hover {
    //   .overlay {
    //     opacity: 1;
    //   }
    //   .item-bottom {
    //     > div:nth-child(2) {
    //       height: 44px;
    //       padding-bottom: 16px;
    //     }
    //   }
    // }
  }

  .image {
    width:280px;
    height:316px;
    position: relative;
  }
  .item-bottom {
    background-color: white;
    position: absolute;
    width:100%;
    bottom: 0px;
    z-index: 3;
  }
  .title {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    line-height: 36px;
  }
  .ribbon {
    position: absolute;
    width: 100px;
    height: 80px;
    text-align: center;
    z-index: 10;
  }
  .ribbon-inner.check {
      background-color: #ff7e7e;
  }
  .ribbon .ribbon-inner {
    position: absolute;
    left: -30px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #fff;
    top: 6px;
    padding: 0 20px;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
}
.item0 {
  img {
    width: 270px;
    position:relative;
    margin-top:78px;
  }
}
.item1 {
  img {
    height: 270px;
    margin-top: 23px;
  }
}
</style>
