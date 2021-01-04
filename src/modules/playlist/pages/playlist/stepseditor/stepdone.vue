<template>
  <div>
    <template-content class="done" :canEdit="false" :selectItem="chiocedTemplate">
    </template-content>
  </div>
</template>
<script>
// import axios from 'axios'
import { mapState } from 'vuex'
import templateContent from '@/modules/template/components/Content.vue'

export default {
  components: {
    templateContent
  },
  watch: {
    // activeSteps (n, o) {
    //   if (n === 6) {
    //     axios.post('web/playlists', this.playlistData)
    //     .then(res => {
    //       console.log(res)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    //   }
    // }
  },
  data () {
    return {
      playlistData: []
    }
  },
  computed: {
    ...mapState({
      chiocedTemplate: state => state.playlist.chiocedTemplate,
      publishFormData: state => state.playlist.publishFormData,
      selectedFiles: state => state.playlist.selectedFiles,
      playlistselectedTerminal: state => state.playlist.playlistselectedTerminal
    })
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
  .done{
    margin: 100px auto;
  }
</style>
