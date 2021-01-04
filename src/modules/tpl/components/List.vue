<template>
<div class="content">
  <div class="p-10">
    <refreshbutton v-on:refresh="refresh"></refreshbutton>

    <el-select v-model="direction" placeholder="请选择屏幕方向">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <el-input v-model="search" placeholder="请输入模板名筛选" clearable class="searchInput right"></el-input>
  </div>

  <div class="tpl-content">
    <div v-if="list.length === 0">
      暂时没有模板，请先制作模板
    </div>
    <div v-if="list.length !==0 && filtedList.length === 0">
      没有找到您筛选的模板
    </div>
    <div v-for="(item, index) in filtedList" :key="index" class="tpl-wrapper">
      <div class="ribbon ribbon-badge" v-if="item.use_status === 1">
        <span class="ribbon-inner check">使用中</span>
      </div>

      <div class="overlay"></div>
      <img :src="`${item.thumb_path}?${(new Date()).valueOf()}`" :class="[item.direction === 0 ? 'image-h' : 'image-v']" :alt="item.name"/>
      <div class="item-bottom">
        <div class="item-title">{{ item.name }}</div>
        <div class="item-btn">
          <router-link title="编辑" v-if="item.status !== 1" :to="`editor/${item.id}`">
            <el-button size="mini" type="primary" @click="editor(item)">
              <i class="el-icon-edit"></i>
            </el-button>
          </router-link>
          <el-button title="删除" :disabled="item.use_status === 1" @click="remove(item, index)" size="mini" type="primary">
            <i class="fa fa-trash-o"></i>
          </el-button>
          <el-button title="关联播出单" v-if="item.use_status === 1" @click="showPlaylist(item)" size="mini" type="primary">
            <i class="el-icon-more"></i>
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <el-dialog width="500px" title="关联播出单" :visible.sync="showPlaylists">
    <el-table :data="playlists">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column :width="80" prop="status" label="状态">
         <template slot-scope="scope">
          <!-- 审核中 -->
          <el-tooltip v-if="scope.row.status === 1" effect="dark" content="审核中" placement="bottom">
            <i class="fa fa-bell"></i>
          </el-tooltip>
          <!-- 未通过 -->
          <el-tooltip v-if="scope.row.status === 2" effect="dark" content="未通过" placement="bottom">
            <i class="fa fa-ban"></i>
          </el-tooltip>
          <!-- 已过期 -->
          <el-tooltip class="item" effect="dark" content="已过期" placement="bottom"
                      v-if="scope.row.status === 4">
            <i class="fa fa-warning"></i>
          </el-tooltip>
          <!-- 已发布 -->
          <el-tooltip
            class="item"
            effect="dark"
            v-if="scope.row.status === 3" content="已发布" placement="bottom">
            <i class="fa fa-check"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :width="100" prop="user.name" label="制作人"></el-table-column>
    </el-table>
  </el-dialog>
</div>
</template>

<script>
import refreshbutton from '@/components/RefreshButton.vue'

import http from '../../../../static/js/utils/http'

export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },

  components: {
    refreshbutton
  },

  data () {
    return {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 0,
        label: '横屏'
      }, {
        value: 1,
        label: '竖屏'
      }],
      direction: '',
      search: '',
      playlists: [],
      showPlaylists: false
    }
  },

  computed: {
    filtedList () {
      if (this.direction === '' && this.search === '') return this.list

      let list = this.list
      if (this.search) {
        list = this.list.filter(tpl => {
          return tpl.name.indexOf(this.search) !== -1
        })
      }

      if (this.direction !== '') {
        list = list.filter(tpl => {
          return tpl.direction === this.direction
        })
      }

      return list
    }
  },

  methods: {
    refresh () {
      this.$emit('reload')
    },

    remove (tpl, index) {
      if (tpl.use_status === 1) {
        return this.$notify.warning({
          title: '警告',
          message: '该模板处于使用状态，不能删除！'
        })
      }

      this.$emit('remove', tpl, index)
    },
    editor(val) {
      this.$store.state.selectItemData = val
    },

    showPlaylist (tpl) {
      let url = `playlists/template/${tpl.id}`

      http.get(url)
        .then(res => {
          this.playlists = res.data.playlists
          this.showPlaylists = true
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
.searchInput {
  width: 250px;
}

.tpl-content{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: -20px;
  .tpl-wrapper{
    position: relative;
    margin: 0 6px 30px 40px;
    width: 282px;
    height: 360px;
    overflow: hidden;
    border: 1px solid #dedede;
    vertical-align: middle;
    text-align: center;
    background-color: #f1f4f5;
    .image-h{
      margin-top: 70px;
      width: 280px;
      height: 158px;
    }
    .image-v{
      margin-top: 28px;
      width: 158px;
      height: 240px;
    }
    .overlay {
      transition: opacity .3s ease;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .5);
      z-index: 2;
      opacity: 0;
    }
    .item-bottom{
      position: absolute;
      width: 100%;
      bottom: 0px;
      z-index: 3;
      background-color: #fff;
    }
    .item-title{
      margin: 15px;
      font-size: 16px;
      line-height: 30px;
    }
    .item-btn {
      margin-right: -10px;
      height: 0;
      padding: 0;
      transition: height .3s;
      .el-button{
        margin-right: 10px;
      }
    }
    &:hover {
      .overlay {
        opacity: 1;
      }
      .item-btn {
        height: 44px;
      }
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
}
</style>
