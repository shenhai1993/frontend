<template>
  <video id="videoElement" controls width="100%" muted height="auto"></video>
</template>


<script>
    export default {
      props:{
        flvSrc:{
          type: String,
          default: ''
        },
        vType: {
          type: String,
          default: 'flv'
        }
      },
      data(){return{
        player : null,
        playing: false,
      }},
      created(){
      },
      mounted(){
        if(flvjs.isSupported()){
          let videoBox = document.querySelector('#videoElement')
          // let videoBox = this.$refs[this.boxname];
          let flvPlayer = flvjs.createPlayer({
            type: this.vType,
            url: this.flvSrc,
            cors:true,
            isLive: true,
          },{
            enableWorker: true,
            enableStashBuffer: false,
            stashInitialSize: 128,
          })
          flvPlayer.attachMediaElement(videoBox)
          flvPlayer.load()
          flvPlayer.play()
          this.player = flvPlayer
        }
      },
      methods:{
      }
    }
</script>

<style>
</style>
