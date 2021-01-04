<template>
  <div
    class="card product-card editcoms"
    :data-index="modelIndex"
    :style="{
      width: componentData.width + 'px',
      height: componentData.height + 'px',
      top: componentData.top + 'px',
      left: componentData.leftlength + 'px'
    }">
    <div
      v-for="(item, index) in attrData"
      :key="item.tname"
      :class="{ 'editcoms-img': item.type == 'image', 'editcoms-txt': item.type == 'text' }"
      :data-index="index"
      @dblclick="editContent(item.type, item, index)"
      :style="{
        top: item.top + 'px',
        left: item.left + 'px',
        width: item.width + 'px',
        height: item.height + 'px',
        color: item.color,
        fontSize: item.size + 'px',
        fontWeight: item.weight
      }">
      <el-image v-if="item.type == 'image'" :src="item.val">
        <div slot="error" style="text-align: center;">图片</div>
      </el-image>
      <div v-else-if="item.type == 'text'">{{item.val}}</div>
    </div>

    <edit-text
      v-if="showEditText"
      :currData="editData"
      :index="editDataIndex"
      :showText="showEditText"
      @editTextEmit="editTextEmit">
    </edit-text>
    <edit-image
      v-if="showEditImage"
      :currData="editData"
      :index="editDataIndex"
      :showImage="showEditImage"
      @editImageEmit="editImageEmit">
    </edit-image>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'
import { EditAction } from '../../static/js/editAction.js'
import EditText from '../editcoms/editText.vue'
import EditImage from '../editcoms/editImage.vue'

export default {
  components: {
    EditText,
    EditImage
  },

  props: {
    comData: {
      type: Object
    }
  },

  data () {
    return {
      modelIndex: -1,
      componentData: {},
      attrData: [],
      editData: {},
      editDataIndex: 0,
      showEditText: false,
      showEditImage: false
    }
  },

  created () {
    this.initData()
  },

  mounted() {
    window.getActionData = this.getActionData
    this.initEditAction()
  },

  methods: {
    initData () {
      this.componentData = JSON.parse(JSON.stringify(this.comData))
      this.attrData = this.componentData.comData[0].attr
    },

    initEditAction () {
      EditAction.Draggable('.editcoms')
      EditAction.Draggable('.editcoms-img')
      EditAction.Draggable('.editcoms-txt')
      EditAction.Resizable('.editcoms')
      EditAction.Resizable('.editcoms-img')
    },

    editContent (type, data, index) {
      this.editData = JSON.parse(JSON.stringify(data))
      this.editDataIndex = index
      if (type == 'text') {
        this.showEditText = true
      } else if (type == 'image') {
        this.showEditImage = true
      }
    },

    editTextEmit (data, index) {
      this.showEditText = false
      if (!data) {
        return
      }
      this.editDataEmit(data, index)
    },

    editImageEmit (data, index) {
      this.showEditImage = false
      if (!data) {
        return
      }
      this.editDataEmit(data, index)
    },

    editDataEmit (data, index) {
      let _data = JSON.parse(JSON.stringify(data))
      this.$set(this.componentData.comData[0].attr, index, _data)
      this.$set(this.attrData, index, _data)
      this.$emit('currentModelDataEmit', JSON.parse(JSON.stringify(this.componentData)))
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
          this.componentData = Object.assign({}, this.componentData, { width: width, height: height })
        } else {
          let _data = JSON.parse(JSON.stringify(this.attrData[index]))
          _data.width = width
          _data.height = height
          this.$set(this.componentData.comData[0].attr, index, _data)
          this.$set(this.attrData, index, _data)
        }
      } else if (type == 'dragstop') {
        let top = parseFloat(ui.position.top)
        let left = parseFloat(ui.position.left)
        if (index == -1) {
          this.componentData = Object.assign({}, this.componentData, { leftlength: left })
        } else {
          let _data = JSON.parse(JSON.stringify(this.attrData[index]))
          _data.top = top
          _data.left = left
          this.$set(this.componentData.comData[0].attr, index, _data)
          this.$set(this.attrData, index, _data)
        }
      }
      this.$emit('currentModelDataEmit', JSON.parse(JSON.stringify(this.componentData)))
    }
  },

  watch: {
    comData (v) {
      this.initData()
      this.$nextTick(() => {
        this.initEditAction()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../static/css/terminaltemp.scss';

  .terminaltemp-index {
    .el-container {
      .product-card {
        overflow: hidden;
        .el-image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
    }
  }
</style>
