<template>
  <div class="position-info">
    <div class="position-info-header">位置信息：</div>
    <el-form :model="formData" :rules="rules" size="mini" label-width="60px">
      <el-form-item prop="top" label="top:">
        <el-input v-model.number="formData.top" @blur="positionInfoBlur" data-name="top" style="width: 100px;"></el-input>
      </el-form-item>
      <el-form-item prop="left" label="left:">
        <el-input v-model.number="formData.left" @blur="positionInfoBlur" data-name="left" style="width: 100px;" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      formData: {},
      oldData: {},
      rules: {
        top: [
          { required: true, message: '不能为空', trigger: 'change' },
          { type: 'number', message: '必须数字', trigger: 'change' }
        ],
        left: [
          { required: true, message: '不能为空', trigger: 'change' },
          { type: 'number', message: '必须数字', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      simsviewDragData: state => state.terminaltemp.simsviewDragData
    })
  },

  created () {
    this.getPositionInfo()
  },

  methods: {
    ...mapMutations([
      'DRAG_SIMS_VIEW_MODEL'
    ]),

    ...mapActions([
      'dragSimsViewModel'
    ]),

    getPositionInfo () {
      this.formData = JSON.parse(sessionStorage.getItem('position_Data') || '{}')
      this.formData.top = Math.round(this.formData.top)
      this.formData.left = Math.round(this.formData.left)
      this.oldData = JSON.parse(sessionStorage.getItem('position_Data') || '{}')
    },

    positionInfoBlur (e) {
      if (Object.keys(this.oldData).length == 0) {
        return false
      }
      const name = e.target.attributes['data-name'].value
      if (this.formData[name] != this.oldData[name]) {
        this.oldData[name] = this.formData[name]
        this.formData.t = 'input'
        sessionStorage.setItem('position_Data', JSON.stringify(this.formData))
        this.dragSimsViewModel(this.formData)
      }
    }
  },

  watch: {
    simsviewDragData (v) {
      this.getPositionInfo()
    }
  }
}
</script>

<style lang="scss">
  .position-info {
    .el-input__inner {
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-radius: 0;
      padding: 0;
      background-color: transparent;
    }
  }
</style>
<style lang="scss" scoped>
  .position-info {
    height: 100%;
    padding: 20px 10px 0;
    background-color: #FFFFFF;
    .position-info-header {
      margin-bottom: 20px;
      font-size: 14px;
    }
  }
</style>
