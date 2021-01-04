<template>
  <div  class="clearfix playlist-preview">
    <el-row :gutter="10" type="flex">
      <el-col class="w150 no-shrink">
        <el-card class="tpls-wrapper">
          <div @click="setActiveTpl(item,index)" :class="['tpl-item',{active: index === activeTplIndex}]" v-for="(item, index) in playlist" :key="index">
            <div class="img-wrapper">
              <img :src="item.tpl.thumb_path" v-if="item.ctype===0" :class="[item.direction === 0?'imgH':'imgV']" alt="">
              <img :src="item.h5template.thumb_path" v-if="item.ctype===1" :class="[item.direction === 0?'imgH':'imgV']" alt="">
            </div>
            <span>{{item.name}}</span>
          </div>
        </el-card>
      </el-col>
      <el-col  class="tpl-wrapper">
        <el-card v-show="activeTplIndex === -1" class="no-active-tpl">
          <span class="no-active-tpl-span">请选择模板</span>
        </el-card>
        <div v-show="activeTplIndex !== -1" class="tplcanvas" id="tplcanvas">
          <img :src="activeH5Tpl.h5template.thumb_path"  v-if="activeH5Tpl.ctype===1" alt=""  style="display: block;max-width:100%;max-height:384px;margin: 0 auto;">
          <tpl-content tplCanvas="#tplcanvas"
                       @setActiveRegion="setActiveRegion"
                       :tpl="activeTpl"
                       v-else
                       :regionFiles="activeFiles"></tpl-content>
        </div>
      </el-col>
    </el-row>
    <!-- 文件列表 -->
    <div class="footerPreview" >
      <ul ref="scrollX" class="files-wrapper">
        <div class="file-type-wrapper" v-if="activeRegion.type === 'image'">
          <li class="file-wrapper" @click="setActiveFile(file, index)" v-for="(file, index) in activeRegion.files"
              :key="index">
            <el-tooltip effect="dark" :content="file.name" placement="bottom">
              <div>
                <img :src="file.path" class="image file">
                <div class="file-name">{{ file.name }}</div>
              </div>
            </el-tooltip>
          </li>
        </div>
        <div class="file-type-wrapper" v-if="activeRegion.type === 'video'">
          <li class="file-wrapper" @click="setActiveFile(file, index)" v-for="(file, index) in activeRegion.files"
              :key="index">
            <el-tooltip effect="dark" :content="file.name" placement="bottom">
              <div>
                <!--<video class="video file">
                  <source :src="file.path" >
                </video>-->
                <img v-if=" file.preview_image ===undefined" src="data:image/png;base64,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" class="image file">
                <img v-if=" file.preview_image !==undefined" :src="file.preview_image" class="image file">
                <div class="file-name">{{ file.name }}</div>
              </div>
            </el-tooltip>
          </li>
        </div>
        <div class="file-type-wrapper" v-if="activeRegion.type === 'webpage'">
          <li @click="setActiveFile(file, index)" class="file-wrapper" v-for="(file, index) in activeRegion.files" :key="index">
            <el-tooltip effect="dark" :content="file.name" placement="bottom">
              <!--<div class="webpage file"  >{{ file.name }}</div>-->
              <div>
                <img src="data:image/png;base64,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" class="image file">
                <div class="file-name"  >{{ file.name }}</div>
              </div>
            </el-tooltip>
          </li>
        </div>
        <!-- placeholder -->
        <li v-if="placeholder !== 0" v-for="(list, index) in placeholder"
            :key="index" class="file-wrapper v-a-t"
        >
          <div class="placeholder">placeholder</div>
        </li>
      </ul>
    </div>
  </div>

</template>
<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import TemplateContent from '@/modules/template/components/Content.vue'
  // import SelectedFiles from './selectedFiles'
  import NewTplContent from '@/modules/tpl/components/Editor'
  import BorderBox from '@/components/BorderBox'
  import tplContent from './tplContent'

  export default {
    components: {
      NewTplContent, BorderBox, tplContent
    },

    props: {
      playlist: {
        type: Array,
        default: []
      }
    },

    data () {
      return {
        destroy: false,
        baseUrl: process.env.STORAGE_BASE,
        activeTpl: {},
        activeTplIndex: 0,
        activeH5Tpl: {},
        activeRegion: {},
        activeFiles: []
      }
    },
    computed: {
      placeholder () {
        let count = 6
        if (JSON.stringify(this.activeRegion) !== '{}' && this.activeRegion.files !== undefined) {
          count -= this.activeRegion.files.length
        }
        if (count < 0) {
          count = 0
        }
        return count
      }
    },
    methods: {
      setActiveTpl (tpl, index) {
        if (this.activeTplIndex === index) {
          return
        }
        this.activeH5Tpl = tpl
        this.activeTpl = tpl.tpl
        this.activeTplIndex = index
        this.activeRegion =  (tpl.tpl.regions!==undefined)?tpl.tpl.regions[0]: {}
        this.activeFiles = []
        // this.activeFiles = tpl.tpl.regions
        if (tpl.tpl.regions!==undefined){
          tpl.tpl.regions.forEach(region => {
            if (region.files) {
              this.activeFiles.push(region.files[0])
            } else {
              this.activeFiles.push('')
            }
          })
        }
      },

      setActiveRegion (region) {
        this.activeRegion = region
      },

      setActiveFile (file, index) {
        this.$set(this.activeFiles, this.activeRegion.id, file)
      },

      _initRegionFiles () {
          this.activeH5Tpl = this.playlist[0]
          this.activeTpl = this.playlist[0].tpl
          this.activeTplIndex = 0
          if (this.activeTpl.regions) {
            this.activeRegion = this.activeTpl.regions[0]
            this.activeFiles = []
            this.activeTpl.regions.forEach(region => {
              if (region.files) {
                this.activeFiles.push(region.files[0])
              } else {
                this.activeFiles.push('')
              }
            })
          }
      },

      scrollX () {
        let dom = this.$refs.scrollX

        dom.onmouseover = () => {
          dom.addEventListener('mousewheel',handler, false)
        }

        function handler(e){
          var detail = e.wheelDelta || e.detail
          var step = 0
          if(detail > 0){
            step = -1 * 100
          }else{
            step = 1 * 100
          }
          dom.scrollLeft += step
          e.stopPropagation()
          e.preventDefault()
        }
      }
    },

    watch: {
      playlist: {
        handler (n) {
          this.activeRegion = {}
          this._initRegionFiles()
        }
      }
    },

    mounted () {
      this.$nextTick(() => {
        this.scrollX()
        this.activeTplIndex = 0
        this.activeRegion = {}
        this.activeFiles = []
      })
    }
  }
</script>
<style lang="scss">
  .playlist-preview{
    padding: 10px;
    .el-row{
      align-items: stretch;
      .el-card{
        height: 350px;
        overflow: auto;
        .el-card__body{
          padding: 16px;
        }
        .tpl-item{
          width: 100%;
          border-bottom: 1px solid #ebeef5;
          margin-bottom: 14px;
          text-align: center;
          cursor: pointer;
          .img-wrapper{
            display: table-cell;
            width: 102px;
            height: 102px;
            vertical-align: middle;
            text-align: center;
            background-color: #f1f4f5;
            .imgH{
              width: 100%;
            }
            .imgV{
              height: 100%;
            }
          }
        }
        .active{
          border: 2px solid;
          border-radius: 4px;
          color: rgba(64, 160, 255, 0.877);
          border-color: #c6e2ff;
          background-color: #ecf5ff;
        }
      }
    }
    .no-shrink{
      flex-shrink: 0
    }
    .w330{
      width: 330px;
    }
    .w150{
      width: 150px;
    }
    .tpl-wrapper{
      overflow: auto;
    }
    .no-active-tpl{
      height: 560px;
      text-align: center;
      padding-top: 30px;
      .no-active-tpl-span{
        font-size: 20px;
      }
    }
    .sf{
      height: 100%;
    }
    .tpl-content{
      .el-card__body{
        height: 526px;
        overflow-y: auto;
      }
    }
    .footerPreview {
      position: relative;
      overflow: auto;
      margin: 0 auto;
      margin-top: 15px;
      box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
      .files-wrapper {
        height: 156px;
        padding: 10px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        text-align: center;
      }
      .file-wrapper {
        display: inline-block;
        width: 108px;
        height: 108px;
        margin-right: 10px;
        padding: 4px;
        background-color: #e6ebf5;
      }
    }
    .file-type-wrapper {
      display: inline-block;
    }
    .file {
      width: 100px;
      height: 100px;
      cursor: pointer;
    }
    .webpage {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }
    .file-name {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .placeholder {
      visibility: hidden;
    }
    .v-a-t {
      vertical-align: top;
    }
  }
</style>
