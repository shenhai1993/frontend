<template>
  <div class='playListEditor p-10'>
    <div>
      <el-steps :active="activeSteps" finish-status="success" direction="vertical" align-center>
        <el-step title="场景"></el-step>
        <el-step title="内容"></el-step>
        <el-step title="播出单"></el-step>
        <el-step title="拼接屏"></el-step>
        <!-- <el-step title="完成/预览"></el-step> -->
      </el-steps>
    </div>
    <div>
      <!-- <router-link :to="{path: '/playlist/index'}" class="goback">
        <el-button>返回</el-button>
      </router-link> -->
      <!--
          isnextStep: 是用来判断是否进入下一步，在每一步中都会在watch中进行判断
          activeSteps: 记录当前是第几步
       -->
      <div class="content">
        <section v-show="activeSteps === 0">
          <stepone-choice :canNext.sync='canTplNext' @selectTemplate="selectTemplate"></stepone-choice>
        </section>

        <section v-show="activeSteps === 1">
          <steptwo-addcontent :canNext.sync='canContentNext'
                              :activeSteps='activeSteps'></steptwo-addcontent>
        </section>

        <section v-show="activeSteps === 2">
          <stepthree-edit :canNext.sync='canFormNext'
                          :activeSteps='activeSteps'></stepthree-edit>
        </section>

        <section v-show="activeSteps === 3">
          <stepfour-terminal :canNext.sync='canGroupNext'
                             :activeSteps='activeSteps'></stepfour-terminal>
        </section>

        <section v-show="activeSteps === 6">
          <step-done :activeSteps='activeSteps'></step-done>
        </section>
      </div>

      <div class="footer p-10">
        <el-button @click="previous" :disabled="activeSteps === 0 || (activeSteps === 1 && $route.params.cid !== undefined)">上一步</el-button>
        <el-button @click="next" :disabled="!canNext">下一步</el-button>
        <el-button @click="submit(false)" :disabled='!canGroupNext || activeSteps !== 3'>保存并发布</el-button>
        <el-button @click="submit(true)" :disabled="!canGroupNext || activeSteps !== 3">保存</el-button>
        <router-link to="/mpdp/playlist/lists" class="m-l-10">
          <el-button>取消</el-button>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script>
// 关于下一步的方案
// 1. 每一个步骤，都包含一个 canNext 的变量，最开始是不允许的。数据填写完成后改变值
// 2. 监听每一步值的变化，在每一次变化后，根所当前页面的index和当前页面对应的canNext，更新“下一步”的状态
// 3. ss
import { mapState, mapMutations, mapActions } from 'vuex'
import steponeChoice from './stepseditor/steponechoice.vue'
import steptwoAddcontent from './stepseditor/steptwoaddcontent.vue'
import stepthreeEdit from './stepseditor/stepthreeedit.vue'
import stepfourTerminal from './stepseditor/stepfourterminal.vue'
import stepDone from './stepseditor/stepdone.vue'
import http from '../../../../../static/js/utils/http'

export default {
  components: {
    stepthreeEdit, steponeChoice, steptwoAddcontent, stepfourTerminal, stepDone
  },

  data () {
    return {
      notPre: false,
      activeSteps: 0,
      isnextStep: 1,
      canTplNext: false,
      canContentNext: false,
      canFormNext: false,
      canGroupNext: false,
      activeItem: [],
      playlists: [],
      selectTemplateState: false,
      activeItemTimeout: -1
    }
  },

  computed: {
    ...mapState({
      'lists': state => state.mpdp.lists,
      'editItem': state => state.mpdp.editItem,
      'playlistselectedGroup': state => state.mpdp.playlistselectedGroup
    }),
    canNext () {
      if (this.activeSteps === 0) {
        return this.canTplNext
      }
      if (this.activeSteps === 1) {
        return this.canContentNext
      }
      if (this.activeSteps === 2) {
        return this.canFormNext
      }
      // if (this.activeSteps === 3) {
      //   return this.canGroupNext
      // }
      return false
    }
  },

  mounted () {
    if (this.$route.params.cid) {
      http.get('/mpdp/playlists/' + this.$route.params.cid).then((res) => {
        this.activeItem = res.data.message

        if (this.selectTemplateState) {
          this.setActiveItem()
        } else {
          this.setActiveItemTimeout()
        }
      })
    } else {
      this.PUT_EDITOR_PLAYLIST_MPDP(this.activeItem)
    }
  },

  methods: {
    ...mapMutations([
      'SET_REGION_ELEMENTS_MPDP',
      'IS_NEXT_STEP_MPDP',
      'PUT_EDITOR_PLAYLIST_MPDP',
      'ADD_SELECTED_ELEMENT_MPDP'
    ]),

    ...mapActions([
      'pubSaveMpdpPlaylist'
    ]),

    previous () {
      if (this.activeSteps > 0) this.activeSteps--
      // if (this.activeSteps === 5) this.activeSteps -= 2
    },

    next () {
      if (this.activeSteps < 4) this.activeSteps++
      // if (this.activeSteps === 4) this.activeSteps += 2
      // debugger
    },

    async submit (isonlySave) {
      if (this.playlistselectedGroup.type == 2 && this.playlistselectedGroup.trees.length == 0 && this.playlistselectedGroup.tags.length == 0) {
        this.$alert('您选择的是“按分组发布”，请勾选要发布的分组或标签。', '提示', {
          confirmButtonText: '知道了',
          type: 'warning'
        })
        return
      }
      let res = await this.pubSaveMpdpPlaylist(isonlySave)
      if (res === 'ok') {
        this.$router.push('/mpdp/playlist/lists')
      }
    },

    selectTemplate (v) {
      this.selectTemplateState = true
    },

    setActiveItem () {
      // 在selectedFiles中添加已有的素材
      const keys = Object.keys(this.activeItem.content.elements)
      //this.activeItem.content.elements.data = []
      for (let i = 0; i < keys.length; i++) {
        this.activeItem.content.elements.data = this.activeItem.content.elements[keys[i]]
        this.activeItem.content.elements.isedit = true
        this.activeItem.content.elements.index = keys[i]
        this.ADD_SELECTED_ELEMENT_MPDP(this.activeItem.content.elements)
      }
      this.PUT_EDITOR_PLAYLIST_MPDP(this.activeItem)
      if (this.activeSteps === 0) {
        this.next()
      }
    },

    setActiveItemTimeout () {
      if (this.selectTemplateState) {
        clearTimeout(this.activeItemTimeout)
        this.setActiveItem()
      } else {
        this.activeItemTimeout = setTimeout(() => {
          this.setActiveItemTimeout()
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .playListEditor {
    height: 100%;
    background-color: #fff;
    position: relative;
    > div {
      height: 100%;
      &:nth-child(1) {
        float: left;
        width: 180px;
      }
      &:nth-child(2) {
        margin-left: 200px;
        .content {
          height: calc(100% - 60px);
          overflow-y: auto;
          position: relative;
        }
      }
    }
    .footer {
      position: absolute;
      bottom: 0;
      background-color: #fff;
      z-index: 10;
    }
  }
</style>
