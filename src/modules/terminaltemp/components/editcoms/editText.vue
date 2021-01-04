<template>
  <el-dialog
    :visible="showEditText"
    @close="closeDialog"
    title="文字编辑"
    append-to-body
    width="400px"
    center>
    <el-form :model="editData" ref="editData" size="mini" label-width="100px">
      <el-form-item label="预览：">
        <div
          class="editText-area"
          :style="{ color: editData.color, fontSize: editData.size + 'px', fontWeight: editData.weight }">
          {{editData.val}}
        </div>
      </el-form-item>

      <!--
      <el-form-item
        prop="val"
        label="请输入："
        :rules="{
          required: true, message: '请输入', trigger: 'blur'
        }">
        <el-input v-model="editData.val" style="width: 90%"></el-input>
      </el-form-item>
      -->

      <el-form-item label="字号大小：">
        <el-slider
          v-model="editData.size"
          :min="10"
          :max="36"
          style="width: 90%;">
        </el-slider>
      </el-form-item>
      <el-form-item label="字体样式：">
        <el-radio v-model="editData.weight" label="normal">默认</el-radio>
        <el-radio v-model="editData.weight" label="bold">加粗</el-radio>
      </el-form-item>
      <el-form-item label="字体颜色：">
        <el-color-picker v-model="editData.color"></el-color-picker>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="commitEditData('editData')" type="primary">完 成</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {

  },

  props: {
    showText: {
      type: Boolean
    },

    currData: {
      type: Object
    },

    index: {
      type: Number
    }
  },

  data () {
    return {
      showEditText: this.showText,
      editData: this.currData
    }
  },

  created () {

  },

  methods: {
    commitEditData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showEditText = false
          this.$emit('editTextEmit', JSON.parse(JSON.stringify(this.editData)), this.index)
        } else {
          return false
        }
      })
    },

    closeDialog () {
      this.$confirm('正在编辑，确认关闭吗？', '提示', {
        type: 'warning'
      }).then(() => {
          this.showEditText = false
          this.$emit('editTextEmit')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .editText-area {
    border: 1px solid #DCDFE6;
    padding: 5px 15px;
    border-radius: 4px;
    width: 90%;
  }
</style>
