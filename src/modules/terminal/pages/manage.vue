<template>
  <div class="manage-terminal-index" id="manage-terminal-index" v-bind:class="{ 'twoColumnLayout': showSideBar, 'oneCL': !showSideBar }">
    <div class="aside-wrapper">

      <side-bar>
        <span class="title" slot="title">组织机构</span>
        <group-panel slot="component" @onclick="selectedGroup" gtype="groups" filter></group-panel>
      </side-bar>
      <side-bar v-show="showSideBar">
        <span class="title" slot="title">分组</span>
        <group-panel v-if="selectedGroupId !== 0" slot="component" :edit="true" :groupId="selectedGroupId" @updateTreeNode="updateTreeNode" @onclick="selectedTree" gtype="trees" filter></group-panel>
      </side-bar>
      <div class="slide" style="position: absolute; width: 20px;right: 0px;top: 50%;margin-top: -8px; height: 16px;background: #3f94ef;text-align: center;border-radius: 4px;color: #ffffff;">
          <i v-bind:class="{ 'el-icon-d-arrow-left': showSideBar, 'el-icon-d-arrow-right': !showSideBar }" style="height:12px;position:absolute;margin: auto;top: 0px; left: 0; bottom: 0; right: 0;cursor:pointer;" @click="toggleSlide()"></i>
      </div>

    </div>

    <router-view>
      <span slot="submenuName">终端列表</span>
    </router-view>
  </div>
</template>


<script>
import GroupPanel from '@/modules/group/components/group'
import RouterView from '@/components/RouterView'
import SideBar from '@/components/SideBar.vue'

export default {
  components: {
    GroupPanel, RouterView, SideBar
  },

  data () {
    return {
      selectedGroupId: 0,
      selectedTreeId: 0,
      showSideBar: true,
      slideIconClass: 'el-icon-d-arrow-left'
    }
  },

  methods: {
    selectedGroup (data) {
      this.selectedGroupId = data.id
    },

    updateTreeNode (node) {
      this.selectedTreeId = node.id
    },

    selectedTree (data) {
      this.selectedTreeId = data.id
    },

    toggleSlide () {
      this.showSideBar = !this.showSideBar
    },
  },

  watch: {
    selectedTreeId: {
      handler (n) {
        this.$router.push({path: `/manage/terminal/${n}`})
      }
    }
  }
}
</script>

<style lang="scss">
  #manage-terminal-index {
    /* > div:nth-child(2) {
      margin-left: 400px;
    } */
    /* .aside-wrapper {
      display: flex;
      width: 400px;
    } */
    .el-tree {
      height: calc(100% - 46px);
    }
  }
  #manage-terminal-index{
    .aside-wrapper {
      transition: width 0.4s;
      display: flex ;
    }
  }
  #manage-terminal-index.twoColumnLayout {
    > div:nth-child(2) {
      margin-left: 415px;
    }
    .aside-wrapper {
      position: relative;
      width: 464px !important;
    }
  }

  .oneCL {
    > div:nth-child(2) {
      margin-left: 0;
    }
    .aside-wrapper {
      width: 0;
      background-color: #ffffff;
      .submenu{
        width: 0px;
        overflow: hidden;
      }
    }
  }
</style>
