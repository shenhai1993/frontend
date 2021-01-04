<template>
  <div class="clearfix"
    v-if="chiocedTemplate"
    :class="{ verticalContent: chiocedTemplate.width < chiocedTemplate.height}">
        <!-- preview: chiocedTemplate.direction === '1', -->
    <el-row>
      <el-col :span="19">
        <div :class="{ transverseContent: chiocedTemplate.width > chiocedTemplate.height}">
          <template-content :selectItem="chiocedTemplate"
            :canEdit="true"
            v-on:addClicked="onAddClicked"
            :class="{ transversePreview: chiocedTemplate.width > chiocedTemplate.height,
                      verticalPreview: chiocedTemplate.width < chiocedTemplate.height}"
            v-on:elementIndex='vonElementIndex'>
            <!-- 这是给查看播出单弄的网格 -->
            <div slot="terminalGrid" class="terminalGrid" v-if="isplaylistPage">
              <div class="gridRow" :key="row + 'row'"
                v-for="row in (Number(listitem.content.scene.row) - 1)"
                :style="{ top: (100 / Number(listitem.content.scene.row)) * row + '%' }"></div>
              <div class="gridCol" :key="col + 'col'"
                v-for="col in (Number(listitem.content.scene.column) - 1)"
                :style="{ left: (100 / Number(listitem.content.scene.column)) * col + '%' }"></div>
            </div>

          </template-content>
        </div>
        <!-- 横屏 -->
        <div class="footerPreview" v-if="chiocedTemplate.width > chiocedTemplate.height">
            <ul>
              <el-button-group v-if="!isplaylistPage">
                <el-tooltip class="item" effect="dark" content="清空" placement="left">
                  <el-button @click="click_delect('', '', 'all')"
                    type="primary"
                    size="mini"
                    class="clearButton"
                    :disabled="!(showElements && showElements.length)">
                    <i class="fa fa-trash-o"></i>
                  </el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="最前" placement="left">
                  <el-button type="primary" :disabled="!activeElement || !(showElements && showElements.length) || (JSON.stringify(checkElement) === '{}') || (checkElement.index === 0)"
                    size="mini"
                    @click="move('top')">
                    <i class="fa fa-angle-double-up"></i>
                  </el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="前移" placement="left">
                  <el-button type="primary" :disabled="!activeElement || !(showElements && showElements.length) || (JSON.stringify(checkElement) === '{}') || (checkElement.index === 0)"
                    size="mini"
                    @click="move('pre')">
                    <i class="fa fa-angle-up"></i>
                  </el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="后移" placement="left">
                  <el-button type="primary"
                    :disabled="!activeElement || !(showElements && showElements.length) || (JSON.stringify(checkElement) === '{}') || (checkElement.index === (showElements.length - 1))"
                    size="mini"
                    @click="move('next')">
                    <i class="fa fa-angle-down"></i>
                  </el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="最后" placement="left">
                  <el-button type="primary"
                    size="mini"
                    :disabled="!activeElement || !(showElements && showElements.length) || (JSON.stringify(checkElement) === '{}') || (checkElement.index === (showElements.length - 1))"
                    @click="move('bottom')">
                    <i class="fa fa-angle-double-down"></i>
                  </el-button>
                </el-tooltip>
              </el-button-group>
              <li v-for="(list, index) in 6"
                :key="list"
                class="placeholderList"
                :style="{marginLeft: (index * 100 + ((index + 1) * 5)) + 'px'}"
    v-if='selectId && selectedFiles[selectId] && selectedFiles[selectId].length > 6 ? false : true'>
                <div class="material">

                </div>
              </li>
              <li v-for="(list, index) in showElements"
                  :key="index + list.name"
                  @click="click_checkElement(list, index)"
                  :class="{ checkActive: list.selected }">
                <span class="fa fa-times-circle" v-if="!isplaylistPage"
                      @click.stop='click_delect(list, index)'></span>
                <div class="material">
                  <img v-if="list.type === 'image'" :src="list.path" class="image">

                  <audio v-if="list.type === 'audio'">
                    <source :src="list.path" type="audio/mp3">
                    您的浏览器不支持 audio 元素。
                  </audio>

                  <div v-if="list.type === 'video'" style="display: inline-block; max-width: 100%; max-height: 100%; vertical-align: middle;">
                    <img v-if="list.preview_image === undefined" src="data:image/png;base64,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">
                    <video v-else>
                      <source :src="list.path" type="video/mp4">
                      您的浏览器不支持 video 元素。
                    </video>
                  </div>

                  <iframe v-if="list.type === 'link'" :src="list.type"></iframe>
                  <!-- {{ list.name }} -->
                </div>
              </li>
            </ul>
        </div>
        <element-selector :elementsdialogshow.sync='elementsdialogshow'
          v-on:fileSelected="onFileSelected"
          :selectedReginType = 'selectedReginType'>
        </element-selector>
        <!-- 竖屏 -->
        <div class="verticalElementsPreview m-l-10" v-if="chiocedTemplate.width < chiocedTemplate.height">
          <ul class="clearfix">
            <el-button-group v-if="!isplaylistPage">
              <el-tooltip class="item" effect="dark" content="清空" placement="bottom">
                <el-button @click="click_delect('', '', 'all')"
                  type="primary"
                  size="mini"
                  class="clearButton"
                  :disabled="!(showElements && showElements.length)">
                  <i class="fa fa-trash-o"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="最前" placement="bottom">
                <el-button type="primary" :disabled="!activeElement || !(showElements && showElements.length) || (JSON.stringify(checkElement) === '{}') || (checkElement.index === 0)"
                  size="mini"
                  @click="move('top')">
                  <i class="fa fa-angle-double-up"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="前移" placement="bottom">
                <el-button type="primary" :disabled="!activeElement || !(showElements && showElements.length) || (JSON.stringify(checkElement) === '{}') || (checkElement.index === 0)"
                  size="mini"
                  @click="move('pre')">
                  <i class="fa fa-angle-up"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="后移" placement="bottom">
                <el-button type="primary"
                  :disabled="!activeElement || !(showElements && showElements.length) || (JSON.stringify(checkElement) === '{}') || (checkElement.index === (showElements.length - 1))"
                  size="mini"
                  @click="move('next')">
                  <i class="fa fa-angle-down"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="最后" placement="bottom">
                <el-button type="primary"
                    size="mini"
                    :disabled="!activeElement || !(showElements && showElements.length) || (JSON.stringify(checkElement) === '{}') || (checkElement.index === (showElements.length - 1))"
                    @click="move('bottom')">
                  <i class="fa fa-angle-double-down"></i>
                </el-button>
              </el-tooltip>
            </el-button-group>
            <li v-for="(list, index) in 8"
              :key="list"
              class="placeholderList"
              :style="{ left: ((index + 1) % 2) === 0 ? '124px' : 0,
    top: ((index + 1) % 2) === 0 ? ((index + 1) / 2 - 1) * 120 + 30 + 'px' : (((index + 1 + 1) % 2) === 0 ? (((index + 1 + 1) / 2) - 1) * 120 + 30 + 'px' : '')
                      }"
    v-if='selectId && selectedFiles[selectId] && selectedFiles[selectId].length > 8 ? false : true'>
              <div class="material">
              </div>
            </li>
            <li v-for="(list, index) in showElements"
              :key="index + list.name"
              @click="click_checkElement(list, index)"
              :class="{ checkActive: list.selected }">
              <!-- 下面之所以弄这么多class为material的div是因为
                    如果把img video等标签放在"div class='material'"进行判断会有一些莫名其妙的css问题 -->
              <span class="fa fa-times-circle" v-if="!isplaylistPage"
                    @click.stop='click_delect(list, index)'></span>
              <div class="material" v-if="list.type === 'video'">
                <img v-if="list.preview_image === undefined" src="data:image/png;base64,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">
                <video v-else>
                  <source :src="list.path" type="video/mp4">
                  <source :src="list.path" type="video/ogg">
                  <source :src="list.path" type="video/webp">
                  您的浏览器不支持 video 元素。
                </video>
              </div>

              <div class="material" v-if="list.type === 'image'">
                <img :src="list.path" class="image">
              </div>
              <div class="material" v-if="list.type === 'audio'">
                <audio>
                  <source :src="list.path" type="audio/mp3">
                  您的浏览器不支持 audio 元素。
                </audio>
              </div>
              <div class="material" v-if="list.type === 'link'">
                <iframe :src="list.type"></iframe>
              </div>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5" style="padding: 10px;">
        <el-card v-show="/picture/.test(editElement.index)" style="width: 100%; height: 320px; font-size: 14px;">
          <div style="font-size: 12px; margin-bottom: 20px;">图片类型素材支持设置时长</div>
          <div>
            时长：<el-input v-model="editElement.data.seconds" @focus="isInputState(true)" @blur="isInputState(false)" placeholder="请输入时长" size="mini" style="width: 70%;"></el-input>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import templateContent from '@/modules/template/components/Contentmpdp.vue'
import elementSelector from '@/modules/element/lib/addelementsdialog.vue'

export default {
  components: {
    templateContent, elementSelector
  },
  props: ['canNext', 'activeSteps', 'listitem'],
  watch: {
    selectedFiles: {
      handler (v, ov) {
        if (this.activeSteps === 1 || JSON.stringify(this.selectedFiles) === '{}') {
          this.$emit('update:canNext', this.canNextFn())
          this.showElements = this.selectedFiles[this.selectId]
        }
      },
      deep: true
    },
    activeSteps (v, ov) {
      this.$nextTick(() => {
        if (v === 1) {
          if (this.$route.params.id) {
            this.$emit('update:canNext', this.canNextFn())
          }
          if (JSON.stringify(this.selectedFiles) !== '{}') {
            const _selectId = Object.keys(this.selectedFiles)
            //this.showElements = this.selectedFiles[_selectId[0]]
            this.vonElementIndex(_selectId[0], _selectId[0])
            for (let i = 0; i < this.showElements.length; i++) {
              if (this.showElements[i].selected) {
                this.click_checkElement(this.showElements[i], i)
                break
              }
            }
          }
        }
      })
    },
    'editElement.data.seconds' (v, ov) {
      if (this.isInput) {
        if (v === '') {
          return
        } else if (/^\d+$/.test(v) === false) {
          this.$message({
            message: '请输入非负整数！',
            type: 'warning'
          })
          this.editElement.data = Object.assign({}, this.editElement.data, { seconds: ov })
          return
        }
        this.editElementChange()
      }
    }
  },
  data () {
    return {
      showElements: [],
      selectId: '',
      elementsdialogshow: false,
      beingAdded: false,
      selectedReginType: '',
      checkElement: {},
      isplaylistPage: false,
      editElement: {
        index: '',
        i: 0,
        data: {
          seconds: 15
        }
      },
      isInput: false
    }
  },
  computed: {
    ...mapState({
      chiocedTemplate: state => state.mpdp.chiocedTemplate,
      selectedFiles: state => state.mpdp.selectedFiles,
      activeElement: state => state.mpdp.activeElement
    })
  },
  mounted () {
    this.isplaylistPage = this.$route.path.indexOf('playlist/lists') > -1
  },
  methods: {
    ...mapMutations([
      'IS_NEXT_STEP_MPDP',
      'DELETE_MATERIAL_MPDP',
      'ADD_SELECTED_ELEMENT_MPDP',
      'EDIT_IMAGE_ELEMENT_MPDP',
      'PUT_CHECK_ELEMENT_MPDP',
      'ADJUST_SELECTED_ELEMENT_ORDER_MPDP',
      'SET_RECUT_STATE'
    ]),
    ...mapActions([
      'mpdpChangeOrder'
    ]),
    canNextFn () {
      // 筛选出没有添加素材的区域，并抛出其类型
      let self = this
      // let _index
      let isempty = self.chiocedTemplate.data.some((ele, index) => {
        if (ele.type === 'date' || ele.type === 'time') return
        // _index = index
        return !self.selectedFiles[ele.id] || !self.selectedFiles[ele.id].length
      })
      if (isempty) {
        // let materialType
        // switch (self.chiocedTemplate.data[_index].type) {
        //   case 'picture':
        //     materialType = '图片'
        //     break
        //   case 'video':
        //     materialType = '视频'
        //     break
        // }
        // console.log(self.chiocedTemplate.data[_index].type === 'picture')
        // console.log(materialType)
        // Notification({
        //   type: 'warning',
        //   title: `请选择${materialType}素材`
        // })
        return false
      } else {
        return true
      }
    },
    vonElementIndex (id, type) {
      this.selectId = id
      this.showElements = this.selectedFiles[id]
      this.selectedReginType = type
    },
    onAddClicked () {
      this.elementsdialogshow = true
    },
    // 文件选中，通过vuex更新
    onFileSelected (files) {
      let obj = {}
      let filesData = JSON.parse(JSON.stringify(files))
      for (let i = 0; i < filesData.length; i++) {
        if (/video/.test(this.selectId)) {
          const path = filesData[i].path.split('.')
          const type = path[path.length - 1]
          const state = type === 'ts' || type === 'TS' || type === 'mkv' || type === 'MKV' || type === 'mov' || type === 'MOV' || type === 'flv' || type === 'FLV' || type === 'mp4' || type === 'MP4'
          if (!state) {
            this.$message({
              message: '包含不支持的文件格式，请确认并重选！仅支持 ts、mkv、mov、flv、mp4格式',
              type: 'warning'
            })
            return false
          }
        } else if (/picture/.test(this.selectId)) {
          filesData[i].seconds = 15
        }
      }
      obj.index = this.selectId
      obj.data = filesData
      console.log('obj: ', obj)
      this.ADD_SELECTED_ELEMENT_MPDP(obj)
    },
    click_delect (item, index, isall) {
      let obj = {}
      obj.key = this.selectId
      obj.index = index
      obj.all = isall
      this.DELETE_MATERIAL_MPDP(obj)
      this.$emit('update:canNext', this.canNextFn())
    },
    click_checkElement (item, index) {
      this.checkElement.id = this.selectId
      this.checkElement.path = item.path
      this.checkElement.index = index
      this.PUT_CHECK_ELEMENT_MPDP(this.checkElement)
      const data = {
        index: this.selectId,
        i: index,
        data: JSON.parse(JSON.stringify(item))
      }
      this.editElement = Object.assign({}, this.editElement, data)
      this.SET_RECUT_STATE(1)
    },
    editElementChange () {
      this.EDIT_IMAGE_ELEMENT_MPDP(this.editElement)
      this.click_checkElement(this.editElement.data, this.editElement.i)
      this.SET_RECUT_STATE(1)
    },
    isInputState (val) {
      this.isInput = val
    },
    // 上移下移的方法
    move (direction) {
      let me = this
      me.checkElement.direction = direction
      // me.ADJUST_SELECTED_ELEMENT_ORDER_MPDP
      me.mpdpChangeOrder(me.checkElement)
        .then(res => {
          me.showElements = []
          me.showElements = res
          switch (direction) {
            case 'top':
              this.checkElement.index = 0
              break
            case 'pre':
              this.checkElement.index--
              break
            case 'next':
              this.checkElement.index++
              break
            case 'bottom':
              this.checkElement.index = me.showElements.length - 1
              break
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .transversePreview {
    margin: 0 auto;
    width: 683px;
  }
  .verticalContent {
    width: 100%;
    .verticalPreview {
      position: absolute;
    }
  }
  .transverseContent {
    max-height: 390px;
    overflow-y: auto;
  }
  .preview {
    margin: 0 auto;
    width: 660px;
    > div {
      float: left;
    }
  }
  // 横屏样式
  .footerPreview {
    position: relative;
    height: 132px;
    width: 683px;
    margin: 0 auto;
    margin-top: 15px;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
    .el-button-group {
      vertical-align: top;
      position: sticky;
      z-index: 3;
      left: 0;
      .el-button {
        position: initial;
        display: block;
        float: none;
        border: 0;
        border-radius: 0;
        padding-top: 4px;
        padding-bottom: 5px;
        &:nth-child(1) {
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          border-bottom: 1px solid hsla(0,0%,100%,.5);
        }
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          border-bottom: 1px solid hsla(0, 0%, 100%, .5)!important;
        }
        &:nth-child(5) {
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
        }
        i {
          display: inline-block;
          width: 9px;
          height: 12px;
        }
      }
    }
    ul {
      height: 132px;
      width: 683px;
      border: 1px solid #F2F6FC;
      margin: 0 auto;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      position: relative;
      padding: 10px 10px 10px 10px;
      li {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-align: center;
        position: relative;
        z-index: 2;
        background-color: white;
        .fa-times-circle {
          position: absolute;
          right: 10px;
          top: 10px;
          display: none;
          z-index: 10;
        }
        &:hover {
          .fa-times-circle {
            display: inline;
          }
        }
        &.placeholderList {
          position: absolute;
          z-index: 1;
          background-color: #E6EBF5;
        }
        & + li {
          margin-left: 5px;
        }
        .material {
          height: 110px;
          &.active {
            border-color: #66b0ff;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.2);
          }
        }
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
  // 竖屏样式
  .verticalElementsPreview {
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
    width: 260px;
    border: 1px solid #F2F6FC;
    height: 546.4px;
    padding: 5px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    left: 400px;
    .delectAll {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
    }
    .el-button-group {
      width: calc(100% - 2px);
      padding-left: 5px;
      position: sticky;
      top: 0;
      z-index: 3;
      .el-button {
        position: initial;
      }
      .el-button--mini {
        width: 20%;
      }
    }
    ul {
      position: relative;
      li {
        float: left;
        width: 50%;
        padding: 5px;
        overflow: hidden;
        text-align: center;
        .fa-times-circle {
          position: absolute;
          right: 10px;
          top: 10px;
          display: none;
          z-index: 10;
        }
        &:not(.placeholderList) {
          position: relative;
          z-index: 2;
          background-color: white;
          &:hover {
            .fa-times-circle {
              display: inline;
            }
          }
        }
        &.placeholderList {
          position: absolute;
          z-index: 1;
          .material {
            background-color: #E6EBF5;
          }
        }
        .material {
          height: 115px;
          &.active {
            border-color: #66b0ff;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.2);
          }
        }
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
  // .clearButton {
  //   width: 100%;
  // }
  .transverseClearButton {
    // height: 100%;
    width: 35px;
    padding: 0;
    vertical-align: top;
  }
  li.checkActive {
    .material {
      border-color: #66b0ff;
    }
  }
  .el-button-group {
    .el-button--mini {
      padding: 7px 10px;
    }
  }
  .terminalGrid {
    height: 100%;
    // border: 8px solid red;
    .gridRow {
      position: absolute;
      border-bottom: 12px solid red;
      width: 100%;
      z-index: 100;
    }
    .gridCol {
      position: absolute;
      border-right: 12px solid red;
      height: 100%;
      z-index: 100;
    }
  }
</style>
