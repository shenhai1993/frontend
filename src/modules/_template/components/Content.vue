<!--
  author: wangwei(w.w@tcl.com)  2017-11-13
  desc: 内容制作控制
  使用方法：
-->
<template>
  <div v-if="selectItem" class="template" ref="preview"
    :style="{ width: selectItem.width + 'px', height: selectItem.height + 'px', zoom: zoom}">
      <div class="background" :style="{backgroundImage: 'url(' + selectItem.bg_img_path + ')' }">
      </div>
      <slot name="terminalGrid"></slot>
      <div v-for='data in selectItem.data' :key="data.id">
        <region :key="data.id"
                :item="data"
                class="regionContent"
                :can-select="canEdit"
                :class="{mpdpStyle: ismpdpPage}">
          <!-- {{ data.type }} -->
          <i v-if="data.type === icon.type && canEdit"
              v-for="(icon, index) in elementsIcon" class="i_type"
              :class="icon.icon" :key="index"
              @click="onAddClicked">
            <i class="fa fa-plus-circle"></i>
          </i>
          <div class='materialContent' v-if="data.type === 'video' && (selectedFiles[data.id] && selectedFiles[data.id].length)">
            <video class='materialPlaylist' object-fit="fill">
              <!-- <source :src="selectedFiles[data.id][0].path" type="video/mp4"> -->
              <source :src="checkOverElement[data.id]" type="video/mp4">
              您的浏览器不支持 video 元素。
            </video>
          </div>
          <div class='materialContent'
               style="width:100%;height: 100%;" v-if="data.type === 'picture' && (selectedFiles[data.id] && selectedFiles[data.id].length)">
            <!-- <img class='materialPlaylist' :src="selectedFiles[data.id][0].path">checkOverFile -->
            <img class='materialPlaylist' :src="checkOverElement[data.id]">
          </div>
        </region>
      </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import region from '../components/Region.vue'

export default {
  props: {
    canEdit: {
      type: Boolean,
      default: false
    },
    selectItem: {
      type: Object
    }
  },
  components: {
    region
  },
  data () {
    return {
      searchQuery: '',
      items: [],
      elementsIcon: [
        {icon: 'el-icon-picture', type: 'picture'},
        {icon: 'el-icon-caret-right', type: 'video'},
        {icon: 'el-icon-service', type: 'audio'},
        {icon: 'el-icon-share', type: 'link'}
      ],
      ismpdpPage: false
    }
  },
  watch: {
    current_region (v, ov) {
      this.$emit('elementIndex', v.id, v.type)
    },
    selectItem () {
      this.autoZoom()
    }
  },
  computed: {
    ...mapState({
      zoom: state => state.template.zoom,
      current_region: state => state.template.current_region,
      selectedFiles: state => state.playlist.selectedFiles,
      checkOverElement: state => state.playlist.checkOverElement
    })
  },
  mounted () {
    let me = this
    me.autoZoom()
    me.ismpdpPage = this.$route.path.indexOf('/mpdp/playlist') > -1
  },
  methods: {
    ...mapActions([
      'storeAutoZoom'
    ]),
    ...mapMutations([
      'SET_ZOOM'
    ]),
    autoZoom () {
      if (!this.$el.isConnected || !this.selectItem) {
        return
      }
      let zoom = 1
      if (this.selectItem.width > this.selectItem.height) {
        let wz = 683 / this.selectItem.width
        let hz = 390 / this.selectItem.height
        zoom = wz > hz ? hz : wz
      } else {
        let wz = 338 / this.selectItem.width
        let hz = 548 / this.selectItem.height
        zoom = wz > hz ? hz : wz
        // 竖的
      }
      this.SET_ZOOM(zoom)
    },
    onAddClicked () {
      this.$emit('addClicked')
    }
  }
}
</script>
<style lang="scss" scoped>
  .content {
    border: 6px solid black;
    overflow: hidden;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
  }
  .item {
    display: inline-block;
    border: 1px solid #cecece;
    width: 400px;
  }
  .template {
    position: relative;
    background-color: rgb(96, 125, 139);
  }
  .background {
    width: 100%;
    height: 100%;
    border:1px solid #aaa;
    position:absolute;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-origin: border-box;
  }
  .regionContent {
    .materialContent {
      width: 100%;
      height: 100%;
      .materialPlaylist {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    .i_type {
      font-size: 90px;
      position: absolute;
      top: 50%;
      margin-top: -45px;
      left: 50%;
      margin-left: -45px;
      text-transform: uppercase;
      z-index: 100;
      // text-shadow: -2px 2px 6px #000;
      &:hover {
        > i {
          color: #DFE4ED;
        }
      }
      > i {
        font-size: 40px;
        position: absolute;
        top: 50%;
        margin-top: -55px;
        left: 50%;
        margin-left: -55px;
        color: #000;
      }
    }
  }
  // .mpdpStyle {
  //   .i_type {
  //     font-size: 800px!important;
  //     margin-top: -400px!important;
  //     margin-left: -400px!important;
  //     i {
  //       font-size: 500px!important;
  //       margin-top: -550px!important;
  //       margin-left: -550px!important;
  //     }
  //   }
  // }
</style>
