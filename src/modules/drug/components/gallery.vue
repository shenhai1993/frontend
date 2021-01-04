<template>
  <el-dialog width="800px" :title="title" :visible="showGalleryWindow" @close="click_cancel">
    <el-button @click="showElementsSelect" size="small" plain icon="el-icon-plus">素材库添加</el-button>
    <small>
      提示 ：可以拖动改变图片排序。
    </small>
    <el-row class="materialRow sortDiv">
      <el-col v-if="formDrug.gallery && !formDrug.gallery.length" class="nodata">
        <div>暂无数据</div>
      </el-col>
      <el-col :span="6" v-for="item in formDrug.gallery" :key="item.id" class="materialCard">

      <!-- 内容 -->
        <el-card :body-style="{ padding: '0px' }">
          <div class="material">
            <img :src="item.path" class="image">
          </div>
          <div style="padding: 5px;" class="gDiv">
            <div>{{item.name}}</div>
            <!-- <div class="bottom clearfix">
            </div> -->
            <div class="iconRight">
              <el-button type="text" class="button" @click="removeItem(item)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <dialog-button @clickCancel="click_cancel" @clickConfirm="submitForm('formDrug')"></dialog-button>
    </div>

    <element-selector 
      :elementsdialogshow.sync='elementsDialogShow'
      ref="elementSelector"
      @fileSelected="onFileSelected"
      :selectedReginType="selectedReginType">
    </element-selector>

  </el-dialog>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import DialogButton from '@/components/DialogButton'
import ElementSelector from '@/modules/element/lib/addelementsdialog.vue'
import Sortable from 'sortablejs'

export default {
  data () {
    return {
      formDrug: {
      },
      title: '设置图库',
      elementsDialogShow: false,
      selectedReginType: 'image'
    }
  },
  computed : {
    ...mapState({
      showGalleryWindow: state => state.drug.showGalleryWindow,
    })
  },
  props: {
    item: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },

  components: {
    DialogButton, ElementSelector
  },

  created () {
    this.formDrug = {}
    this.formDrug.drug_id = this.item.id
    if(this.item.gallery) {
      this.formDrug.gallery = JSON.parse(this.item.gallery)
    }
    else {
      this.formDrug.gallery = []
    }
    this.$nextTick(() => {
      this.sortInit()
    })
  },

  methods: {
    ...mapMutations([
      'SHOW_GALLERY_WINDOW'
    ]),
    ...mapActions([
      'updateGallery','getDrugsPageList'
    ]),
    /**
     * *关闭弹窗
     * */
    click_cancel () {
      this.SHOW_GALLERY_WINDOW(false)
    },

    showElementsSelect () {
      this.elementsDialogShow = true
      this.$refs.elementSelector.setFileType('image')
      this.$refs.elementSelector.setShowAlert(false)
    },

    // 文件选中，通过vuex更新
    onFileSelected (files) {
      let selectKeys = []
      this.formDrug.gallery.map( item => {
        selectKeys.push(item.id)
      })
      files.forEach((file, index) => {
        if (selectKeys.indexOf(file.id) == -1) {
          let fileItem = {}
          fileItem.id = file.id
          fileItem.name = file.name
          fileItem.md5 = file.md5
          fileItem.path = file.path
          this.formDrug.gallery.push(fileItem)
        }
      })
      this.sortInit()
    },

    //sortTable 初始化
    sortInit() {
      let el = document.querySelectorAll('.sortDiv')[0]
      let sortable = Sortable.create(el, {
        animation: 150,
        delay: 0,
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: e => {
          let sortData = this.formDrug.gallery
          const item = sortData[e.oldIndex]
          sortData.splice(e.oldIndex, 1)
          sortData.splice(e.newIndex, 0, item)
        }
      })
    },

    removeItem(item) {
      this.formDrug.gallery.forEach((file, index) => {
        if (item.id == file.id) {
          this.formDrug.gallery.splice(index, 1)
        }
      })
      // https://blog.csdn.net/jerryyang_2017/article/details/82466957
      this.$forceUpdate()
    },

    /**
     * * 保存库存
     * */
    submitForm () {
      this.updateGallery(this.formDrug).then(res => {
          this._notify('成功', '操作成功', 'success')
          this.getDrugsPageList({
            page: 1,
            perpage:5
          })
        })
        .catch(e => {
          this._notify('错误', '操作失败，请重试', 'error')
          console.log(e)
        })
    },
    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
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

  .gDiv {
    > div {
      font-size: 13px;
      color: #999;
      //display: inline-block;
    }
    .iconRight {
      float: right;
    }
    .bottom {
      margin-top: 13px;
      line-height: 12px;

    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    
    .clearfix:after {
        clear: both
    }
  }


</style>
