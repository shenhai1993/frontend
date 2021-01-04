<template>
  <el-container class="playlist-editor-steptwo">
    <!-- <el-aside width="200px">
      <el-menu height="100%" :default-active="activeMenu">
        <el-menu-item index="1" @click="activeMenu = '1'">
          <span>按组</span>
        </el-menu-item>
        <el-menu-item index="2" @click="activeMenu = '2'">
          <span>按终端</span>
        </el-menu-item>
        <el-menu-item index="3" @click="activeMenu = '3'">
          <span>按标签</span>
        </el-menu-item>
      </el-menu>
    </el-aside> -->
    <el-main>
      <el-row :gutter="20" type="flex" class="stretch">
        <el-col :class="{'group-wrapper': activeMenu !== '1'}" :span="14">
          <div class="tree-wrapper">
            <group-panel :strictly="true" :cascader="true" gtype='trees' @oncheck="getChecked"   :showCheckbox="true" ref="groupPanel"></group-panel>
          </div>
        </el-col>
        <el-col :span="10" v-show="activeMenu === '2'">
          <!-- 按终端 -->
          <!-- <div class="tree-wrapper">
             <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              @select="selectTerminal"
              height="100%"
              stripe border style="width: 100%">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column label="终端名称" align="right" width="" prop="name">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
            </el-table>
           </div> -->
        </el-col>
        <el-col class="tag-wrapper" :span="10" v-show="activeMenu === '3'">
          <el-checkbox @change="setCheckedTags" v-model="checkedTags" class="checkbox" border v-for="(item,index) in tags" :key="index" :label="item.name">{{item.name}}</el-checkbox>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import GroupPanel from '@/modules/group/components/group'
import api from '@/modules/group/static/api'
import {mapState, mapMutations} from 'vuex'

export default {
  components: {
    GroupPanel
  },

  props: {
    defaultChecked: {
      type: Array,
      default: []
    }
  },

  data () {
    return {
      tableData: [],
      activeMenu: '3',
      tags: [],
      checkedTags: []
    }
  },

  computed: {
    ...mapState({
      selectedGroups: state => state.drugs.selectedGroups,
      selectedTags: state => state.drugs.selectedTags
    })
  },

  methods: {
    ...mapMutations([
      'SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS',
      'SET_PLAYLIST_MUTIPLETPL_SELECTED_GROUPS'
    ]),
    getChecked (checked) {
      this.SET_PLAYLIST_MUTIPLETPL_SELECTED_GROUPS(checked.checked.checkedKeys)
      this.$emit('update:canNext', this.canNextFn())
    },
    // 按终端
    // nodeClick (node) {
    //   console.log(`node:==>`)
    //   console.log(node)
    //   api.getTerminals({group_id: node.id}).then(res => {
    //       this.tableData = res.data.message
    //     })
    // },

    setCheckedTags () {
      this.SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS(this.checkedTags)
      this.$emit('update:canNext', this.canNextFn())
    },

    // 编辑时设置checkedTags值
    setEditCheckedTags (tags) {
      this.SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS(tags)
      this.checkedTags = tags
    },

    setEditSelectGroups (groups) {
      this.SET_PLAYLIST_MUTIPLETPL_SELECTED_GROUPS(groups)
      this.$refs.groupPanel.setChecked(groups)
    },

    canNextFn () {
      if (this.selectedGroups.length !== 0 || this.selectedTags.length !== 0) {
        return true
      }
      return false
    },

    _getTags () {
      api.getTags().then(res => {
        this.tags = res.data.message
      }).catch(e => {
        console.log(e)
      })
    }
  },

  watch: {
    activeMenu (n, o) {
      if (n === '1') {
        this.checkedTags = []
        this.SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS([])
      }
      this.$emit('update:canNext', this.canNextFn())
    }
  },

  created () {
    this._getTags()
  }
}
</script>

<style lang="scss" >
.playlist-editor-steptwo{
  .el-aside{
    padding-bottom: 20px;
  }
  .el-menu{
    height: 100%;
  }
  .stretch{
    align-items: stretch;
    height: 100%;
  }
  .group-wrapper{
    border-right: 1px solid #e6e6e6;
    height: 100%;
    overflow: auto;
  }
  .tag-wrapper{
    overflow: auto;
  }
  .checkbox{
    padding: 4px 15px 3px 10px;
    margin: 10px 0 0 10px;
  }
}

</style>
