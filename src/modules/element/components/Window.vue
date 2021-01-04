<template>
  <div :class="{ displayBlock: showUploadWindow, contractHeight: !showUploadWindow }">
    <div class="dialog-header">
      <h3>
        <span class="dialog-header-title ellipsis">
          <em class="select-text">{{ title }}</em>
          <!-- <em v-if="showProgress" class="select-text">({{ uploadProgress }})</em> -->
        </span>
      </h3>
      <div class="dialog-control">
        <span v-if="!showUploadWindow" class="fa fa-window-maximize" @click="show()" title='显示窗口'></span>
        <span v-if="showUploadWindow" class="fa fa-window-minimize" @click="hide()" title='缩小窗口'></span>
      </div>
    </div>
    <upload-dialog v-on:fileuploaded='fileuploaded'
                   v-on:uploadProgress='fileProgress'>
    </upload-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import uploadDialog from './UploadDialog.vue'

export default {
  components: {
    uploadDialog
  },

  data () {
    return {
      title: '上传列表',
      uploadProgress: ''
    }
  },

  computed: {
    ...mapState({
      uploadFiles: state => state.element.uploadFiles,
      showUploadWindow: state => state.element.showUploadWindow
    })
  },

  methods: {
    ...mapMutations([
      'SHOW_UPLOAD_WINDOW'
    ]),

    fileuploaded (data) {
      this.$emit('fileuploaded', data)
    },

    fileProgress (data) {
      this.uploadProgress = data
    },

    show () {
      this.SHOW_UPLOAD_WINDOW(true)
    },

    hide () {
      this.SHOW_UPLOAD_WINDOW(false)
    }
  }
}
</script>

<style lang='sass' scoped>
  .dialog-header h3
    height: 44px;
    line-height: 44px;
    color: #424e67;
    position: relative;
    display: block;
    text-indent: 1em;
    font-size: 14px;
    font-weight: 700;
    .dialog-header-title
      display: block;
      margin-right: 50px;
      .select-text
        -webkit-user-select: initial;
        -khtml-user-select: initial;
        -moz-user-select: initial;
        -ms-user-select: initial;
        -o-user-select: initial;
        user-select: initial;
        font-style: normal;
        cursor: text;

  .dialog-control
    top: 13px;
    right: 12px;
    position: absolute;
    height: 20px;
    span
      display: inline-block;
      font-size: 16px;
      color: #607194;
      line-height: 20px;
      text-align: center;
      margin: 0 6px;
      cursor: pointer;
      float: right;

  .displayNone
    display: none;

  .displayBlock
    display: block;
  .uploadDialog
    width: 635px;
    height: 430px;

  .contractHeight
    height: 50px!important;

  .contract-enter-active
  .contract-leave-active
    transition-property: bottom;
    transition-duration: 2s;
    transition-timing-function: linear;
  .contract-enter
  .contract-leave-to
    bottom: 50px;
</style>
