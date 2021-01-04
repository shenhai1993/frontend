<template>
  <el-dialog @close="click_cancel" :title="showWindowTitle" :visible="showEditWindow" width="700px" center>
    <el-form :model="formDrug" ref="formDrug" :rules="rules" size="mini" label-width="212px">
      <el-form-item prop="name" label="属性名称：">
        <el-input v-focus v-model="formDrug.name" auto-complete="off" maxlength="8" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="权重：">
        <el-input  v-model.number="formDrug.sort" auto-complete="off" maxlength="8" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="typeid" label="所属分类：">
        <el-select v-model="formDrug.typeid" placeholder="请选择" style="width: 60%">
          <el-option
            v-for="item in productsTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(icon, index) in formDrug.con"
        :key="icon.key"
        :prop="'con.' + index + '.value'"
        :label="'属性' + (index + 1) + '：'"
        :rules="{
          required: true, message: '请输入属性值', trigger: 'blur'
        }"
      >
        <el-input v-focus v-model="icon.value" auto-complete="off" maxlength="8" style="width: 60%"></el-input>
        <el-button @click="_addCon" size="mini" icon="el-icon-plus" v-if="index == 0">添加属性</el-button>
        <el-button @click="_removeCon(icon)" size="mini" icon="el-icon-delete" v-else-if="index > 0">删除</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submitForm('formDrug')" type="primary">保 存</el-button>
      <el-button @click="click_cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import http from '@static/js/utils/http'
import uploadCmp from '@/components/upload'
import {mapState, mapMutations, mapActions} from 'vuex'
import DialogButton from '@/components/DialogButton'

export default {
  data () {
    let validatorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('属性名称不能为空'))
      }
      callback()
    }

    return {
      formDrug: {
        id: 0,
        picurl: '',
        name: '',
        sort: 0,
        con: [{value: ''}]
      },
      title: '新增分类',
      action: 'add',
      options: [], // 药品类型
      rules: {
        name: [{ validator: validatorName,required: true, trigger: 'blur' }],
        sort:[
          { required: true, message: '请输入权重', trigger: 'blur' },
          { required: true, pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }
        ],
        typeid:[{ required: true, message: '请选择所属分类', trigger: 'change' }]
      }
    }
  },
  computed : {
    ...mapState({
      showEditWindow: state => state.attribute.showEditWindow,
      productsTypeList: state => state.attribute.productsTypeList
    }),
    showWindowTitle: function () {
      return this.formDrug.id == 0 ? '新增属性' : '编辑属性'
    }
  },
  props: {
    item: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },

    index: {
      type: Number
    },

    customizePages: {
      type: Number
    },

    currentPage: {
      type: Number
    }
  },

  components: {
    uploadCmp,
    DialogButton
  },

  created () {
    this.action = this.item.id != 0 ? 'edit' : 'add'
    if (this.action === 'edit'){
      this.formDrug = JSON.parse(JSON.stringify(this.item))
      if(typeof this.formDrug.con === 'string'){
        let conArr = this.formDrug.con.split(',')
        this.formDrug.con = []
        for(let i=0; i<conArr.length; i++) {
          this.formDrug.con.push({
            value: conArr[i],
            key: i
          })
        }
      }
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_EDIT_WINDOW'
    ]),

    ...mapActions([
      'createAttributeItem','getAttributesPageList'
    ]),

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._saveItems()
          return true
        } else {
          return false
        }
      })
    },

    click_cancel () {
      this._hiddenForm()
    },

    _setPayload () {
      let data = JSON.parse(JSON.stringify(this.formDrug))
      let con = ''
      const conArr = data.con
      for(let i=0; i<conArr.length; i++){
        if(con == '') con += conArr[i].value
        else con += ',' + conArr[i].value
      }
      data.con = con
      return data
    },

    /**
     * 添加/编辑药品
     * */
    _saveItems () {
      let data = this._setPayload()
      this.createAttributeItem(data)
        .then(res => {
          if (!res.data.success) {
            this._notify('错误', res.data.message, 'error')
            return
          }

          this._notify('成功', '操作成功', 'success')
          this.getAttributesPageList({
            page: this.currentPage,
            perpage: this.customizePages
          })
          this.$emit('refreshList')
        })
        .catch(e => {
          this._notify('错误', '操作失败，请重试', 'error')
          console.log(e)
        })
    },

    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    _hiddenForm () {
      this.SHOW_EDIT_WINDOW(false)
    },

    _addCon () {
      const leng = this.formDrug.con.length
      if (leng >= 6) {
        this.$message('属性最多不超过6个！')
        return
      }
      this.formDrug.con.push({
        value: '',
        key: leng + 1
      })
    },

    _removeCon (i) {
      const index = this.formDrug.con.indexOf(i)
      if (index !== -1) {
        this.formDrug.con.splice(index, 1)
      }
    }
  },

  watch: {
  }
}
</script>
