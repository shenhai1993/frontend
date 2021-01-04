<template>
  <div class="tplcanvas">
    <editor canvas=".tplcanvas" :editable="editable" :file="false" :tpldata="templateData" :helper="true"></editor>
  </div>
</template>

<script>
import Editor from '../components/Editor'
import http from '@static/js/utils/http'

export default {
  components: {
    Editor
  },

  mounted () {
    this.id = this.$route.path.split('/')
    this.id = this.id[this.id.length-1]
    http.get(`/templates/?id=${this.id}`).then( res => {
      this.templateData = res.data.message[0]
    })
    console.log(`this.templateData:==>`)
    console.log(this.templateData)
  },

  data () {
    return {
      editable: true,
      id: 0,
      templateData: null,
      // {
        // type: 0,
        // direction: 1,
        // regions: [
        //   {"id":0,"type":"video","color":"FFFF00","x":0,"y":0,"width":1080,"height":672},{"id":1,"type":"date","color":"#000000","x":607,"y":0,"width":240,"height":50},{"id":2,"type":"time","color":"#000000","x":877,"y":0,"width":180,"height":50},{"id":3,"type":"image","color":"#0000FF","x":0,"y":670,"width":520,"height":535},{"id":4,"type":"webpage","color":"#008000","x":0,"y":1205,"width":1080,"height":715},{"id":5,"type":"tv","color":"#FFA500","x":520,"y":670,"width":560,"height":532}
        // ]
      // }
      // {
      //   type: 0,
      //   regions: [ {
      //     "id": 0, "type": "image", "x": 50, "y": 50, "width": 748, "height": 456
      //   },
      //   {
      //     "id": 1, "type": "video", "x": 200, "y": 200, "width": 748, "height": 456
      //   }]
      // }
    }
  }
}
</script>

<style scoped>
.tplcanvas {
  width: 100%;
  height: 100%;
}
</style>

