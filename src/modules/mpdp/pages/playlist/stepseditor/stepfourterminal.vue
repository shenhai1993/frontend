<template>
  <div id="choiceTerminal">
    <div style="margin-bottom: 30px;">
      <el-radio v-model="publish_type" :label="1">按拼接屏发布</el-radio>
      <el-radio v-model="publish_type" :label="2">按分组发布</el-radio>
    </div>
    <el-transfer
      v-show="publish_type == 1"
      filter-placeholder="请输入终端名称"
       v-model="searchKeys"
       :data="terminalData"
       :titles="titles"
       @change="choiceChange">
    </el-transfer>
    <div v-if="publish_type == 2">
      <el-row>
        <el-col :span="14" style="padding-left: 20px; padding-bottom: 10px;"><el-button>选择终端</el-button></el-col>
        <el-col :span="10" style="padding-left: 20px; padding-bottom: 10px;"><el-button>选择标签</el-button></el-col>
      </el-row>
      <el-row style="border-top: 1px solid #e6e6e6;">
        <el-col :span="14" style="border-right: 1px solid #e6e6e6; padding-top: 10px;">
          <group-panel
            :strictly="true"
            :cascader="true"
            gtype="trees"
            @oncheck="getChecked"
            :showCheckbox="true"
            :defaultChecked="defaultChecked"
            ref="groupPanel">
          </group-panel>
        </el-col>
        <el-col :span="10" style="padding: 10px 20px;">
          <el-checkbox
            v-model="checkedTags"
            v-for="(item, index) in tags"
            :key="index"
            :label="item.name"
            @change="setCheckedTags"
            class="checkbox"
            border>
            {{item.name}}
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import TerminalGroup from '@/modules/terminal/static/js/TerminalGroup.js'
import GroupPanel from '@/modules/group/components/group'
import api from '@/modules/group/static/api'

export default {
  components: {
    GroupPanel
  },

  props: ['activeSteps'],

  data () {
    return {
      publish_type: 0,
      defaultChecked: [],
      tags: [],
      checkedTags: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      terminalList: null,
      searchKeys: [],
      titles: ['拼接列表', '已选择拼接列表']
    }
  },

  computed: {
    ...mapState({
      'terminalGroups': state => state.terminal.terminalGroups,
      'chiocedTemplate': state => state.mpdp.chiocedTemplate,
      'editItem': state => state.mpdp.editItem
    }),

    terminalData () {
      const data = []
      if (this.terminalList && this.chiocedTemplate && this.terminalList.message.length) {
        this.terminalList.message.forEach((terminal, index) => {
          // 把不同方向拼接的终端给过滤掉
          if (this.chiocedTemplate && (String(this.chiocedTemplate.direction) !== String(terminal.direction))) return
          else if (this.chiocedTemplate.row !== terminal.row || this.chiocedTemplate.column !== terminal.col) return
          data.push({
            label: terminal.name,
            key: index
          })
        })
        return data
      }
    }
  },

  created () {
    this.PUT_PLAYLIST_TERMINAL_MPDP([])
  },

  async mounted () {
    this.terminalList = await TerminalGroup.getscens()
    console.log('this.terminalList:==>', this.terminalList)
    this.getTags()
  },

  methods: {
    ...mapActions([
      'getTerminalGroups'
    ]),

    ...mapMutations([
      'PUT_PLAYLIST_GROUP_MPDP',
      'PUT_PLAYLIST_TERMINAL_MPDP'
    ]),

    canNextFn () {
      if (this.publish_type === 1) {
        if (this.searchKeys.length > 0) {
          return true
        }
      } else if (this.publish_type === 2) {
        if (this.defaultChecked.length > 0 || this.checkedTags.length > 0) {
          return true
        }
      }
      return false
    },

    getTags () {
      api.getTags().then(res => {
        this.tags = res.data.message
      }).catch(e => {
        console.log(e)
      })
    },

    choiceChange (indexArr) {
      let me = this
      let choicedTerminal = []
      indexArr.forEach(eleIndex => {
        choicedTerminal.push(me.terminalList.message[eleIndex])
      })
      this.$emit('update:canNext', this.canNextFn())
      this.PUT_PLAYLIST_TERMINAL_MPDP(choicedTerminal)
    },

    getChecked (val) {
      this.defaultChecked = val.checked.checkedKeys
      this.$emit('update:canNext', this.canNextFn())
      this.PUT_PLAYLIST_GROUP_MPDP({ type: this.publish_type, trees: this.defaultChecked, tags: this.checkedTags })
    },

    setCheckedTags () {
      this.$emit('update:canNext', this.canNextFn())
      this.PUT_PLAYLIST_GROUP_MPDP({ type: this.publish_type, trees: this.defaultChecked, tags: this.checkedTags })
    }
  },

  watch: {
    activeSteps (v, ov) {
      if (v === 3) {
        if (this.$route.params.id) {
          const data = this.terminalList.message
          const arr = this.editItem.screens
          this.searchKeys = []
          for (let j = 0; j < arr.length; j++) {
            const id = arr[j].id
            for (let i = 0; i < data.length; i++) {
              if (id === data[i].id) {
                this.searchKeys.splice(i, 0, i)
                break
              }
            }
          }
          this.choiceChange(this.searchKeys)
        }
      }
    },

    editItem (v) {
      if (v.trees) {
        let newTrees = []
        const trees = v.trees
        for (let i = 0; i < trees.length; i++) {
          newTrees.push(trees[i].id)
        }
        this.defaultChecked = newTrees
      }
      if (v.tagged) {
        let newTags = []
        const tags = v.tagged
        for (let i = 0; i < tags.length; i++) {
          newTags.push(tags[i].tag_name)
        }
        this.checkedTags = newTags
      }
      if (v.publish_type) {
        this.publish_type = v.publish_type
      } else {
        this.publish_type = 1
      }
    },

    publish_type (v) {
      let newTrees = []
      let newTags = []
      if (v === 2) {
        newTrees = this.defaultChecked
        newTags = this.checkedTags
        this.$emit('update:canNext', this.canNextFn())
      } else {
        this.choiceChange(this.searchKeys)
      }
      this.PUT_PLAYLIST_GROUP_MPDP({ type: v, trees: newTrees, tags: newTags })
    }
  }
}
</script>

<style lang="scss">
  #choiceTerminal {
    margin: 10px auto;
    .checkbox{
      margin: 10px 0 0 10px;
    }
    .el-input {
      width: 100%;
      input {
        margin-left: -30px!important;
        width: calc(100% - 30px)!important;
      }
    }
    @media screen and (max-width: 1440px) {
      .el-transfer-panel {
        width: 240px;
        height: 420px;
      }
    }
    @media screen and (min-width: 1441px) and (max-width: 1920px) {
      .el-transfer-panel {
        width: 280px;
        height: 600px;
      }
    }
  }
</style>
