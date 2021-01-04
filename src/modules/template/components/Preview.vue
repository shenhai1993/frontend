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
  <el-dialog title="模板预览" :visible.sync="show" @close='_close'
             width='60%' top='30px'>
      <template-content v-if="tpl" style="margin: 0px auto;" :selectItem="tpl" :canEdit="false">
      </template-content>
    <div slot="footer" class="dialog-footer">
      <el-button @click="click_cancel">关闭</el-button>
      <el-button type="primary" @click="click_save">购买</el-button>
    </div>
  </el-dialog>
</template>
<script>
import templateContent from '../components/Content.vue'
export default {
  props: ['dialogshow', 'tpl'],
  components: {
    templateContent
  },
  watch: {
    dialogshow (v, ov) {
      this.show = v
      this.checkedMaterials = []
    },
    tpl (v, ov) {
    }
  },
  data () {
    return {
      show: false,
      currentType: ''
    }
  },
  computed: {
  },
  methods: {
    _close () {
      this.$emit('update:dialogshow', false)
      this.show = false
    },
    click_save () {
      this.$emit('buy', false)
    },
    click_cancel () {
      this._close()
    }
  }
}
</script>