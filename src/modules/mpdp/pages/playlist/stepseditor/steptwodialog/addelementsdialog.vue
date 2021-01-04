<!--
  modify: wangwei(w.w@tcl.com)  2017-11-26
  目标: 选择素材的弹窗控件。
       组件本身只应返回选中文件，不应对数据存放位置、用途做任何猜测
  功能：1，选择一个或多个文件，点击“确定”，将文件列表通过事件方式，上报到父组件
       2，可以指定类型，只选择指定类型的方件
       3，允许本地上传文件，并选择使用
  使用方法：
-->
<template>
  <el-dialog title="添加素材" :visible.sync="show" @close='_close'
             width='60%' top='30px'>
    <div class="m-l-10 p-b-10">
      <el-checkbox v-model="checkAll"
                  @change="handleCheckAllChange" class="m-r-10">全选</el-checkbox>
      <el-button-group>
        <el-button size="small" v-for="item in typeItems" :key='item.type'
                    @click="switchType(item, item.type)"
                    :class="{activeType : item.selected}"
                    v-if='currentType === item.type'>
          {{ item.name }}
        </el-button>
      </el-button-group>
    </div>
    <el-checkbox-group v-model="checkedMaterials" @change="handleCheckedMaterialChange">
      <el-row class="materialRow">
        <!-- 提示 -->
        <el-alert title="选择的顺序跟播放的顺序有关 —— 先选先播！"
                  type="warning" center
                  show-icon>
        </el-alert>
        <el-col v-if="fileList && !fileList.length" class="nodata">
          <div>暂无数据</div>
        </el-col>
        <el-col :span="6" v-for="item in fileList" :key="item.id" class="materialCard">

        <!-- 内容 -->
          <el-checkbox :label="item" class="ellipsis" :title="item.name">
            {{item.name}}
          </el-checkbox>
          <el-card :body-style="{ padding: '0px' }">
            <div class="material">
              <img v-if="item.type === 'image'" :src="item.path" class="image">

              <audio controls v-if="item.type === 'audio'">
                <source :src="item.path" type="audio/mp3">
                您的浏览器不支持 audio 元素。
              </audio>

              <video controls v-if="item.type === 'video'">
                <source :src="item.path" type="video/mp4">
                您的浏览器不支持 video 元素。
              </video>

              <iframe v-if="item.type === 'link'" :src="item.type"></iframe>
            </div>
            <div style="padding: 10px">
              name
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-checkbox-group>
    <div slot="footer" class="dialog-footer">
      <el-button @click="click_cancel">取消</el-button>
      <el-button type="primary" @click="click_save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { selected } from '@/modules/terminals/static/js/utils.js'

export default {
  props: ['elementsdialogshow', 'selectedReginType'],
  watch: {
    elementsdialogshow (v, ov) {
      this.show = v
      this.checkedMaterials = []
    },
    selectedReginType (v, ov) {
      let self = this
      v = /picture/.test(v) ? 'image' : v
      self.currentType = v
      self.typeItems.forEach((ele, index) => {
        const regExp = new RegExp(ele.type)
        if (regExp.test(v)) {
          this.switchType(this.typeItems[index], v)
        }
      })
    }
  },
  data () {
    return {
      show: false,
      multipleSelection: [],
      checkAll: false,
      checkedMaterials: [],
      typeItems: [
        // {name: '全部', type: 'all'},
        {name: '图片', type: 'image'},
        {name: '视频', type: 'video'},
        {name: '音乐', type: 'audio'},
        {name: '网页', type: 'link'}
      ],
      currentType: ''
    }
  },
  computed: {
    ...mapState({
      fileType: state => state.element.fileType,
      fileList: state => state.element.fileList
    })
  },
  methods: {
    ...mapMutations([
      'SET_FILELIST', 'SET_FILETYPE', 'ADD_SELECTED_ELEMENT'
    ]),

    ...mapActions([
      'getFileList'
    ]),

    async switchType (item, type, groupId) {
      this.SET_FILETYPE(type)

      let filelist = await this.getFileList({groupId: 1, type})
      if (type === 'video') {
        let _stream = await this.getFileList({groupId: 1, type: 'stream'})
        filelist = filelist.concat(_stream)
      }
      this.SET_FILELIST({ filelist })
      selected(this, item, 'activeMaterial')
    },

    click_save () {
      this._close()
      // 向上提交文件
      this.$emit('fileSelected', this.checkedMaterials)
      this.checkAll = false
    },
    click_cancel () {
      this._close()
    },
    _close () {
      this.$emit('update:elementsdialogshow', false)
      this.show = false
    },
    handleCheckAllChange (val) {
      this.checkedMaterials = val ? this.fileList : []
    },
    handleCheckedMaterialChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.fileList.length
    }

  }
}
</script>
<style lang="scss" scoped>
  .el-tabs {
    .el-tab-pane {
      &.local {
        > div {
          height: 542px;
        }
      }
      &.cloud {
        overflow: hidden;
        > div {
          padding: 10px;
          &:nth-child(1) {
            float: right;
            width: 300px;
          }
          &:nth-child(2) {
            margin-right: 300px;
            height: 450px;
          }
        }
      }
    }
  }
  .elementsTitle {
    font-size: 16px;
    margin:  0 0 10px 0;
    padding: 5px;
    background-color: #EDF2FC;
    > button {
      float: right;
    }
  }
  .el-button.remove {
    &:hover {
      color: red;
    }
  }
  .materialRow {
    overflow-y: auto;
    border: 1px solid #EDF2FC;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.1) inset;
    .materialCard {
      position: relative;
      padding: 10px;
      .el-checkbox {
        position: absolute;
        bottom: 22px;
        left: 24px;
        width: 80%;
      }
    }
  }
  .nodata {
    font-size: 18px;
    padding: 30px;
    text-align: center;
  }
  .el-button.activeType {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
  .el-alert {
    line-height: 1;
  }
  @media screen and (max-width: 1280px) {
    .materialRow {
      height: 420px;
    }
  }
  @media screen and (min-width: 1281px) and (max-width: 1440px) {
    .materialRow {
      height: 450px;
    }
  }
  @media screen and (min-width: 1441px) and (max-width: 1920px) {
    .materialRow {
      height: 630px;
    }
  }
</style>
