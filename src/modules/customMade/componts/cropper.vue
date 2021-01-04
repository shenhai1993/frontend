<!--
    option: {
    img: '', // 裁剪图片的地址
    info: true, // 裁剪框的大小信息
    outputSize: 0.8, // 裁剪生成图片的质量
    outputType: 'jpeg', // 裁剪生成图片的格式
    canScale: false, // 图片是否允许滚轮缩放
    autoCrop: true, // 是否默认生成截图框
    // autoCropWidth: 300, // 默认生成截图框宽度
    // autoCropHeight: 200, // 默认生成截图框高度
    fixedBox: true, // 固定截图框大小 不允许改变
    fixed: true, // 是否开启截图框宽高固定比例
    fixedNumber: [7, 5], // 截图框的宽高比例
    full: true, // 是否输出原图比例的截图
    canMoveBox: false, // 截图框能否拖动
    original: false, // 上传图片按照原始比例渲染
    centerBox: false, // 截图框是否被限制在图片里面
    infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    },
-->
<template>
  <div class="cropper" style="text-align:center;height: 450px">
    <vue-cropper
      ref="cropper"
      :img="optionData.url"
      :autoCropWidth="optionData.width"
      :autoCropHeight="optionData.height"
      :outputSize="option.size"
      :outputType="optionData.outputType"
      :info="false"
      :full="option.full"
      :canMove="option.canMove"
      :canMoveBox="option.canMoveBox"
      :original="option.original"
      :autoCrop="option.autoCrop"
      :fixed="option.fixed"
      :fixedNumber="optionData.fixedNumber"
      :centerBox="option.centerBox"
      :infoTrue="option.infoTrue"
      :fixedBox="option.fixedBox"
      @realTime="realTime"
    ></vue-cropper>
  </div>
</template>

<script>
    import{ VueCropper } from 'vue-cropper'
    export default {
      props:{
        dialogVisible: {
          type: Boolean,
          default: false
        },
        optionData:{
          type: Object,
          default: {}
        }
      },
      components:{
        VueCropper
      },
      data() {
        return {
          // 裁剪组件的基础配置option
          option: {
            img: '', // 裁剪图片的地址
            info: false, // 裁剪框的大小信息
            outputSize: 0.8, // 裁剪生成图片的质量
            outputType: 'base64', // 裁剪生成图片的格式
            canScale: false, // 图片是否允许滚轮缩放
            autoCrop: true, // 是否默认生成截图框
            // autoCropWidth: 300, // 默认生成截图框宽度
            // autoCropHeight: 200, // 默认生成截图框高度
            fixedBox: true, // 固定截图框大小 不允许改变
            fixed: true, // 是否开启截图框宽高固定比例
            fixedNumber: [1, 1], // 截图框的宽高比例
            full: true, // 是否输出原图比例的截图
            canMoveBox: false, // 截图框能否拖动
            original: false, // 上传图片按照原始比例渲染
            centerBox: false, // 截图框是否被限制在图片里面
            infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
          },
          picsList: [],  //页面显示的数组
          // 防止重复提交
          loading: false
        }
      },
      methods:{
        finish(){
          this.$refs.cropper.getCropData((data) => {
           // let imgData = window.URL.createObjectURL(data)
            let file = this.dataURLtoFile(data)
            console.log(typeof file)
            this.$emit('cropperData', file)
          })
        },
        dataURLtoFile (dataurl) {
          let arr = dataurl.split(',')
          let mime = arr[0].match(/:(.*?);/)[1]
          let bstr = atob(arr[1])
          let n = bstr.length
          let u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new File([u8arr], this.optionData.name, { type: mime })
        },
        realTime(){}
      }
    }
</script>

<style lang="scss">
  .cropper {
    width: auto;
  }
</style>
