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
  <el-dialog title="添加素材" :visible.sync="show" @close='_close' :destroy-on-close="true"
             width='60%' top='30px' append-to-body>
    <el-row>
      <el-col :span="6" style="height: 450px;overflow: auto">
        <folder-panel v-on:onclick="folder_onclick" v-bind:edit="false" v-bind:filter="true"></folder-panel>
      </el-col>
      <el-col :span="18"  style="height: 450px;overflow: auto">
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
                      type="warning" center v-if="showAlert"
                      show-icon>
            </el-alert>
            <el-col v-if="fileList && !fileList.length" class="nodata">
              <div>暂无数据</div>
            </el-col>
            <el-col v-if="isShow" :span="6" v-for="item in fileList" :key="item.id" class="materialCard">

            <!-- 内容 -->
              <el-checkbox :label="item" class="ellipsis element-name" :title="item.name">
                {{item.name}}
              </el-checkbox>
              <el-card @click="handleClick" :body-style="{ padding: '0px' }">
                <div class="material">
                  <img v-if="item.type === 'image'" :src="item.path" class="image">

                  <audio controls v-if="item.type === 'audio'">
                    <source :src="item.path" type="audio/mp3">
                    您的浏览器不支持 audio 元素。
                  </audio>
                  <!--<img v-if="item.type === 'video' && item.preview_image !==''" :src="item.preview_image" class="image">-->
                  <img v-if="item.type === 'video' && item.preview_image ===undefined" src="data:image/png;base64,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" class="image">
                  <img v-if="item.type === 'video' && item.preview_image !==undefined" :src="item.preview_image" class="image">
                  <!--<video controls v-if="item.type === 'video'">
                    <source :src="item.path" type="video/mp4">
                    您的浏览器不支持 video 元素。
                  </video>-->

                  <iframe v-if="item.type === 'link'" :src="item.type"></iframe>
                </div>
                <div style="padding: 10px">
                  name
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-col>
    </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="click_cancel">取消</el-button>
          <el-button type="primary" @click="click_save">确定</el-button>
        </div>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { selected } from '@/modules/terminals/static/js/utils.js'
import api from '@static/js/api/index'
import FolderPanel from '@/modules/element/components/folder/folder.vue'

const AVALIABLE = 0
const AUDIT = 1
const UNPASSED = 2
const USEING = 3
export default {
  props: ['elementsdialogshow', 'selectedReginType'],

  components: {
    FolderPanel
  },

  watch: {
    elementsdialogshow (v, ov) {
      this.show = v
      this.checkedMaterials = []
    },
    selectedReginType (v, ov) {
      v = v === 'picture' ? 'image' : v
      this.currentType = v
      this.typeItems.forEach((ele, index) => {
        if (v === ele.type) {
          this.switchType(this.typeItems[index], v)
        }
      })
    }
  },
  data () {
    return {
      show: false,
      isShow: true,
      audit: 0,
      multipleSelection: [],
      checkAll: false,
      checkedMaterials: [],
      typeItems: [
        // {name: '全部', type: 'all'},
        {name: '图片', type: 'image'},
        {name: '视频', type: 'video'},
        {name: '音乐', type: 'audio'},
        {name: '网页', type: 'webpage'}
      ],
      currentType: '',
      showAlert: true
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
      'SET_FILELIST', 'SET_FILETYPE', 'ADD_SELECTED_ELEMENT', 'SET_DIRECTORY_ID'
    ]),

    ...mapActions([
      'getFileList'
    ]),

    async switchType (item, type, groupId) {
      this.isShow = false
      this.SET_FILETYPE(type)
      let filelist = await this.getFileList({type})
      if (type === 'video') {
        let _stream = await this.getFileList({type: 'stream'})
        filelist = filelist.concat(_stream)
      }
      // filelist = filelist.filter(file => {
      //   return file.status === AVALIABLE || file.status === USEING
      // })
      console.log('filelist:==>', filelist)
      this.SET_FILELIST({ filelist })
      this.isShow = true
      selected(this, item, 'activeMaterial')
    },

    // _formatStatus (item) {
    //   let ret = AVALIABLE
    //   if (this.audit) {
    //     if (item.audit_status === 1) {
    //       ret = AVALIABLE
    //     } else if (item.audit_status === 2) {
    //       ret = UNPASSED
    //     } else if (item.audit_status === 0) {
    //       ret = AUDIT
    //     }
    //   }
    //   return ret
    // },

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
    },

    handleClick () {
      console.log('card')
    },

    // 外部手动设置显示文件类型
    setFileType (type) {
      this.currentType = type
      this.typeItems.forEach((ele, index) => {
        if (type === ele.type) {
          this.switchType(this.typeItems[index], type)
        }
      })
    },

    // 是否显示alert
    setShowAlert (val) {
      this.showAlert = val
    },

    folder_onclick (node) {
      console.log('node:==>', node)
      this.SET_DIRECTORY_ID(node.node.id)

      this.typeItems.forEach((ele, index) => {
        if (this.currentType === ele.type) {
          this.switchType(this.typeItems[index], this.currentType)
        }
      })
    }
  },

  created () {
    // 关闭审核请求
    // api.getAudit('playlists').then(res => {
    //   this.audit = res.data.element.status
    // })
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
  .element-name {
    display: inline-block;
    text-align: center;
    .el-checkbox__label {
      overflow: hidden;
      white-space: nowrap;
      vertical-align: middle;
      text-overflow: ellipsis;
      max-width: 80%;
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
        bottom: 10px;
        padding: 0 10px;
        width: calc(100% - 20px);
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
    /*.materialRow {
      height: 420px;
    }*/
  }
  @media screen and (min-width: 1281px) and (max-width: 1440px) {
    /*.materialRow {
      height: 450px;
    }*/
  }
  @media screen and (min-width: 1441px) and (max-width: 1920px) {
   /* .materialRow {
      height: 630px;
    }*/
  }
</style>
<style lang="scss">
  .element-name {
    display: inline-block;
    text-align: center;
    .el-checkbox__label {
      overflow: hidden;
      white-space: nowrap;
      vertical-align: middle;
      text-overflow: ellipsis;
      max-width: 80%;
    }
  }
</style>
