<template>
  <aside class="submenu" style="padding: 15px;border-right: 1px solid #d0e0f2">
      <div class="subelement">
        <folder-panel v-on:onclick="folder_onclick" v-bind:edit="true" v-bind:filter="true"></folder-panel>
      </div>
      <div class="subelement fileSizeBox">
        <file-size :width="260" :allSize="allSize" :oneSize="oneSize" :percentage="percent"></file-size>
      </div>
  </aside>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import FileSize from './FileSize'
import FolderPanel from './folder/folder'

export default {
  mounted () {
    // let type = this.$route.path.split("/")[2]
    // this.SET_FILETYPE(type)
  },

  components: {
    FileSize, FolderPanel
  },

  data () {
    return {
      allCount: 0,
      imageCount: 0,
      videoCount: 0,
      streamCount: 0,
      webpageCount: 0,
      auditCount: 0,
      allSize: null,
      oneSize: null,
      percent: 0
    }
  },

  computed: {
    defaultMenu: function () {
      return this.$route.path.split('/')[2]
    },

    ...mapState({
      fileType: state => state.element.fileType,
      fileList: state => state.element.fileList
    })
  },

  watch: {
    'fileList': function (n, o) {
      this.filter()
    }
  },

  methods: {
    ...mapMutations([
      'SET_FILETYPE', 'SET_DIRECTORY_ID'
    ]),

    conver (limit) {
      let size = ''
      if ( limit < 0.1 * 1024 ) { //如果小于0.1KB转化成B
          size = limit.toFixed(2) + 'B'
      } else if (limit < 0.1 * 1024 * 1024 ) {//如果小于0.1MB转化成KB
          size = (limit / 1024).toFixed(2) + 'KB'
      } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
          size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
      } else { //其他转化成GB
          size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      let sizestr = size + ''
      let len = sizestr.indexOf('\.')
      let dec = sizestr.substr(len + 1, 2)
      if (dec == '') {//当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
      }
      return sizestr
    },

    folder_onclick (node) {
      this.SET_DIRECTORY_ID(node.node.id)
      this.$router.push({path: `/elements/directory/${node.node.id}`})
      this.percent = (node.node.length_byte / node.data[0].length_byte).toFixed(2) * 100
      this.allSize = this.conver(node.data[0].length_byte)
      this.oneSize = this.conver(node.node.length_byte)
    },

    filter () {
      // 0 未审核, 1 审核通过
      this.allCount = this.fileList.length || 0
      this.imageCount = this.fileList.filter(file => file.type === 'image').length || 0
      this.videoCount = this.fileList.filter(file => file.type === 'video').length || 0
      this.streamCount = this.fileList.filter(file => file.type === 'stream').length || 0
      this.webpageCount = this.fileList.filter(file => file.type === 'webpage').length || 0

      // this.auditCount = this.fileList.filter(file => file.audit_status === 1).length || 0
    }
  }
}
</script>

<style lang="scss" scoped>
.fa-link{
  margin-right: 10px;
  font-size: 18px;
}

.submenu {
  position: relative;
  .subelement {
    border: none;
    box-shadow: none;
  }
  .fileSizeBox {
    position: absolute;
    height: auto;
    width: 92%;
  }
}
</style>
