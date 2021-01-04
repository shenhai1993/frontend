<template>
  <!-- 查看播出单详情对话框 -->
  <el-dialog title="查看播出单详情"
             :visible.sync="detailsVisible"
             @close="click_close">
    <div class="twoColumnLayout" v-if="listitem">
      <checkplaylist :listitem='listitem'></checkplaylist>
    </div>
    <!-- 内部嵌套的弹框 -->
     <el-dialog width="40%"
                title="此播出单下放的拼接屏"
                :visible.sync="innerVisible"
                append-to-body>
      <ul class="itemListUl" v-if="listitem">
        <li v-for="item in listitem.publish_screens" :key="item.name" class="itemList">
          {{ item.name }}
        </li>
      </ul>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" class="checkList" @click="innerVisible = true">查看此播出单下放的拼接屏</el-button>
      <el-button type="primary" @click="click_close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import checkplaylist from '@/modules/mpdp/pages/playlist/stepseditor/steptwoaddcontent.vue'

export default {
  components: {
    checkplaylist
  },
  props: ['listitem', 'isvisible'],
  watch: {
    listitem (v, ov) {
      if (v) {
        this.PUT_TEMPLATE_MPDP(v.content.scene)
        this.PUT_FILES(v.content.elements)
        this.CLEAR_CHECK_MATERIAL()
      }
    },
    isvisible (v, ov) {
      this.detailsVisible = v
    }
  },
  data () {
    return {
      detailsVisible: false,
      activeTerminal: null,
      activeTnum: 0,
      innerVisible: false
    }
  },
  computed: {
    ...mapState({
      chiocedTemplate: state => state.mpdp.chiocedTemplate,
      selectedFiles: state => state.mpdp.selectedFiles
    })
  },
  methods: {
    ...mapMutations([
      'PUT_TEMPLATE_MPDP',
      'PUT_FILES',
      'ADD_SELECTED_ELEMENT_MPDP',
      'CLEAR_CHECK_MATERIAL'
    ]),
    click_close () {
      this.detailsVisible = false
      this.$emit('update:isvisible', false)
      this.PUT_TEMPLATE_MPDP({})
      this.PUT_FILES({})
      this.$emit('update:listitem', null)
    },
    click_screen (item, col, vindex, tnum) {
      this.activeTnum = Number(col) * vindex + tnum
    }
  }
}
</script>

<style lang="scss" scoped>
  .virtualShow {
    // width: 825px;
    // margin-left: calc(50% - 412px);
    overflow-y: auto;
    display: table;
    &.verticalSceen {
      width: 525px;
      // margin-left: calc(50% - 262px);
      > div {
        &:nth-child(1) {
          width: 285px;
        }
      }
    }
    > div {
      // float: left;
      display: table-cell;
      vertical-align: top;
      &:nth-child(1) {
        // width: calc(100% - 240px);
        width: 585px;
        .screenRow {
          display: table;
          table-layout: fixed;
          width: 100%;
          > div {
            cursor: pointer;
            &.active {
              background-color: #909399;
              color: white;
            }
            font-size: 20px;
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            border: 1px solid #909399;
          }
        }
      }
      &:nth-child(2) {
        width: 240px;
        padding-left: 30px;
        // border-left: 1px solid #909399;
        .terminalInfo {
          position: sticky;
          top: 0;
          .el-form-item {
            margin-bottom: 0;
            .el-form-item__label {
              line-height: 30px;
            }
            .el-form-item__content {
              line-height: 30px;
              .el-progress {
                line-height: 30px;
              }
            }
          }
        }
      }
    }
  }
  .twoColumnLayout {
    > div {
      &:nth-child(1) {
        width: 100%;
      }
    }
  }
  .dialogInside {
    [class^=el-dialog] {
      overflow: hidden;
    }
  }
  .itemListUl {
    overflow: hidden;
    .itemList {
      padding: 7px 15px;
      margin: 5px 0;
      border: 1px solid #ebebeb;
      width: 50%;
      float: left;
      text-align: center;
    }
  }
  .checkList {
    float: left;
  }
</style>
