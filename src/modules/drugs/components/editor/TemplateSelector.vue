<!--
  author: wangwei(w.w@tcl.com)  2017-11-13
  desc: 模板选择控件
  使用方法：
-->
<template>
  <el-dialog width="768px" @close="cancel" class="template-selector" :visible="showTemplateSelector"
  title="请选择模板">
    <templateSelect class="selector" :selectItem.sync="tpl" :direction="direction"></templateSelect>
    <div class="dialog-footer" slot="footer">
      <dialog-button @clickCancel="cancel" @clickConfirm="confirm"></dialog-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import templateSelect from '@/modules/tpl/lib/Selector.vue'
import DialogButton from '@/components/DialogButton'

export default {
  components: {
    templateSelect, DialogButton
  },

  props: {
    direction: {
      type: Number
    }
  },

  data () {
    return {
      tpl: {}
    }
  },

  computed: {
    ...mapState({
      showTemplateSelector: state => state.drugs.showTemplateSelector
    })
  },

  watch: {
    // tpl (nv, ov) {
    //   // this.SET_SELECTED_TPL(nv)
    //   this.$emit('update:canNext', true)
    // }
  },

  methods: {
    ...mapMutations([
      'SET_SELECTED_TPL', 'SHOW_TEMPLATE_SELECTOR'
    ]),

    cancel () {
      this.SHOW_TEMPLATE_SELECTOR(false)
    },

    confirm () {
      let _tpl = JSON.stringify(this.tpl)
      _tpl = JSON.parse(_tpl)
      this.SET_SELECTED_TPL(_tpl)
      this.SHOW_TEMPLATE_SELECTOR(false)
      this.$emit('selectNewTpl', _tpl)
    }
  }
}
</script>

<style lang="scss">
.template-selector{
  .el-dialog__body{
    height: 450px;
    overflow-y: auto;
  }
}
</style>
