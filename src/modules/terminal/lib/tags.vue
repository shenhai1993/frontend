<template>
  <div class="tags-content">
    <el-checkbox @change="changeTags" v-model="checkedTags" class="checkbox" border v-for="(item,index) in tags" :key="index" :label="item.name">{{item.name}}</el-checkbox>
    </div>
</template>

<script>
import api from '@/modules/group/static/api'

export default {
  props: {
    tagged: {
      type: Array
    }
  },

  data () {
    return {
      checkedTags: [],
      tags: []
    }
  },

  methods: {
    _getTags () {
      api.getTags().then(res => {
        this.tags = res.data.message
      }).catch(e => {
        console.log(e)
      })
    },

    changeTags () {
      this.$emit('changeTags', this.checkedTags)
    }
  },

  created () {
    this._getTags()
    console.log(`this.tagged:==>`)
    console.log(this.tagged)
    this.checkedTags = this.tagged.concat()
  },

  watch: {
    tagged: {
      handler (n, o) {
        console.log(`n:==>`)
        console.log(n)
        this.checkedTags = n
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.tags-content {
  .checkbox{
  padding: 4px 15px 3px 10px;
  margin: 10px 0 0 10px;
  }
}
</style>
