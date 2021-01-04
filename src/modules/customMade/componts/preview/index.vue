<template>
  <div>
    <el-dialog :width="(direction===0)?'2000px':'1130px'" style="zoom: 0.5;text-align: center"
               :class="{'screenBox':(direction===0)?false:true}"
               :close-on-click-modal="false"
               @close="htmlPaneClose"
               :visible.sync="htmlPanelShow">
      <html-panel :url.asyc="htmlUrl"></html-panel>
    </el-dialog>
  </div>
</template>

<script>
  import HtmlPanel from '../HtmlPanel.vue'
  export default {
    props:{
      templateurl: {
        default: '',
        type: String
      },
      direction: {
        default: 0,
        type: Number
      }
    },
    components: {
      HtmlPanel
    },
    data(){
      return{
        htmlPanelShow: false,
        htmlUrl: ''
      }
    },
    methods:{
      htmlPaneClose(){
        this.htmlPanelShow = false
        this.$emit('htmlPaneClose')
      }
    },
    watch: {
      templateurl (n) {
        if (n!==''){
          this.htmlPanelShow = true
          setTimeout(()=>{
            this.htmlUrl = n
            let str = n.lastIndexOf("/")
            let lingVal = n.substring(0,str) // 通过传过来的html连接
            const link = document.createElement('link')
            link.type = 'text/css'
            link.rel = 'stylesheet'
            link.href = lingVal+'/css/style.css'
            link.setAttribute('id', 'newCss') // 动态拼接css 并为其赋上id
            let oldCssId = document.getElementById('newCss') // 排查页面上是否已有拼接的class
            if(oldCssId) {
              document.getElementById('newCss').href = link.href // 替换拼接的css
            } else {
              document.head.appendChild(link) // 动态添加css
            }

          },200)
        }
      }
    }
  }
</script>
