<template>
  <div calss="terminal-info">
    <header>
      <i class="el-icon-circle-close"
         @click='click_close'></i>
      <h2>跑马灯所关联的终端</h2>
    </header>
    <section class="m-t-20 info">
      <p class="second-title">分组</p>
      <div class="dialog-group-panel">
        <template v-if="checkedDefault.length > 0">
          <group-panel gtype='trees' :defaultChecked="checkedDefault" :showCheckbox="true" disabled></group-panel>
        </template>
        <template v-else>
          <div>未选择分组</div>
        </template>
      </div>
    </section>
    <section class="m-t-20 info labelAll-content">
      <p class="second-title">标签</p>
      <template v-if="activeMarquee.tagged.length > 0">
        <ul class="labelAll-box">
          <li class="label-options" v-for="(item,index) in activeMarquee.tagged" :key="index">{{ item.tag_name }}</li>
        </ul>
      </template>
      <template v-else>
        <div>未选择标签</div>
      </template>
    </section>
  </div>
</template>

<script>
import GroupPanel from '@/modules/group/components/group'
import api from '@/modules/group/static/api'

export default {
  props: {
    activeMarquee: {
      type: Object,
      required: true
    },
    clearIntervalFromParent: Boolean
  },
  watch: {
    clearIntervalFromParent (newV, oldV) {
      if (newV) {
        this.click_close()
        // this.$emit('update: clearIntervalFromParent', false)
      }
    }
  },
  components: {
    GroupPanel,
  },
  computed: {
    checkedDefault () {
      let treesGroup = []
      for (let inx in this.activeMarquee.trees) {
        treesGroup.push(this.activeMarquee.trees[inx].id)
      }
      return treesGroup
    }
  },
  data () {
    return {
      showDetails: false,
      isclearInterval: false
    }
  },
  methods: {
    click_close () {
      let self = this
      this.isclearInterval = true
      setTimeout(function () {
        self.$emit('showDetails', false)
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-icon-circle-close{
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 16px;
    color: #99A9BF;
    cursor: pointer;
    &:hover{
      color: #C0CCDA;}
  }
  .labelAll-content{
    border-top: 1px solid #e6e6e6;
    padding-top: 15px;
    .label-options{
      padding: 7px 20px 7px 10px;
      border-radius: 4px;
      height: 36px;
      border: 1px solid #409EFF;
      margin: 10px 0 0 10px;
      color: #409EFF;
      font-size: 14px;
      display: inline-block;}
  }
  .second-title{
    font-size: 16px;
    font-weight: 400;
  }
  .dialog-group-panel{
    max-height: 400px;
    overflow: auto;
  }
</style>
