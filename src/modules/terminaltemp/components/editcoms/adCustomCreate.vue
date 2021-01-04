<template>
  <el-dialog
    :title="'新建' + commitData.special_name + '子模块'"
    :visible="showCreateModel"
    @close="handleClose"
    width="1040px">

    <el-row>
      <el-col :span="12">
        <div class="card ad-custom" :style="{ width: simsResetWH[0], height: simsResetWH[1] }">
          <div
            :data-index="-1"
            class="editcoms"
            :class="{'level-state': positionData.index == -1}"
            @click.stop="getPositionData(-1, 'parent', 'drag', commitData)"
            :style="{
              height: commitData.height + 'px'
            }">
            <div
              v-for="(item, index) in commitData.comData"
              :key="item.key"
              :data-index="index"
              :class="{ 'editcoms-img': item.type == 'image', 'editcoms-txt': item.type == 'text', 'level-state': positionData.index == index }"
              @click.stop="getPositionData(index, item.type, 'drag', item)"
              :style="{
                top: item.top + 'px',
                left: item.left + 'px',
                width: item.width + 'px',
                height: item.height + 'px',
                color: item.color,
                fontSize: item.size + 'px'
              }">
              <img v-if="item.type == 'image'" :src="item.val" />
              <span v-else-if="item.type == 'text'">{{item.val}}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="padding-left: 50px;">
        <div>
          <el-button type="primary" @click="addContent('image')">图片</el-button>
          <el-button type="primary" @click="addContent('text')">文本</el-button>
        </div>
        <div>
          <div style="padding: 40px 0 20px;">编辑文本属性</div>
          <el-form :model="editData" size="mini" label-width="84px">
            <el-form-item label="字号大小：">
              <el-slider
                v-model="editData.size"
                :min="10"
                :max="36"
                style="width: 90%;">
              </el-slider>
            </el-form-item>
            <el-form-item label="字体颜色：">
              <el-color-picker v-model="editData.color"></el-color-picker>
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
        <div v-show="positionData.index > -1">
          <el-button class="submit-button" style="margin-top: 20px;" @click="removeItem">移除</el-button>
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
      imgObj: {
        "type": "image",
        "val": "/static/images/model_thumb/model_list_thumb_001.png",
        "width": 182,
        "height": 104,
        "top": 0,
        "left": 0
      },
      textObj: {
        "type": "text",
        "val": "文本",
        "size": 16,
        "color": "#343434",
        "top": 0,
        "left": 0
      },
      editData: {
        size: 16,
        color: "#343434"
      },
      positionData: {
        type: 'parent',
        index: -2,
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

  created() {
    this.getCurrentModelData()
  },

  mounted() {
    this.$nextTick(() => {
      window.getActionData = this.getActionData
      this.initEditAction()
    })

  },

  methods: {
    getCurrentModelData () {
      this.commitData = JSON.parse(JSON.stringify(this.currentData))
    },

    initEditAction () {
      EditAction.Resizable('.editcoms', 's')
    },

    getActionData (event, ui) {
      this.setActionData(event, ui)
    },

    setActionData (event, ui) {
      const type = event.type
      const index = parseInt(ui.helper[0].attributes['data-index'].value)
      if (type == 'resizestop') {
        let width = parseFloat(ui.size.width)
        let height = parseFloat(ui.size.height)
        if (index == -1) {
          this.commitData = Object.assign({}, this.commitData, { width: width, height: height })
        } else {
          let _data = JSON.parse(JSON.stringify(this.commitData.comData[index]))
          _data.width = width
          _data.height = height
          this.$set(this.commitData.comData, index, _data)
        }
      } else if (type == 'dragstop') {
        let top = parseFloat(ui.position.top)
        let left = parseFloat(ui.position.left)
        if (index == -1) {
          this.commitData = Object.assign({}, this.commitData, { top: top, leftlength: left })
        } else {
          let _data = JSON.parse(JSON.stringify(this.commitData.comData[index]))
          _data.top = top
          _data.left = left
          this.$set(this.commitData.comData, index, _data)
        }
      }
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

    addContent (t) {
      const length = this.commitData.comData.length
      let key = length > 0 ? this.commitData.comData[length-1].key + 1 : 1
      let obj = {}
      if (t == 'image') {
        obj = JSON.parse(JSON.stringify(this.imgObj))
      } else if (t == 'text') {
        obj = JSON.parse(JSON.stringify(this.textObj))
      }
      obj.key = key
      this.commitData.comData.splice(length, 0, obj)
      this.$nextTick(() => {
        if (t == 'image') {
          EditAction.Draggable('.editcoms-img')
          EditAction.Resizable('.editcoms-img')
        } else if (t == 'text') {
          EditAction.Draggable('.editcoms-txt')
        }
      })
    },

    getPositionData (i, t, a, d) {
      if (i == -1) {
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
      } else if (i >= 0) {
        const data = {
          type: t,
          index: i,
          active: a,
          top: Math.round(d.top),
          left: Math.round(d.left),
          width: d.width || 0,
          height: d.height || 0
        }
        this.positionData = Object.assign({}, this.positionData, data)
      }
    },

    setActive () {
      this.positionData = Object.assign({}, this.positionData, { active: 'input' })
    },

    removeItem () {
      const index = this.positionData.index
      this.commitData.comData.splice(index, 1)
      this.positionData = Object.assign({}, this.positionData, { index: -2 })
    },

    submitCustom () {
      let newData = JSON.parse(JSON.stringify(this.commitData))
      let id = newData.kid
      id = id.substring(id.indexOf('-') + 1)
      id = parseInt(id) + 1
      newData.id = newData.id.substring(0, newData.id.indexOf('-')) + '-' + id
      newData.intro = '自定义' + newData.special_name + '-' + id
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
    'editData.size' (v) {
      for (let i = 0; i < this.commitData.comData.length; i++) {
        if (this.commitData.comData[i].type == 'text') {
          let data = JSON.parse(JSON.stringify(this.commitData.comData[i]))
          data.size = v
          this.commitData.comData.splice(i, 1, data)
        }
      }
    },

    'editData.color' (v) {
      for (let i = 0; i < this.commitData.comData.length; i++) {
        if (this.commitData.comData[i].type == 'text') {
          let data = JSON.parse(JSON.stringify(this.commitData.comData[i]))
          data.color = v
          this.commitData.comData.splice(i, 1, data)
        }
      }
    },

    'positionData.top' (v, ov) {
      if (this.positionData.active != 'input') {
        return
      }
      if (/^\d+$/.test(v) === false) {
        this.$message({
          message: '请输入正整数或0！',
          type: 'warning'
        })
        this.positionData = Object.assign({}, this.positionData, { top: ov })
        return
      }
      if (this.positionData.index == -1) {
        return
      } else {
        let data = JSON.parse(JSON.stringify(this.commitData.comData[this.positionData.index]))
        data.top = v
        this.commitData.comData.splice(this.positionData.index, 1, data)
      }
    },

    'positionData.left' (v, ov) {
      if (this.positionData.active != 'input') {
        return
      }
      if (/^\d+$/.test(v) === false) {
        this.$message({
          message: '请输入正整数或0！',
          type: 'warning'
        })
        this.positionData = Object.assign({}, this.positionData, { left: ov })
        return
      }
      if (this.positionData.index == -1) {
        return
      } else {
        let data = JSON.parse(JSON.stringify(this.commitData.comData[this.positionData.index]))
        data.left = v
        this.commitData.comData.splice(this.positionData.index, 1, data)
      }
    },

    'positionData.width' (v, ov) {
      if (this.positionData.active != 'input') {
        return
      }
      if (/^\d+$/.test(v) === false) {
        this.$message({
          message: '请输入正整数或0！',
          type: 'warning'
        })
        this.positionData = Object.assign({}, this.positionData, { width: ov })
        return
      }
      if (this.positionData.index == -1) {
        return
      } else {
        let data = JSON.parse(JSON.stringify(this.commitData.comData[this.positionData.index]))
        data.width = v
        this.commitData.comData.splice(this.positionData.index, 1, data)
      }
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
      if (this.positionData.index == -1) {
        this.commitData = Object.assign({}, this.commitData, { height: v })
      } else {
        let data = JSON.parse(JSON.stringify(this.commitData.comData[this.positionData.index]))
        data.height = v
        this.commitData.comData.splice(this.positionData.index, 1, data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../static/css/terminaltemp.scss';

  .ad-custom {
    overflow: hidden;
    .editcoms {
      position: relative;
      width: 100%;
      top: 0px;
      left: 0px;
      background-color: #E5E5E5;
    }
    .editcoms-img, .editcoms-txt {
      position: absolute;
    }
    .editcoms-img {
      z-index: 0;
    }
    .editcoms-txt {
      z-index: 1;
    }
    .editcoms-img img {
      width: 100%;
      height: 100%;
    }
    .editcoms-img:hover,
    .editcoms-txt:hover,
    .level-state {
      border: 1px solid #3F94EF;
    }
  }
  .submit-button {
    display: block;
    margin: 60px auto 0;
  }
</style>
