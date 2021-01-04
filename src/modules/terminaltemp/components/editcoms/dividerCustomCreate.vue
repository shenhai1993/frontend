<template>
  <el-dialog
    :title="'新建' + commitData.special_name + '子模块'"
    :visible="showCreateModel"
    @close="handleClose"
    width="1040px">

    <el-row>
      <el-col :span="12">
        <div class="card divider-custom" :style="{ width: simsResetWH[0], height: simsResetWH[1] }">
          <div
            :data-index="-1"
            class="editcoms"
            :style="{
              height: commitData.height + 'px'
            }">
            <div
              :style="{
                backgroundColor: defaultObj.bgcolor,
                borderTop: defaultObj.borderTop,
                borderRight: defaultObj.borderRight,
                borderBottom: defaultObj.borderBottom,
                borderLeft: defaultObj.borderLeft
              }"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="padding-left: 50px;">
        <div>
          <div style="padding-bottom: 20px;">编辑属性</div>
          <el-form :model="editData" size="mini" label-width="84px">
            <el-form-item label="边框：">
              <el-checkbox-group v-model="editData.borders" @change="handleCheckedChange">
                <el-checkbox v-for="border in borders" :label="border.label" :key="border.label">{{border.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="边框大小：">
              <el-slider
                v-model="editData.bdwidth"
                :min="1"
                :max="10"
                style="width: 80%;">
              </el-slider>
            </el-form-item>
            <el-form-item label="边框样式：">
              <el-radio-group v-model="editData.bdstyle">
                <el-radio label="none">无框</el-radio>
                <el-radio label="solid">实线</el-radio>
                <el-radio label="dashed">虚线</el-radio>
                <el-radio label="dotted">圆点</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="边框颜色：">
              <el-color-picker v-model="editData.bdcolor"></el-color-picker>
            </el-form-item>
            <el-form-item label="背景颜色：">
              <el-color-picker v-model="editData.bgcolor"></el-color-picker>
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-top: 40px;">
          <el-form :model="positionData" size="mini" label-width="60px">
            <el-form-item prop="top" label="top:" v-if="positionData.type == 'image' || positionData.type == 'text'">
              <el-input v-model="positionData.top" data-name="top" @focus="setActive()" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item prop="left" label="left:" v-if="positionData.type == 'image' || positionData.type == 'text'">
              <el-input v-model="positionData.left" data-name="left" @focus="setActive()" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item prop="width" label="width:" v-if="positionData.type == 'image'">
              <el-input v-model="positionData.width" data-name="width" @focus="setActive()" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item prop="height" label="height:" v-if="positionData.type == 'image' || positionData.type == 'parent'">
              <el-input v-model="positionData.height" data-name="height" @focus="setActive()" style="width: 100px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button class="submit-button" type="primary" @click="submitCustom()">保存</el-button>
        </div>
      </el-col>
    </el-row>

  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'
import { EditAction } from '../../static/js/editAction.js'

export default {
  components: {

  },

  props: {
    isShow: {
      type: Boolean
    },

    currentData: {
      type: Object
    },

    originData: {
      type: Object
    }
  },

  data () {
    return {
      showCreateModel: this.isShow,
      commitData: {},
      defaultObj: {
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        bgcolor: 'transparent'
      },
      editData: {
        borders: ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'],
        bdstyle: 'solid',
        bdwidth: 1,
        bdcolor: '#0000ff',
        bgcolor: '#F1F4F8'
      },
      borders: [
        {
          name: '上边',
          label: 'borderTop'
        },
        {
          name: '右边',
          label: 'borderRight'
        },
        {
          name: '下边',
          label: 'borderBottom'
        },
        {
          name: '左边',
          label: 'borderLeft'
        }
      ],
      positionData: {
        type: 'parent',
        index: -1,
        active: '',
        top: 0,
        left: 0,
        width: 0,
        height: 0
      }
    }
  },

  computed: {
    ...mapState({
      simsResetWH: state => state.terminaltemp.simsResetWH,
      baseWH: state => state.terminaltemp.baseWH
    })
  },

  mounted() {
    this.getCurrentModelData()
    this.$nextTick(() => {
      window.getActionData = this.getActionData
      this.initEditAction()
    })
  },

  methods: {
    getCurrentModelData () {
      this.commitData = JSON.parse(JSON.stringify(this.currentData))
      this.commitData.comData.splice(0, 0, this.defaultObj)
      this.getBorder()
      this.getPositionData(-1, 'parent', 'drag', this.commitData)
    },

    getBorder () {
      let borders = JSON.parse(JSON.stringify(this.editData))
      this.defaultObj = Object.assign({}, this.defaultObj, {
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderLeft: 'none'
      })
      for (let i = 0; i < borders.borders.length; i++) {
        let border = {}
        border[borders.borders[i]] = this.editData.bdwidth + 'px ' + this.editData.bdstyle + ' ' + this.editData.bdcolor
        this.defaultObj = Object.assign({}, this.defaultObj, border)
      }
    },

    handleCheckedChange (val) {
      this.getBorder()
    },

    initEditAction () {
      EditAction.Resizable('.editcoms', 's')
    },

    getActionData (event, ui) {
      this.setActionData(event, ui)
    },

    setActionData (event, ui) {
      const index = parseInt(ui.helper[0].attributes['data-index'].value)
      let height = parseFloat(ui.size.height)
      this.commitData = Object.assign({}, this.commitData, { height: height })
      this.positionData = Object.assign({}, this.positionData, { height: height })
    },

    handleClose (done) {
      this.$confirm('正在编辑，确认关闭吗？', '提示', {
        type: 'warning'
      }).then(() => {
          this.$emit('closeCreateModel')
          this.showCreateModel = false
          done()
      }).catch(() => {})
    },

    getPositionData (i, t, a, d) {
      const data = {
        type: t,
        index: i,
        active: a,
        top: Math.round(d.top),
        left: Math.round(d.leftlength),
        width: Math.round(d.width),
        height: Math.round(d.height)
      }
      this.positionData = Object.assign({}, this.positionData, data)
    },

    setActive () {
      this.positionData = Object.assign({}, this.positionData, { active: 'input' })
    },

    submitCustom () {
      let newData = JSON.parse(JSON.stringify(this.commitData))
      let id = newData.kid
      id = id.substring(id.indexOf('-') + 1)
      id = parseInt(id) + 1
      newData.id = newData.id.substring(0, newData.id.indexOf('-')) + '-' + id
      newData.intro = '自定义' + newData.special_name + '-' + id
      newData.comData.splice(0, 1, this.defaultObj)
      newData.comData = JSON.stringify(newData)
      let data = JSON.parse(localStorage.getItem('custom_model_data') || '[]')
      data.push(newData)
      localStorage.setItem('custom_model_data', JSON.stringify(data))
      this.$emit('refreshCustomList')
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    }
  },

  watch: {
    'editData.bdwidth' (v) {
      this.getBorder()
    },

    'editData.bdcolor' (v) {
      this.getBorder()
    },

    'editData.bdstyle' (v) {
      this.getBorder()
    },

    'editData.bgcolor' (v) {
      this.defaultObj = Object.assign({}, this.defaultObj, { bgcolor: v })
    },

    'positionData.height' (v, ov) {
      if (this.positionData.active != 'input') {
        return
      }
      if (/^\d+$/.test(v) === false) {
        this.$message({
          message: '请输入正整数或0！',
          type: 'warning'
        })
        this.positionData = Object.assign({}, this.positionData, { height: ov })
        return
      }
      this.commitData = Object.assign({}, this.commitData, { height: v })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../static/css/terminaltemp.scss';

  .divider-custom {
    overflow: hidden;
    .editcoms {
      position: relative;
      width: 100%;
      > div {
        width: 100%;
        height: 100%;
      }
    }
  }
  .submit-button {
    display: block;
    margin: 60px auto 0;
  }
</style>
