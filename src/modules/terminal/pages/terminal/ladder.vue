<template>
  <div>
    <el-dialog title="修改货道" :visible="isterminalLadderVisible" width='800px'
               :t_id = "t_id"
               @close="click_cancel">
      <h2 slot="title">
        修改货道
      </h2>
      <small slot="title" style="color:red;">
        注意，修改货道会清空商品上架设置，请谨慎操作！
      </small>
      <el-form :model="formData" :rules="rules" ref="formData">
        <el-row>
          <el-col :span='23' :offset='0'>
            <div class="formwork">
              <el-button type="primary" size="small" @click="addWayName">保存为货道模板</el-button>
              <el-tooltip class="item" effect="dark" content="将当前货道设定保存为货道模板，以便以后直接选择“货道模板”，快速完成货道设置" placement="top-start">
                <el-button type="info" circle size="small"  icon="el-icon-question"></el-button>
              </el-tooltip>
              <el-select v-model="value" value-key="tpl" placeholder="请选择" style="width: 200px;"  @change="selectTrigger">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span>{{item.name}} <a style="float: right; color: blue;text-decoration: underline" @click.stop="deleteWayTpl(item.id)">移除</a></span>
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span='23' :offset='0'>
            <el-form-item label="设备货道行数" :label-width="formLabelWidth" prop="number">
              <el-input v-model="formData.tpl.rows"  @input="numeral(formData.tpl.rows)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='23' :offset='0'>
            <div v-for="(row,r_index) in formData.tpl.data">
              <div>
                <el-form-item :label="'第'+(r_index+1)+'行商品个数(列)'"
                              :label-width="formLabelWidth" >
                  <el-input v-model.number="formData.tpl.data[r_index].columns" @input = "columnsVal(formData.tpl.data[r_index].columns, r_index)"></el-input>
                </el-form-item>
                <ul class="profundityLsit clearfix" v-if="formData.tpl.data[r_index].columns !==''">
                  <div class="channelDepth">货道库存深度</div>
                  <li v-for="(d_row,d_index) in formData.tpl.data[r_index].depths">
                    <el-input v-model.number = "formData.tpl.data[r_index].depths[d_index]"></el-input>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="click_cancel">取 消</el-button>
        <el-button type="primary" @click="saveTermialWayTpl">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="模板命名"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose">
      <el-form :model="form" :rules="formLadder" ref="formLadder">
        <el-row>
          <el-col :span='23' :offset='0'>
            <el-form-item label="货道名称：" label-width="100px" prop="name">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveWay('formLadder')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../static/js/api'
  export default {
    props:{
      isterminalLadderVisible:{
        type: Boolean,
        default: false,
      },
      t_id:{
        type: Number,
        default: 0,
      }
    },
    data () {
      return {
        dialogVisible: false,
        form:{}, // 模板名称
        options: [],
        value: '',
        formData: {
          id: 0,
          name: '',
          tpl:{
            rows: '',
            data:[]
          },
        },
        formLabelWidth: '140px',
        rules: {
          rows: [{}]
        },
        formLadder: {
          name:[{required: true, message: '模板名称不能为空'}]
        }
      }
    },

    computed: {
    },
    mounted(){
      this.getWays()
    },
    methods: {
      /***
       * * * 初始化货道模板
       **/
      getWays(){
        api.getWays()
          .then(res => {
            this.options = res.data.message
          }).catch(e => {
          console.log(e)
        })
      },
      /***
       * * *关闭弹窗
       **/
      click_cancel () {
        this.$emit('update:isterminalLadderVisible', false)
        this.value = ''
        // this.formData.tpl = {}
        this.init_formData()
      },

      init_formData() {
        this.formData = {id: 0,name: '',tpl: {rows: '',data:[]} }
      },

      setFormDataTpl (tpl) {
        if(!tpl) { // 直接取默认值
          return
        }
        this.formData.tpl = JSON.parse(tpl)
      },

      /**
       * *添加货道名称
       * */
      addWayName(){
        this.dialogVisible = true
      },
      /**
       * *监听输入的设备货道行数
       * */
      numeral(val) {
        this.formData.tpl.rows = Number(val) // 将输入的货道转成number类型
        if(this.formData.tpl.rows>10){   // 限制货道行数最多十行
          this.formData.tpl.rows = 10
        }
        for (let i = 0; i < val; i++) {
          let item = {columns: '',depths:[]};
          this.formData.tpl.data.push(item)  // 根据输入的货道数生成货道
        }
        this.formData.tpl.data = this.formData.tpl.data.slice(0,this.formData.tpl.rows) // 去重push的旧货道
      },
      /**
       * * 验证商品个数最小值不能为0
       * */
      columnsVal(val,index){
        if (val<1){
          this.formData.tpl.data[index].columns = 1
          this.$notify.error({
            title: '商品个数最小值为1！'
          })
        }
        for (let i = 0; i < val; i++) {
          this.formData.tpl.data[index].depths.push('')
        }
        this.formData.tpl.data[index].depths = this.formData.tpl.data[index].depths.slice(0, val)
      },
      /**
       * * 监听选中的id匹配数据回填到表单
       * */
      selectTrigger(vId){
        let obj = {}
        obj = this.options.find((item)=>{//遍历options数据源
          return item.id === vId//筛选出匹配数据
        })
        let objJson = JSON.parse(obj.tpl)
        this.formData.tpl = objJson
      },
      /**
       * *添加货道模板
       * */
      saveWay(formLadder) {
        this.$refs[formLadder].validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            this.formData.name = this.form.name
            api.addWayTpl(this.formData)
              .then(res => {
                console.log(res)
                this.$notify.success({
                  title: '添加成功！'
                })
                this.getWays()
                this.value = this.form.name
              }).catch(e => {
              console.log(e)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      deleteWayTpl (id) {
        this.$confirm('是否删除此模板？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delWayTpl(id).then(res => {
            this.$notify.success({
              title: '成功',
              message: '模板已删除'
            })
            this.getWays()
          }).catch(e => {
            this.$notify.error({
              title: '失败',
              message: '模板未删除'
            })
          })
        }).catch(() => {
        })
      },

      handleClose(done) {
        done()
      },
      /***
       * 更新终端货道模板
       **/
      saveTermialWayTpl () {
        let data = {
          id: this.t_id,
          way_tpl: this.formData.tpl
        }
        api.saveWayTpl(data)
          .then(res => {
            this.$notify.success({
              title: '操作成功！'
            })
            this.$emit('update:isterminalLadderVisible', false)
            this.$emit('refresh')
          }).catch(e => {
          console.log(e)
        })
      }

    }
  }
</script>

<style lang='scss' scoped>
  .tag-wrapper{
    display: inline-block;
    .el-tag {
      margin-right: 10px;
    }
  }
  .tagged {
    margin-bottom: 8px;
  }
  .el-checkbox {
    width: 100px;
    margin-bottom: 10px;
  }
  .button-new-tag, .input-new-tag {
    margin: 10px 0 0 30px
  }
  .input-new-tag {
    width: 100px;
  }
  .el-radio {
    margin-bottom: 10px;
  }
</style>
<style lang="scss">
  clearfix:after{content:"";display:block;clear:both}
  .clearfix{zoom:1}
  .profundityLsit{
    margin-left: 140px;
    margin-right: -14px;
    position: relative;
    .channelDepth{
      position: absolute;
      top: 6px;
      left: -100px;
      color: #c2c2c2;
    }
    li{
      float: left;
      width: 8.5%;
      padding-right: 14px;
      margin-bottom: 20px;
      input{
        padding: 0px;
        text-align: center;
      }
    }
  }
  .formwork{
    margin-left: 12px;
    margin-bottom: 20px;
    .el-button--small.is-circle{
      padding: 0px;
      margin-right: 8px;
      border: 0px;
      background: transparent;
      .el-icon-question{
        vertical-align: middle;
        font-size: 24px;
        color: #909399;
      }
    }
    .el-input{
      width: 200px !important}
  }
</style>
