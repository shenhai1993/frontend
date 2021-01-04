<template>
  <div class="clearfix" id="templateContent">
    <!-- 创建场景 -->
    <div v-if="create" class="m-b-15">
      <el-dropdown>
        <el-button icon="el-icon-news">
          创建<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/template/create/0">
            <el-dropdown-item>横屏场景</el-dropdown-item>
          </router-link>
          <router-link to="/template/create/1">
            <el-dropdown-item>竖屏场景</el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input style="display:inline-block;width:200px;" placeholder="请输入名称过滤" prefix-icon="el-icon-search" v-model="searchQuery">
      </el-input>
    </div>

    <div v-if="list.length == 0" style="margin:10px;">
      暂时没有场景噢
    </div>

    <div v-for="(item, index) in list" :key="item.id" class="item">
      <div class="ribbon ribbon-badge" v-if="item.status === '1'">
        <span class="ribbon-inner check">已使用</span>
      </div>
      <div :class="{'vertical': item.direction == '1', 'horizon': item.direction == '0'}" class="image">
        <div class="overlay"></div>
        <img :src="item.thumb_path" />
      </div>
      <div class="item-bottom">
        <div class="title" :title="item.name">{{ item.name }}</div>
        <div style="padding-bottom:16px;margin-top:-8px;">
          <router-link title="编辑" v-if="item.status !== '1'" :to="{ name: 'sceneedit', params: {id: item.id} }">
            <el-button size="mini" type="primary"><i class="el-icon-edit"></i></el-button>
          </router-link>
          <el-button title="删除" v-if="item.status !== '1'" @click="remove(item, index)" size="mini" type="danger">
            <i class="el-icon-delete"></i>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['create', 'list', 'canBuy', 'canEdit'],

  methods: {
    remove: function (item, index) {
      this.$emit('remove', item, index)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../static/listview.scss";
</style>
