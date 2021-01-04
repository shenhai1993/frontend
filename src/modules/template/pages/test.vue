<!-- 
  author: wangwei(w.w@tcl.com)  2017-10-16
-->
<template>
  <div>
    {{item}}
    <contentxx :selectItem="item"></contentxx>
    <templateSelect :selectItem.sync="item"></templateSelect>
  </div>
</template>
<script>
import templateSelect from '../components/Selector.vue'
import contentxx from '../components/Content.vue'
export default {
  components: {
    templateSelect,
    contentxx
  },
  data () {
    return {
      item: {}
    }
  }
}
</script>