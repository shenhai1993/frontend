<template>
<div class="tpl-editor-wrapper">
  <div v-if="editable">
    <el-tooltip class="item" effect="dark" content="选择模板方向" placement="bottom" style="vertical-align: middle;height: 40px;">
      <el-select v-model="direction" placeholder="请选择" @change="onchange" class="direct">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-tooltip>

    <el-button-group>
      <el-tooltip class="item" effect="dark" content="添加视频区域" placement="bottom">
        <el-button @click="create('video')" :disabled=" createTypeStu === 0"><i class="el-icon-caret-right"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加图片区域" placement="bottom">
        <el-button @click="create('image')"><i class="el-icon-picture"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加网页区域" placement="bottom">
        <el-button @click="create('webpage')"><i class="el-icon-tickets"></i></el-button>
      </el-tooltip>
     <!-- <el-tooltip class="item" effect="dark" content="添加文本区域" placement="bottom">
        <el-button @click="create('text')"><i class="el-icon-edit"></i></el-button>
      </el-tooltip>-->
      <el-tooltip class="item" effect="dark" content="添加信源区域" placement="bottom">
        <el-button @click="create('tv')" :disabled=" createTypeStu === 1"><i class="el-icon-more"></i></el-button>
      </el-tooltip>
    </el-button-group>

    <el-button-group>
      <el-tooltip class="item" effect="dark" content="添加日期区域" placement="bottom">
        <el-button @click="create('date')"><i class="el-icon-date"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加时钟区域" placement="bottom">
        <el-button @click="create('time')"><i class="el-icon-time"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加城市" placement="bottom">
        <el-button @click="create('city')"><i class="el-icon-location"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加温度" placement="bottom">
        <el-button @click="create('weathertemplate')"><i class=" el-icon-stopwatch"></i></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加天气" placement="bottom">
        <el-button @click="create('weatherimg')"><i class="el-icon-sunny"></i></el-button>
      </el-tooltip>
      <!-- <el-button @click="create('date')">星期</el-button> -->
      <!-- <el-button @click="create('weather')">天气</el-button> -->
    </el-button-group>

    <!-- <el-button @click="create('weather')">温度</el-button>
    <el-button @click="create('weather')">城市</el-button> -->

    <el-dropdown class="dropdown" @command="ondropclick">
      <el-button>
        <i class="fa fa-save"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="save">保存</el-dropdown-item>
        <el-dropdown-item command="saveas">另存为</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-button-group>
      <el-tooltip class="item back" effect="dark" content="返回列表" placement="bottom">
        <el-button @click="toTplList"><i class="el-icon-arrow-left"></i></el-button>
      </el-tooltip>
    </el-button-group>

    <!-- <el-select v-model="scale" @change="onchange" placeholder="请选择" :disabled="disabled">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select> -->
  </div>

  <div ref="template" id="template" class="template"></div>
  <div class="position-progress">
    <el-card v-if="helper" id="helper" class="border">
      <!-- <div id="type"></div> -->
      <div slot="header">区域信息</div>
      <div>
        <span>宽：</span>
        <span id="width"></span>
      </div>
      <div>
        <span>高：</span>
        <span id="height"></span>
      </div>
      <div>
        <span>x:</span>
        <span id="x"></span>
      </div>
      <div>
        <span>y:</span>
        <span id="y"></span>
      </div>
      <!-- <input type="color" /> -->
    </el-card>
    <el-card>
      <div class="progressBox" >
        <div class="progressBtn">
          <span v-if="this.percentage!==100">{{percentage}}%</span>
          <el-button size="mini" icon="el-icon-minus" @click="decrease"></el-button>
          <el-button size="mini" icon="el-icon-plus" @click="increase"></el-button>
        </div>
      </div>
    </el-card>
  </div>

  <el-dialog @close="_hideDialog('showForm')" title="保存模板" :visible.sync="showForm" width="35%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm">
      <el-form-item label="模板名称" prop="tplname">
        <el-input v-focus autofocus v-model="ruleForm.tplname" size="medium"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="_hideDialog('showForm')">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import $ from 'jquery'

import Template from '../lib/template'
import { getZoomRate } from '../lib/utils'

import http from '@static/js/utils/http'

export default {
  props: ['canvas', 'editable', 'file', 'tpldata', 'helper'],
  data(){
    return {
     // isDisabled: false
    }
  },
  async mounted () {
    let id = this.$route.params.id
    let tpldata = null

    /* if (id) {
      // let res = await http.get(`templates`, { id: id })
      // tpldata = res.data.message[0]
      tpldata = this.$store.state.selectItemData

      if (!tpldata) {
        return this.$alert('模板不存在，请返回重试！', '提示', {
          callback: () => {
            this.$router.push('/tpl/list')
          }
        })
      }
      this.direction = tpldata.direction
    } */
    // 无tpldata时取0
    this.direction = (tpldata && tpldata.direction) || 0

    // 可能是content调用这里 无模板id(上面的参数是内容id), 不能走上面返回 "模板不存在，请返回重试"

    let rate = getZoomRate($(this.canvas), this.direction)
    this.rate = rate
    // 创建模板对象实例
    this.template = new Template({
      container: '.template',
      editable: this.editable,
      file: this.file,
      // tpldata: tpldata,
      direction: this.direction,
      rate: rate,
      tpldata: this.tpldata
    })

    this.template.on('changed', () => {
      this.tplchanged = true
    })

    this.template.on('region_click', (region) => {
      this.$emit('regionClick', region)
    })

    this.template.on('region_plus', (region) => {
      this.$emit('regionPlus', region)
    })

    // 监听窗口refresh和close事件
    // window.onbeforeunload = function (e) {
    //   if (this.tplchanged) return '您的模板已修改，但尚未保存，您确定离开吗？'
    // }

    // improve me!
    // this.$router.beforeEach((to, from, next) => {
    //   if (from.name && from.name.indexOf('editor') > -1) {
    //     if (this.tplchanged) {
    //       if (!window.confirm('您的模板已修改，但尚未保存，您确定离开吗？')) {
    //         return
    //       } else {
    //         // 销毁模板及其内部的dom、event、timer等
    //         // this.template.destroy()

    //         this.tplchanged = false
    //         window.onresize = undefined
    //         window.onbeforeunload = undefined
    //       }
    //     }
    //   }
    //   next()
    // })

    // 监听window窗口resize事件
    window.onresize = e => {
      let rate = getZoomRate($(this.canvas), this.direction)

      if (this.rate !== rate) { // improve me! maybe watch is the better choice
        this.rate = rate
        this.template.zoom(rate)
      }
    }
  },

  watch: {
    tpldata: function (data, oldData) {
      if (typeof data !== 'undefined') {
        this.editTemplateData = data.regions
      }
      this.template && this.template.reload(data)
      this.direction = this.tpldata ? this.tpldata.direction : 0
    },
    percentage(n){
      document.getElementById('template').style.zoom =  this.percentage + '%'
    },
    templateList (nv, ov) {
      if (nv.length>0){
        nv.forEach((item) =>{
          if (item.t.type==='video'){
             this.createTypeStu = 1
             throw  Error() // 故意报错跳出循环
          } else if (item.t.type==='tv') {
              this.createTypeStu = 0
            throw  Error('') // 故意报错跳出循环
          } else {
            this.createTypeStu = 2
          }
        })
      } else {this.createTypeStu = 2}
    },
    editTemplateData(na, ov) {
      if (na.length>0){
        na.forEach((item) =>{
          if (item.type==='video'){
            this.createTypeStu = 1
            throw  Error() // 故意报错跳出循环
          } else if (item.type==='tv') {
            this.createTypeStu = 0
            throw  Error() // 故意报错跳出循环
          } else {
            this.createTypeStu = 2
          }
        })
      } else {this.createTypeStu = 2}
    }
  },

  data () {
    return {
      direction: 0,
      scale: '1', // 暂时不用
      showForm: false,
      createTypeStu: 2,
      disabled: true,
      savable: false,
      tplchanged: false,
      templateList: [],
      editTemplateData: [],
      percentage: 100,
      options: [{
        value: 0,
        label: '横屏'
      }, {
        value: 1,
        label: '竖屏'
      }],
      ruleForm: {
        tplname: ''
      },
      rules: {
        tplname: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    create: function (type) {
      this.templateList = this.template.getRegions()
      this.template.createRegion({ type: type })
    },
    increase() {
      this.percentage += 10
      if (this.percentage > 100) {
        this.percentage = 100
      }
    },
    decrease() {
      this.percentage -= 10
      if (this.percentage < 10) {
        this.percentage = 10
      }
    },
    onchange: function (val) {
      if (this.tplchanged) {
        if (!window.confirm('您的模板已修改，但尚未保存，您确定离开吗？')) {
          // this.direction = val == '1' ? 0 : val
          return
        }
      }

      this.tplchanged = false
      this.direction = val
      this.template.destroy()

      let rate = getZoomRate($(this.canvas), this.direction)
      this.rate = rate

      this.template = new Template({
        container: '.template',
        editable: this.editable,
        file: this.file,
        // tpldata: this.tpldata,
        direction: this.direction,
        rate: rate
      })
      this.template.on('changed', () => {
        this.tplchanged = true
      })
    },
    ondropclick (cmd) {
      let regions = this.template.getRegions()
      if (regions.length === 0) {
        this.$notify.warning({
          title: '警告',
          message: '模板内至少需要一个区域！'
        })
        return
      }

      let id = (this.tpldata && this.tpldata.id) || null
      if (id && cmd === 'save') { // 修改模板信息
        if (this.tpldata.use_status === 1) { // improve me! ajax check use_status
          return this.$notify.warning({
            title: '提示',
            message: '模板使用中不能修改，请使用另存为！'
          })
        }

        this.modify(id)
      } else {
        this._showDialog('showForm')
      }
    },

    modify (id) {
      console.log('modify template')
      let json = this.template.toJSON()
      http.put(`templates/${id}`, json)
        .then(res => {
          this.showForm = false // 隐藏表单dialog
          this.$notify({
            title: '成功',
            message: '模板保存成功',
            type: 'success'
          })
        })
        .catch(e => {
          console.log(e.message)
        })
    },

    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // this.isDisabled = true
          let json = this.template.toJSON()

          json.name = this.ruleForm.tplname
          console.log('create template')
          http.post('templates', json)
            .then(res => {
              this._hideDialog('showForm') // 隐藏表单dialog
              this.tplchanged = false // 模板是否被修改置为false
              // this.isDisabled = false
              this.tpldata = res.data.message
              if (res.data.success){
                this.$notify({
                  title: '成功',
                  message: '模板保存成功',
                  type: 'success'
                })
                this.$router.push('/tpl/list')
              } else {
                this.$notify({
                  title: '失败',
                  message:  res.data.message ,
                  type: 'error'
                })
              }
            })
            .catch(e => {
              console.log(e.message)
            })
        } else {
          return false
        }
      })
    },

    toTplList () {
      this.$router.push('/tpl/list')
    }
  }
}
</script>

<style lang="scss">
@import 'jquery-ui/themes/base/draggable.css';
@import 'jquery-ui/themes/base/resizable.css';

.direct {
  width: 100px;
  top: -8px; // 浏览器兼容性不知，improve me!
}

.tpl-editor-wrapper {
  .template {
    display: inline-block;
    margin-top: 15px;
    position: relative;
    /* zoom: 0.8; */
    /* width: 1024px;
    height: 668px; */
    background-color: #999999;
    /* position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%); */
  }

  .region {
    position: absolute;
    width: 150px;
    height: 150px;
    text-align: center;
    opacity: 0.7;
    font-size: 15px;
    &:hover {
      .right {
        display: inline;
      }
    }
  }

  .selected {
    opacity: 1.0;
  }

  .video {
    background-color: #409EFF;
  }

  .image {
    color: white;
    background-color: #F56C6C;
  }

  .webpage {
    color: white;
    background-color: #67C23A;
  }

  .text {
    color: white;
    background-color: #b8aebe;
  }
  .tv {
    color: white;
    background-color: #E6A23C;
  }

  .date {
    text-align: left;
    width: auto;
    height: auto;
    color: white;
    text-align: left;
    background: rgba(48, 49, 51, 1);
    user-select: none;
    .right {
      position: absolute;
      top: 15px;
      right: 0px;
      display: none;
    }
  }
  .city, .weathertemplate{
    color: white;
    background-color: rgba(48, 49, 51, 1);
    display: inline-block;
    width: auto;
    height: auto;
    user-select: none;
    .right {
      top: 15px;
      left: calc(50% - 4px);
      position: absolute;
      display: none;
    }
  }
  .time {
    display: inline-block;
    width: auto;
    height: auto;
    color: white;
    text-align: left;
    background: rgba(48, 49, 51, 1);
    user-select: none;
    .right {
      top: 15px;
      right: 0px;
      position: absolute;
      display: none;
    }
  }

  .weatherimg {
    color: white;
    background: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABOAFoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDx+iiiuozCiiigAooooAKKKKACiiigAooooAKKKKACiilVtrq20NtIOD0P1oAStW10X7T4Z1DWBPt+yTRxeVt+9vzzmr+vnRNUhs77RYjb3s7eXcacik7Wx95fYmtez8F+Ml8OXVhHYwJbXTpM8cjqJMrnGOeOtcFXFxVOMm+RtrSWmz1/A1jTbdkr+hwlFdBpFnp+kazP/wAJRBPGbVN6WhTmZ88KT/d71lane/2lqU955EUAlbIiiXCoOwArpjV5puKWlt+ny7kONlcqUUUVsSFFFFABRRRQAVu6P4UvNasvtUF5p0Kbym24uQjcd8HtWFRgdwPyrOpGco2g7P0uUmk9T034YaFHD4n1NrowzT6eqojRtvQM2csD34Feu4rwLwhqGo+E3TX3tHbSZ2+zyHON/f5R3IxXrEXj/wAMS23n/wBrQoMco4IYe2K+NzrDV6mI9pFcy0Wmuq3Wm2utvM9TCVIRhyvRnOfF7ToH0S01HYBcRTCLdjkqwPB/LNcFL4Shi097keJdHcrH5nkrKd54ztHvXQeKtcufiBfDTNChMlraI0+HIV5iOCQD1x2FedspRirqVZTggjkGvcyujWhho0pT5ZLVrRuz29DjxE4yqOSWgn6UUUV7RyhRRRQAUUUUAFKDyOAcHoe9JRQBra34ivdeeH7R5ccECBIbeEbY4x7D1q7odja3HhbxHczQK9xbxRGF26oS2Dj8K5ylDMoIDMAeoB4Nc8qCVNU6fupNfg7/AIl82t3qS2d5cafeRXdpK0M8TbkdTyD/AIVNqupz6xqU1/crEs0uC/lJtBOOuKp0VryR5ue2u1ybu1goooqxBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//2Q==");
    background-size: 100% 100%;
    display: inline-block;
    line-height: 1;
    width: auto;
    height: auto;
    user-select: none;
    .right {
      top: 25px;
      left: calc(50% - 4px);
      position: absolute;
      display: none;
    }
  }
  .ui-resizable {
    .right {
      position: absolute;
      top: 3px;
      right: 3px;
      display: none;
    }
  }
  .center {
    position: absolute;
    width: 20px;
    top: calc(50% - 10px);
    left: calc(50% - 10px);
    font-size: 20px;
  }

  #helper {

  }
  .position-progress{
    width: 150px;
    display: inline-block;
    margin: 15px;
    font-size: 16px;
    vertical-align: top;
    .el-card{
      margin-bottom: 15px;
    }
    .el-card__header {
      padding: 8px 20px;
    }
    .progressBtn{
      text-align: center;
      .el-button--mini{
        padding: 7px;
      }
    }
  }
  .dropdown {
    top: -8px;
  }

  .back {
    left: 2px;
  }
}
</style>
