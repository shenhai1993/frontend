<template>
  <div class="clearfix" v-if="chiocedTemplate" :class="{preview: chiocedTemplate.direction === 1}">

    <template-content :selectItem="chiocedTemplate"
                      :canEdit="true"
                      v-on:addClicked="onAddClicked"
                      :class="{ transversePreview: chiocedTemplate.direction === 0,
                                verticalPreview: chiocedTemplate.direction === 1}"
                      v-on:elementIndex='vonElementIndex'>
    </template-content>
    <div class="footerPreview" v-if="chiocedTemplate.direction === 0">
        <ul>
          <el-button-group>
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
            <span class="fa fa-times-circle"
                  @click.stop='click_delect(list, index)'></span>
            <div class="material">
              <img v-if="list.type === 'image'" :src="list.path" class="image">

              <audio v-if="list.type === 'audio'">
                <source :src="list.path" type="audio/mp3">
                您的浏览器不支持 audio 元素。
              </audio>
              <video v-if="list.type === 'video'">
                <source :src="list.path" type="video/mp4">
                您的浏览器不支持 video 元素。
              </video>

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
    <div class="verticalElementsPreview m-l-10" v-if="chiocedTemplate.direction === 1">
        <ul class="clearfix">
          <el-button-group>
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
            <span class="fa fa-times-circle"  @click.stop='click_delect(list, index)'></span>
            <div class="material" v-if="list.type === 'video'">
              <video>
                <source :src="list.path" type="video/mp4">
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
  </div>

</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import templateContent from '@/modules/template/components/Content.vue'
import elementSelector from '@/modules/element/lib/addelementsdialog.vue'

export default {
  components: {
    templateContent, elementSelector
  },
  props: ['canNext', 'activeSteps'],
  watch: {
    selectedFiles: {
      handler (v, ov) {
        console.log('watch')
        if (this.activeSteps === 1 || JSON.stringify(this.selectedFiles) === '{}') {
          this.$emit('update:canNext', this.canNextFn())
          this.showElements = this.selectedFiles[this.selectId]
        }
      },
      deep: true
    },
    activeSteps (v, ov) {
      if (v === 1) {
        if (this.$route.params.id) {
          this.$emit('update:canNext', this.canNextFn())
        }
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
      checkElement: {}
    }
  },
  computed: {
    ...mapState({
      chiocedTemplate: state => state.playlist.chiocedTemplate,
      selectedFiles: state => state.playlist.selectedFiles,
      checkOverElement: state => state.playlist.checkOverElement,
      activeElement: state => state.playlist.activeElement
    })
  },
  methods: {
    ...mapMutations([
      'IS_NEXT_STEP',
      'DELETE_MATERIAL',
      'ADD_SELECTED_ELEMENT',
      'PUT_CHECK_ELEMENT',
      'ADJUST_SELECTED_ELEMENT_ORDER'
    ]),
    ...mapActions([
      'changeOrder'
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
      obj.index = this.selectId
      obj.data = files
      this.ADD_SELECTED_ELEMENT(obj)
    },
    click_delect (item, index, isall) {
      let obj = {}
      obj.key = this.selectId
      obj.index = index
      obj.all = isall
      this.DELETE_MATERIAL(obj)
      this.$emit('update:canNext', this.canNextFn())
    },
    click_checkElement (item, index) {
      this.checkElement.id = this.selectId
      this.checkElement.path = item.path
      this.checkElement.index = index
      this.PUT_CHECK_ELEMENT(this.checkElement)
    },
    // 上移下移的方法
    move (direction) {
      let me = this
      me.checkElement.direction = direction
      // me.ADJUST_SELECTED_ELEMENT_ORDER
      me.changeOrder(me.checkElement)
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
    float: right;
    width: 260px;
    border: 1px solid #F2F6FC;
    height: 546.4px;
    padding: 5px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
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
</style>
