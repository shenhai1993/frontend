<template>
  <div>
    <div v-html="html" v-loading="loading"></div>
  </div>
</template>
<style>

</style>
<script>
  import http from '@static/js/utils/http'
  import {mapState} from "vuex";
  export default{
    // 使用时请使用 :url.sync=""传值
    props: {
      url: {
        required: true
      }
    },
    data () {
      return {
        loading: false,
        html: ''
      }
    },
    computed: {
      ...mapState({
        h5Regions: state => state.drugs.selectItemData
      })
    },
    watch: {
      url (value) {
        this.html = ''
        this.load(value)
      }
    },
    mounted () {
    },
    methods: {
      load (url) {
        if (url && url.length > 0) {
          // 加载中
          this.loading = true
          let regiones = JSON.parse(sessionStorage.getItem('regiones'))
          let param = {
            accept: 'text/html, text/plain'
          }
          http.get(url, param).then((response) => {
            this.loading = false
            // 处理HTML显示
            this.html = response.data
            this.$nextTick(function(){
              document.getElementById("an-scene-0").classList.add("run")
              document.getElementById("an-scene-0").classList.add("t-0")
              if (Number(this.$route.query.type)!==0 && regiones !== null){  // 当路上有type属性的时候为创建播出单 否则是编辑播
                if (regiones.tpl.dynamic){
                  for(let name in regiones.tpl.dynamic.images){
                    document.getElementsByClassName(name)[0].style.backgroundImage = 'url('+regiones.tpl.dynamic.images[name]+')'
                  }
                  for(let font in regiones.tpl.dynamic.words){
                    const strToObj = JSON.parse(regiones.tpl.dynamic.words[font])
                    document.getElementsByClassName(font)[0].firstChild.innerHTML = strToObj.content
                    document.getElementsByClassName(font)[0].style.color = strToObj.color
                    document.getElementsByClassName(font)[0].style.fontSize = strToObj.fontSize
                  }
                }
              }
            })
          }).catch(() => {
            this.loading = false
            this.html = '加载失败'
          })
        }
      }
    }
  }
</script>
