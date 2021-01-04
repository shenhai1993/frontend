<template>
  <div class="tags p-l-10 p-r-10"
       :class="{ 'istoggle': istoggle }">
    <!-- <span class="el-icon-arrow-down p-r-10" @click="istoggle = !istoggle"></span> -->
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="(item, index) in tags" :key="index" :label="item.name"></el-checkbox>
    </el-checkbox-group>
    <!-- <el-button @click="addTag">
      <i class="fa fa-plus"></i>
    </el-button> -->
    <el-dialog :visible.sync="showAddTag" title="新建标签" width="500px">
      <el-form ref="form" label-width="100px" :model="form" :rules="rules">
        <el-form-item prop="name" label="标签名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer" slot="footer">
        <dialog-button @clickCancel="cancel" @clickConfirm="confirm"></dialog-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DialogButton from '@/components/DialogButton'
export default {
  components: {
    DialogButton
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    },

    resetFlag: {
      type: Number
    }
  },
  data () {
    return {
      istoggle: false,
      checkList: [],
      showAddTag: false,
      form: {},
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}]
      }
    }
  },
  watch: {
    checkList (nv, ov) {
      this.$emit('selectedTags', nv)
    },

    $route (to, from) {
      this.checkList = []
    },

    resetFlag () {
      this.checkList = []
    }
  },
  methods: {
    addTag () {
      this.form = {}
      this.showAddTag = true
    },

    cancel () {
      this.showAddTag =false
    },

    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('add tag')
          this.showAddTag = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .tags {
    width: 100%;
    &.istoggle {
      height: auto;
      z-index: 1;
      border: 1px solid #ebebeb;
      box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
    }
    height: 40px;
    overflow: hidden;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    line-height: 40px;
    background-color: white;
    .el-icon-arrow-down {
      font-size: 16px;
      cursor: pointer;
    }
    .el-checkbox-group {
      display: inline-block;
      > label {
        & + .el-checkbox {
          margin-left: 10px;
        }
        > span:first-child {
          display: none;
        }
        > span:nth-child(2) {
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
    .el-button{
      position: relative;
      top: -1px;
    }
  }
</style>
