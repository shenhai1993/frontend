<template>
  <el-dialog
    :title="'新建' + commitData.special_name + '子模块'"
    :visible="showCreateModel"
    @close="handleClose"
    width="1040px">

    <el-row>
      <el-col :span="4" style="padding-right: 20px;">
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="30">
          </el-table-column>
          <el-table-column
            prop="sname"
            label="内容选项">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div class="card product-custom" :style="{ width: simsResetWH[0], height: simsResetWH[1] }">
          <div
            ref="menuCustomEditArea"
            class="editcoms"
            :class="{ 'level-state': positionData.index == -1 }"
            @click.stop="getPositionData(-1, 'parent', 'drag', commitData)"
            :style="{
              height: commitData.height + 'px'
            }">
            <component
              v-for="(item, index) in commitData.comData"
              :key="item.key"
              :is="item.type + '-edit'"
              :itemData="item"
              :proItem="productItem"
              :posData="positionData"
              :posWatch="positionWatch"
              :state="submitState"
              @getItemData="getItemData">
            </component>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="padding-left: 50px;">
        <div style="color: #FF0000; font-size: 16px;">说明：为了排列整齐，请您按顺序，将先添加的模块排在前面，后添加的模块排在后面。</div>
        <div style="margin-top: 10px;">
          <el-button type="primary" @click="addContent(3, 'menu', 'top')">横排导航</el-button>
          <el-button type="primary" @click="addContent(4, 'menu', 'left')">竖排导航</el-button>
        </div>
        <div style="margin-top: 10px;">
          <el-button type="primary" @click="addContent(1, 'product', 'top')">横排商品</el-button>
          <el-button type="primary" @click="addContent(2, 'product', 'left')">竖排商品</el-button>
        </div>
        <div>
          <div style="padding: 40px 0 20px;">编辑文本属性</div>
          <el-form :model="positionData" size="mini" label-width="84px">
            <el-form-item label="字号大小：">
              <el-slider
                v-model="positionData.size"
                :min="10"
                :max="36"
                style="width: 90%;">
              </el-slider>
            </el-form-item>
            <el-form-item label="字体颜色：">
              <el-color-picker v-model="positionData.color"></el-color-picker>
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-top: 40px;">
          <el-form :model="positionData" size="mini" label-width="60px">
            <el-form-item prop="top" label="top:" v-if="positionData.type == 'image'">
              <el-input v-model="positionData.top" data-name="top" @focus="setActive()" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item prop="left" label="left:" v-if="positionData.type == 'image'">
              <el-input v-model="positionData.left" data-name="left" @focus="setActive()" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item prop="width" label="width:" v-if="positionData.type == 'image'">
              <el-input v-model="positionData.width" data-name="width" @focus="setActive()" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item prop="height" label="height:">
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
import { floatCount } from '@/assets/js/floatcount.js'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'
import { EditAction } from '../../static/js/editAction.js'

export default {
  components: {
    MenuTopEdit: () => import ('./menuTopEdit.vue'),
    MenuLeftEdit: () => import ('./menuLeftEdit.vue'),
    ProductTopEdit: () => import ('./productTopEdit.vue'),
    ProductLeftEdit: () => import ('./productLeftEdit.vue')
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
      submitState: false,
      showCreateModel: this.isShow,
      productItem: [],
      tableData: [],
      commitData: {},
      contentData: {
        1: {
          type: 'product-top',
          size: 14,
          color: "#343434",
          width: 230,
          height: 70,
          top: 0,
          left: 109
        },
        2: {
          type: 'product-left',
          size: 14,
          color: "#343434",
          width: 172,
          height: 182,
          top: 0,
          left: 109
        },
        3: {
          type: 'menu-top',
          size: 14,
          color: "#343434",
          width: 470,
          height: 52,
          top: 0,
          left: 9
        },
        4: {
          type: 'menu-left',
          size: 14,
          color: "#343434",
          width: 90,
          height: 380,
          top: 0,
          left: 9
        }
      },
      positionData: {
        type: 'parent',
        index: -2,
        active: '',
        size: 14,
        color: "#343434",
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      positionWatch: {
        index: -2,
        type: 'top',
        val: 0
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
      this.getAllBute()
      window.getActionData = this.getActionData
      this.initEditAction()
    })
  },

  methods: {
    getCurrentModelData () {
      this.commitData = JSON.parse(JSON.stringify(this.currentData))
    },

    getAllBute () {
      Terminaltemp.getAllBute().then(res => {
        if (res.data.success) {
          this.tableData = res.data.message
          this.$nextTick(() => {
            this.toggleAllSelection()
          })
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    toggleAllSelection () {
      let rows = []
      for (let i = 0; i < this.tableData.length; i++) {
        const row = this.tableData[i]
        if (row.tname == 'img_url' || row.tname == 'name' || row.tname == 'buy_price') {
          rows.push(row)
        }
      }
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },

    handleSelectionChange (val) {
      this.productItem = JSON.parse(JSON.stringify(val))
      this.productItem.push({
        sname: '属性',
        tname: 'attributes',
        type: 'none',
        val: ''
      })
    },

    initEditAction () {
      EditAction.Resizable('.editcoms', 's')
    },

    getActionData (event, ui) {
      this.setActionData(event, ui)
    },

    setActionData (event, ui) {
      const height = parseFloat(ui.size.height)
      this.commitData = Object.assign({}, this.commitData, { height: height })
    },

    handleClose (done) {
      this.$confirm('正在编辑，确认关闭吗？', '提示', {
        type: 'warning'
      }).then(() => {
          sessionStorage.removeItem('product_custom_submit_data')
          this.$emit('closeCreateModel')
          this.showCreateModel = false
          done()
      }).catch(() => {})
    },

    addContent (id, type, dir) {
      const length = this.commitData.comData.length
      let key = length > 0 ? this.commitData.comData[length-1].key + 1 : 1
      let obj = JSON.parse(JSON.stringify(this.contentData[id]))
      obj.key = key
      let subData = JSON.parse(sessionStorage.getItem('product_custom_submit_data') || '[]')
      const subLength = subData.length
      let state = -2
      if (type == 'menu') {
        for (let i = 0; i < subLength; i++) {
          const currType = subData[i].type
          if (currType.search(type) > -1) {
            this.$message({
              message: '导航，只需添加一个！',
              type: 'warming'
            })
            state = i
            if (currType.search(dir) > -1) {
              state = -1
            }
            break
          }
        }
      }

      if (state == -2) {
        this.commitData.comData.splice(length, 0, obj)
        subData.splice(subLength, 0, obj)
      } else if (state > -1) {
        this.commitData.comData.splice(state, 1)
        subData.splice(state, 1)
        this.commitData.comData.splice(length - 1, 0, obj)
        subData.splice(subLength - 1, 0, obj)
      }
      sessionStorage.setItem('product_custom_submit_data', JSON.stringify(subData))
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

    getItemData (v) {
      this.positionData = Object.assign({}, this.positionData, v)
    },

    removeItem () {
      const data = JSON.parse(JSON.stringify(this.commitData))
      if (data.comData.length == 0) {
        return
      }
      const key = this.positionData.index
      let index = 0
      for (let i = 0; i < data.comData.length; i++) {
        if (key == data.comData[i].key) {
          index = i
          break
        }
      }
      this.commitData.comData.splice(index, 1)
      this.positionData = Object.assign({}, this.positionData, { index: -2 })
      let subData = JSON.parse(sessionStorage.getItem('product_custom_submit_data'))
      for (let i = 0; i < subData.length; i++) {
        if (key == subData[i].key) {
          subData.splice(i, 1)
          break
        }
      }
      sessionStorage.setItem('product_custom_submit_data', JSON.stringify(subData))
    },

    submitCustom () {
      let subData = JSON.parse(sessionStorage.getItem('product_custom_submit_data') || '[]')
      if (subData.length == 0) {
        this.$alert('您还没有添加内容！', '提示', {
          confirmButtonText: '知道了',
          type: 'warning'
        })
        return
      }

      this.submitState = true
      setTimeout(() => {
        this.submitState = false
        this.getCustomData()
      }, 200)
    },

    getCustomData () {
      let subData = JSON.parse(sessionStorage.getItem('product_custom_submit_data'))
      this.commitData.comData = JSON.parse(JSON.stringify(subData))
      sessionStorage.removeItem('product_custom_submit_data')
      let newData = JSON.parse(JSON.stringify(this.commitData))
      let id = newData.kid
      id = id.substring(id.indexOf('-') + 1)
      id = parseInt(id) + 1
      newData.id = newData.id.substring(0, newData.id.indexOf('-')) + '-' + id
      newData.intro = '自定义' + newData.special_name + '-' + id
      const cd = newData.comData
      let newCom = {}
      let newProduct = []
      let newTop = 10000
      let newLeft = 10000
      let dataHeight = 0
      let newWidth = this.$refs.menuCustomEditArea.offsetWidth
      let newHeight = this.$refs.menuCustomEditArea.offsetHeight
      for (let i = 0; i < cd.length; i++) {
        const type = cd[i].type
        if (type.search('menu') > -1) {
          newCom = Object.assign({}, newCom, { menu: cd[i] })
        } else if(type.search('product') > -1) {
          const top = cd[i].top
          const left = cd[i].left
          const height = cd[i].height
          const th = parseInt(floatCount.accAdd(top, height))
          if (newTop > top) {
            newTop = top
          }
          if (newLeft > left) {
            newLeft = left
          }
          if (dataHeight < th) {
            dataHeight = th
          }
          newProduct.push(cd[i])
        }
      }
      if (newProduct.length == 0) {
        this.$alert('您还没有添加商品！', '提示', {
          confirmButtonText: '知道了',
          type: 'warning'
        })
        return
      }
      for (let i = 0; i < newProduct.length; i++) {
        let top = newProduct[i].top
        let left = newProduct[i].left
        top = parseInt(floatCount.accSub(top, newTop))
        left = parseInt(floatCount.accSub(left, newLeft))
        newProduct[i].top = top
        newProduct[i].left = left
      }
      newWidth = parseInt(floatCount.accSub(newWidth, newLeft))
      newWidth = parseInt(floatCount.accSub(newWidth, 2))
      newHeight = parseInt(floatCount.accSub(newHeight, newTop))
      newHeight = parseInt(floatCount.accSub(newHeight, 2))
      dataHeight = parseInt(floatCount.accSub(dataHeight, newTop))
      dataHeight = parseInt(floatCount.accAdd(dataHeight, 2))
      newCom = Object.assign({}, newCom, { product: {} })
      newCom.product = Object.assign({}, newCom.product, { width: newWidth, height: newHeight, top: newTop, left: newLeft, default: {}, data: [] })
      newCom.product.default = Object.assign({}, newCom.product.default, { height: dataHeight, data: newProduct })
      newData.comData = newCom
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
    'positionData.size' (v) {
      this.positionWatch = Object.assign({}, this.positionWatch, { index: this.positionData.index, type: 'size', val: v })
    },

    'positionData.color' (v) {
      this.positionWatch = Object.assign({}, this.positionWatch, { index: this.positionData.index, type: 'color', val: v })
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
        this.positionWatch = Object.assign({}, this.positionWatch, { index: this.positionData.index, type: 'top', val: v })
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
        this.positionWatch = Object.assign({}, this.positionWatch, { index: this.positionData.index, type: 'left', val: v })
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
        this.positionWatch = Object.assign({}, this.positionWatch, { index: this.positionData.index, type: 'width', val: v })
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
        this.positionWatch = Object.assign({}, this.positionWatch, { index: this.positionData.index, type: 'height', val: v })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../static/css/terminaltemp.scss';

  .product-custom {
    overflow: hidden;
    .editcoms {
      position: relative;
      width: 100%;
      top: 0px;
      left: 0px;
      background-color: #E5E5E5;
    }
    .level-state {
      border: 1px solid #3F94EF;
    }
  }
  .submit-button {
    display: block;
    margin: 60px auto 0;
  }
</style>
