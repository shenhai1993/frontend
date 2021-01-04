<template>
  <div class="clearfix" id="templateContent">
    <!-- 创建模板 -->
    <div v-if="create" class="m-b-15">
      <el-dropdown>
        <el-button icon="el-icon-news">
          创建<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/template/create/0">
            <el-dropdown-item>横屏模板</el-dropdown-item>
          </router-link>
          <router-link to="/template/create/1">
            <el-dropdown-item>竖屏模板</el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input style="display:inline-block;width:200px;" placeholder="请输入名称过滤" prefix-icon="el-icon-search" v-model="searchQuery">
      </el-input>
    </div>

    <div v-if="list.length == 0" style="margin:10px;">
      暂时没有模板噢
    </div>

    <div v-for="(item, index) in list" :key="item.id" class="item">
      <div class="ribbon ribbon-badge" v-if="item.status !== '0'">
        <!-- <span class="ribbon-inner check">已上架</span> -->
      </div>
      <div :class="{'vertical': item.direction == '1', 'horizon': item.direction == '0'}"
          class="image">
        <div class="overlay">
        </div>
        <img :src="item.thumb_path" />
      </div>
      <div class="item-bottom">
        <div class="title" :title="item.name">{{ item.name }}</div>
        <div style="padding-bottom:16px;margin-top:-8px;">
          <router-link title="编辑" v-if="item.status == '0'" :to="{ name: 'templateedit', params: {id: item.id} }">
            <el-button size="mini" type="primary"><i class="el-icon-edit"></i></el-button>
          </router-link>
          <el-button title="上架" v-if="item.status == '0'" @click="up(item, index)" size="mini" type="primary">
            <i class="el-icon-upload2"></i>
          </el-button>
          <el-button title="删除" v-if="item.status !== '0'" @click="remove(item, index, groupId)" size="mini" type="primary">
            <i class="fa fa-trash-o"></i>
          </el-button>
          <el-button title="删除" v-if="item.status == '0'" @click="remove(item, index)" size="mini" type="danger">
            <i class="el-icon-delete"></i>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../../../../static/js/utils/http'

export default {
  props: ['create', 'list', 'canBuy', 'canEdit', 'groupId'],

  methods: {
    remove (item, index, groupId) {
      this.$emit('remove', item, index, groupId)
    },
    // 上架
    up (item, index) {
      // this.$confirm('确认将该模板上架, 是否继续?', '提示', {
      //   type: 'warning'
      // }).then(() => {
      // $('.item')[index].mouseover()
      http.get(`/templates/${item.id}/up`)
        .then((res) => {
          this.$notify({
            type: 'success',
            message: '模板已上架!'
          })
          item.status = '1'
        })
      // })
    },
    // 下架
    down (item, index, groupId) {
      let data = {group_id: groupId}
      http.delete(`/templates/${item.id}`, data)
        .then((res) => {
          this.$notify({
            type: 'success',
            message: '模板已删除!'
          })
          item.status = '0'
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../static/listview.scss";
</style>
