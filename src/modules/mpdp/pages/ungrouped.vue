<template>
  <div class="parentConent">
    <!--
    <el-row>
      <el-col :span="5">
        <div style="height: 100%; padding-right: 10px;">
          <side-bar>
            <span slot='title' class="title">终端</span>
            <div class="slot-wrapper" slot="component">
              <div class="index-tree-wrapper">
                <group-panel v-on:onclick="tree_onclick" gtype="trees" :filterTextFromFather="filterText" filter edit>
                  <template slot="actions">
                    <el-input class="p-b-10 w210" placeholder="输入关键字进行过滤" v-model="filterText" clearable style="width: 180px;" />
                    <el-tooltip content="包含子分支" effect="dark">
                      <el-button :class="{'button-active': containSub}" @click="handleContainSub">
                        <i class="fa fa-sort-amount-desc"></i>
                      </el-button>
                    </el-tooltip>
                  </template>
                </group-panel>
              </div>
            </div>
          </side-bar>
        </div>
      </el-col>
      <el-col :span="19">
      -->
      
        <lists :params="params"></lists>
    
    <!--
      </el-col>
    </el-row>
    -->
  </div>
</template>

<script>
import headerbar from '@/components/HeaderBar'
// import lists from '@/modules/terminals/pages/list/lists.vue'
import lists from '@/modules/terminal/pages/terminal/terminals.vue'
import SideBar from '@/components/SideBar.vue'
import GroupPanel from '@/modules/group/components/group'

export default {
  components: {
    headerbar, lists, SideBar, GroupPanel
  },
  data () {
    return {
      params: {type: 'mpdp'},
      filterText: '',
      containSub: false
    }
  },

  methods: {
    tree_onclick(node) {
      console.log('node:==>', node)
      this.params = Object.assign({}, this.params, { tree_id: node.id })
    },

    handleContainSub () {
      this.containSub = !this.containSub
      this.$store.commit('SET_CONTAINSUB', this.containSub)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
  .button-active {
    background-color: #409eff;
    color: #fff;
  }
</style>
