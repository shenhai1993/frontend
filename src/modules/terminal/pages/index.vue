<template>
  <div class="twoColumnLayout terminal-index">
    <div>
      <side-bar>
        <span slot='title' class="title">终端</span>
        <div class="slot-wrapper" slot="component">
          <div class="index-tree-wrapper">
            <group-panel v-on:onclick="tree_onclick" gtype="trees" :filterTextFromFather="filterText" filter edit>
              <template slot="actions">
                <el-input class="p-b-10 w200" placeholder="输入关键字进行过滤" v-model="filterText" clearable />
                <el-tooltip content="包含子分支" effect="dark">
                  <el-button :class="{'button-active': containSub}" @click="handleContainSub" size="mini">
                    <i class="fa fa-sort-amount-desc"></i>
                  </el-button>
                </el-tooltip>

              </template>
            </group-panel>
          </div>
          <div class="count">
            <echart id="chart" :color="color" :width="300" :height="300" xText="类别" yText="数量" :chartData="chartData" ></echart>
          </div>
        </div>
      </side-bar>
    </div>

    <router-view>
      <span slot="submenuName">终端</span>
    </router-view>
  </div>
</template>

<script>
// public layout components
import SideBar from '@/components/SideBar.vue'
import RouterView from '@/components/RouterView'
import Echart from '@/components/Echarts'
import api from '../static/js/TerminalGroup'
import {mapActions} from 'vuex'

// other module's components
import GroupPanel from '@/modules/group/components/group'

export default {
  components: {
    SideBar, RouterView, GroupPanel, Echart
  },

  data () {
    return {
      // groupid: 1,
      data: {},
      color: [
        '#67C23A', '#F56C6C', '#E6A23C' , '#409EFF'
      ],
      tree_id: 0,
      filterText: '',
      containSub: false

    }
  },

  computed: {
    params () {
      let params = {}
      params.tree_id = this.tree_id
      return params
    },

    chartData () {
      let arr =[]
      let str = ['在线', '离线', '待机', '总计']
      let i = 0
      for (const key in this.data) {
        if (this.data.hasOwnProperty(key)) {
          const val = this.data[key]
          arr.push([str[i++], val])
        }
      }
      return arr
    }
  },

  methods: {
    ...mapActions([
      'getTemplatesTags'
    ]),
    tree_onclick(node) {
      console.log('node:==>', node)
      this.tree_id = node.id
      this.$router.push(`/terminals/group/${node.id}`)
      this.getDashbroad()
    },

    getDashbroad () {
      if (this.tree_id === 0) {
        setTimeout(() => {
          this.getDashbroad()
        }, 300);
      } else {
        api.getDashbroad(this.params).then(res => {
          this.data = res.data.message
        })
      }
    },
    getTags(){
      this.getTemplatesTags()
    },
    handleContainSub () {
      this.containSub = !this.containSub
      this.$store.commit('SET_CONTAINSUB', this.containSub)
    }
  },

  created () {
    this.getDashbroad()
    this.getTags()
  }
}
</script>

<style lang="scss">
  .terminal-index {
    > div {
      &:nth-child(1) {
        width: 300px;
      }
      &:nth-child(2) {
        margin-left: 300px;
      }
    }
    .slot-wrapper {
      height: 100%;
    }
    .index-tree-wrapper {
      height: calc(100% - 260px);
      overflow: auto;
      // border-bottom: 2px solid #ebeef5;
    }
    .count {
      // width: 300px;
      padding: 0 10px;
      position: absolute;
      bottom: -26px;
    }
    .el-tree {
      height: calc(100% - 46px);
    }
    .w200 {
      width: 200px;
    }
    .button-active {
      background-color: #409eff;
      color: #fff;
    }
  }
</style>
