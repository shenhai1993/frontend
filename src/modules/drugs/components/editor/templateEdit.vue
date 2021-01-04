<template>
  <div class="tpl-editor-wrapper">
    <div v-if="editable">
    </div>

    <div ref="template" id="template" class="template"></div>

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
  </div>
</template>

<script>
  import $ from 'jquery'

  import Template from '../../../tpl/lib/template'
  import { getZoomRate } from '../../../tpl/lib/utils'
  import {mapMutations} from 'vuex'
  export default {
    props: ['canvas', 'editable', 'file', 'tpldata', 'helper', 'position'],
    async mounted () {
      let id = this.$route.params.id
      let tpldata = null
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
      this.template.on('edit_data', (dom) => {
        this.$emit('editData', dom,this.rate)
      })
      this.template.on('delete_data', (region) => {
        this.$emit('deleteData', region)
      })
      this.template.on('region_click', (region) => {
        this.$emit('regionClick', region)
      })

      this.template.on('region_plus', (region) => {
        this.$emit('regionPlus', region)
      })

      this.template.on('max', (region) => {
        this.$emit('onMax')
      })
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
      position: function (v, ov) {
        this.template.resetPosition(v.num, v.type)
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
        editTemplateData: [],
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
      ...mapMutations(['TOGGLE_SELECT_TPL' ]),
      create: function (type) {
        this.template.createRegion({ type: type })
        let json = this.template.toJSON()
        this.TOGGLE_SELECT_TPL({data:json.regions[Object.keys(json.regions)[Object.keys(json.regions).length - 1]]})
        // this.template.on('addTpl', () => {
        //   this.TOGGLE_SELECT_TPL({data:json.regions[Object.keys(json.regions)[Object.keys(json.regions).length - 1]]})
        // })
      },
      modify () {
        console.log(this.template)
        let json = this.template.toJSON()
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
      background: rgba(48, 49, 51, 1);
      user-select: none;
      .right {
        position: absolute;
        top: 12px;
        right: 0px;
        display: none;
      }
    }

    .time {
      text-align: left;
      display: inline-block;
      width: auto;
      height: auto;
      color: white;
      background-color: rgba(48, 49, 51, 1);
      user-select: none;
      .right {
        top: 12px;
        right: 0px;
        position: absolute;
        display: none;
      }
    }
    .city, .weathertemplate{
      color: white;
      background-color: rgba(0, 0, 0, 1);
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
        z-index: 99;
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
      width: 140px;
      display: inline-block;
      margin: 15px;
      font-size: 16px;
      vertical-align: top;
      .el-card__header {
        padding: 8px 20px;
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
