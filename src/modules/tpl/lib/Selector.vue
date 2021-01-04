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
      <el-radio-group v-model="filterType" class="radio-group" :disabled="disabledFilterType">
        <el-radio-button :label="0">横屏</el-radio-button>
        <el-radio-button :label="1">竖屏</el-radio-button>
      </el-radio-group>
    </div>

    <div class="container clearfix m-15">
      <div v-if="filteredItems.length == 0" style="margin:10px;">
        暂时没有模板噢
      </div>
      <div v-for="(item, index) in filteredItems" :key="item.id" class="item"
           @click="use(item, index)" :class='{ active: currentClickItemIndex === index }'>
        <div :class="{'item1': item.direction == 1, 'item0': item.direction == 0}" class="image">
          <div class="overlay">
          </div>
          <div class="deleteBtn" @click="deleteTpl(item,index)" @click.stop><el-button size="mini" type="primary" icon="el-icon-delete" ></el-button></div>
          <img :src="item.thumb_path" />
        </div>
        <div class="item-bottom">
          <div class="title" :title="item.name">{{item.name}}</div>
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
      searchQuery: '',
      items: [],
      currentClickItemIndex: '',
      filterType: 0
    }
  },

  mounted () {
    //let groupId = JSON.parse(this.$cookies.get('authUser')).group_id
    let objAuth = this.$cookies.get('authUser')
    let groupId = (typeof objAuth === 'string') ? JSON.parse(objAuth).group_id : objAuth.group_id
    axios.get(`/templates?group_id=${groupId}`).then((resp) => {
      this.items = resp.data.message
    })
  },
  computed: {
    filteredItems () {
      let _item = this.items.filter( (item) => {
        return item.name.indexOf(this.searchQuery) !== -1
      })
      // 如果设置了 direction, 则优先按 direction 过滤, 无视 filterType
      if (this.direction !== -1) {
        _item = _item.filter(item => {
         return item.direction === this.direction
        })
      } else if (this.filterType !== -1) {
        _item = _item.filter(item => {
         return this.filterType === item.direction
        })
      }
      return _item
    },
    disabledFilterType () {
      return this.direction !== -1
    }
  },
  props: {
    selectItem: {
      type: Object
    },
    direction: {
      type: Number
    }
  },
  methods: {
    use (item, index) {
      this.$emit('update:selectItem', item)
      this.currentClickItemIndex = index
    },
    deleteTpl(item,index) {
      if (item.use_status === 1) {
        return this.$notify.warning({
          title: '提示',
          message: '该模板处于使用状态，不能删除！'
        })
      }
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(`/templates/${item.id}`)
          .then((res) => {
            if (res.data.success){
              this.items.splice(index, 1)
              this.$notify({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
          .catch((error) => {
            this.$notify.error({
              title: '错误',
              message: error.data.message
            })
          })
      }).catch(e => {})
    }
  }
}
</script>
<style lang="scss" scoped>
#templateList {
  height: 100%;
  .radio-group{
    display: inline-block;
    position: relative;
  }
}
.container {
  height: calc(100% - 56px);
  overflow-y: auto;
  .item {
    position: relative;
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
        padding: 0;
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
    width:200px;
    height:226px;
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
    width: 200px;
    position:relative;
    margin-top:38px;
  }
}
.item1 {
  img {
    height: 180px;
    margin-top: 2px;
  }
}
.image:hover{
  .deleteBtn{
    opacity: 1;
  }
}
.deleteBtn{
  position: absolute;
  right: 0px;
  top: 0px;
  opacity: 0;
  transition: opacity 0.5s;
}
</style>
