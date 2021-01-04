<!--
  author: wangwei(w.w@tcl.com)  2017-11-13
  desc: 模板选择控件
  使用方法：
-->
<template>
  <div>
    <templateSelect :selectItem.sync="tpl"></templateSelect>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import templateSelect from '@/modules/template/components/Selector.vue'

export default {
  components: {
    templateSelect
  },
  data () {
    return {
      tpl: {}
    }
  },
  watch: {
    tpl (nv, ov) {
      this.PUT_TEMPLATE_MPDP(nv)
      this.$emit('update:canNext', true)
      this.$emit('selectTemplate', true)
    }
  },
  methods: {
    ...mapMutations([
      'PUT_TEMPLATE_MPDP'
    ])
  }
}
</script>
