<template>
  <div id="statisticsBox" class="mainpage threeColumnLayout ">
    <div>
      <el-menu slot="component" class="el-menu-vertical-demo" mode="horizontal" :default-active="activedPath" router>
        <el-menu-item index="terminals">
          <span>播放统计</span>
        </el-menu-item>
        <el-menu-item index="details">
          <span>终端播放流水</span>
        </el-menu-item>
        <el-menu-item index="element">
          <span>素材统计</span>
        </el-menu-item>
        <el-menu-item index="playlists">
          <span>播出单统计</span>
        </el-menu-item>
        <el-menu-item index="contents">
          <span>内容统计</span>
        </el-menu-item>
        <el-menu-item index="terminals_stat">
          <span>终端统计</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="aside-wrapper" id="groupBox">
      <side-bar  v-if="activedPath !=='element'">
        <span class="title" slot="title">组织机构</span>
        <group-panel slot="component" @onclick="selectedGroup" gtype="groups" filter></group-panel>
      </side-bar>
      <side-bar v-if="activedPath !=='element'">
        <span slot='title' class="title">终端所属分组</span>
        <div class="slot-wrapper" slot="component">
          <div class="index-tree-wrapper">
            <group-panel v-if="selectedGroupId !== 0" slot="component" :groupId="selectedGroupId" @updateTreeNode="updateTreeNode" @onclick="tree_onclick" gtype="trees" :filterTextFromFather="filterText" filter >
            </group-panel>
          </div>
        </div>
      </side-bar>
      <side-bar v-if="activedPath==='terminals' || activedPath==='details'" class="terminalGroup">
        <span slot='title' class="title">终端列表</span>
        <div class="index-tree-wrapper" slot="component">
          <table-list :tableData="tabData"></table-list>
        </div>
      </side-bar>
      <div  v-if="activedPath==='element'" style="min-width: 220px;border-right: 1px solid #d0e0f2">
        <folder-panel v-on:onclick="folder_onclick" v-bind:edit="false" v-bind:filter="false"></folder-panel>
      </div>
    </div>

    <router-view>
      <span slot="submenuName">终端</span>
    </router-view>
  </div>
</template>

<script>
  // public layout components
  import SideBar from '@/components/SideBar.vue'
  import FolderPanel from '@/modules/element/components/folder/folder.vue'
  import RouterView from '@/components/RouterView'
  import api from '../static/js/TerminalGroup'
  import tableList from '../components/StatisticsTable'
  // other module's components
  import GroupPanel from '@/modules/group/components/group'
  import {mapMutations} from 'vuex'
  import {SET_GROUP_ID} from "../store/mutation-types";

  export default {
    components: {
      SideBar, RouterView, FolderPanel, GroupPanel, tableList
    },

    data () {
      return {
        // groupid: 1,
        data: {},
        tree_id: 0,
        filterText: '',
        tabData: [],
        selectedGroupId: 0,
        containSub: false

      }
    },

    computed: {
      params () {
        let params = {}
        params.tree_id = this.tree_id
        return params
      },
      activedPath () {
        let path = this.$route.path

        return path.split('/').pop()
      },
    },
    methods: {
      ...mapMutations(['SET_ELEMENTS_ID', 'SET_GROUP_ID']),
      tree_onclick(node) {
        this.tree_id = node.id
        this.SET_GROUP_ID(node.id)
        this.getDashbroad()
      },
      selectedGroup (data) {
        this.selectedGroupId = data.id
      },
      updateTreeNode (node) {
        this.tree_onclick(node)
      },
     /**
      * 初始化终端列表
      * */
      getDashbroad () {
        if (this.tree_id === 0) {
          setTimeout(() => {
            this.getDashbroad()
          }, 300);
        } else {
          api.getTerminalTable(this.params).then(res => {
             this.tabData = res.data.message
          })
        }
      },
      /**
       * 点击素材存储当前ID
       * */
      folder_onclick (node) {
        this.SET_ELEMENTS_ID(node.node.id)
      },
    },

    created () {
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  #statisticsBox{
    >.aside-wrapper{
      position: relative;
      display: -webkit-box !important;
      display: -ms-flexbox !important;
      display: flex !important;
      height: 100%;
      float: left;
    }
  }
  #groupBox:hover{
    .terminalGroup{
      width: 300px;
      border-right: 1px solid #d0e0f2;
    }
  }
  .terminalGroup{
    position: absolute;
    left: 455px;
    width: 0px;
    transition: width 0.5s;
    overflow: hidden;
    z-index: 9999;
    background: #ffffff;
  }
</style>
