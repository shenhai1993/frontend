<template>
  <div class="tpl-preview-content" :style="tplStyle">
    <div class="tpl-wrapper"
      :style="tplStyle">
      <div v-for="(region, index) in tpl.regions" :key="index">
        <region :index="index" :rate="rate" @setActiveRegion="setActiveRegion" :region="region">
          <div slot="view">
            <img class="view-img" :style="regionStyle(region)" v-if="showType(index, 'image', region)" :src="getPath(index)" alt="">

            <!--<video controls :style="regionStyle(region)" class="view-video" v-if="showType(index, 'video', region) && !videoRefresh">
              <source :src="getPath(index)" type="video/mp4">
              您的浏览器不支持 video 元素。
            </video>-->
            <flv-video :flvSrc="getPath(index)" :style="regionStyle(region)" class="view-video" v-if="showType(index, 'video', region) && !videoRefresh"></flv-video>
            <iframe frameborder=0 :style="regionStyle(region)" v-if="showType(index, 'webpage', region)" :src="getPath(index)"></iframe>

            <div v-if="showType(index, 'source', region)">{{ regionFiles.name }}</div>
            <div v-if="region.type==='text'" :style="regionStyle(region)" style="color: #ffffff;background: #b8aebe">{{region.text}}</div>
          </div>
        </region>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import FlvVideo from '../../element/components/flvVideo'
import region from './region'
import { getZoomRate } from '@/modules/tpl/lib/utils.js'

export default {
  components: {
    region, FlvVideo
  },

  props: {
    tpl: {
      type: Object,
      required: true
    },

    regionFiles: {
      type: Array
    },

    tplCanvas: {
      type: String
    }
  },

  data () {
    return {
      rate: 1,
      videoRefresh: false
    }
  },

  computed: {
    tplStyle () {
      let style = {}
      let tpl = this.tpl
      let rate = this.rate
      style.width = tpl.width * rate + 'px'
      style.height = tpl.height * rate + 'px'
      return style
    }

  },

  methods: {
    setActiveRegion (region) {
      this.$emit('setActiveRegion', region)
    },

    getPath (index) {
      let path = ''
      if (this.regionFiles[index].type ==='video'){
        path = this.regionFiles[index].preview_video
      } else {
        path = this.regionFiles[index].path
      }

      // path = path.path
      return path
    },

    showType (index, type, region) {
      return this.regionFiles[index] && region.type === type
    },

     regionStyle (region) {
      let style = {}
      let r = region
      let rate = this.rate
      style.width = r.width * rate + 'px'
      style.height = r.height * rate + 'px'
      return style
    }
  },

  watch: {
    tpl: {
      handler () {
        this.rate = getZoomRate($(this.tplCanvas), this.tpl.direction)
        if (this.tpl.direction === 1) {
          this.rate -= 0.1
        }
      },
      // deep: true
      immediate: true
    },

    regionFiles: {
      handler () {
        this.videoRefresh = true
        this.$nextTick(() => {
          this.videoRefresh = false
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.tpl-preview-content {
  margin: 0 auto;
  background-color: #999999;
  .view-img {
    width: 100%;
  }
  .view-video {
    width: 100%;
  }
}
</style>
