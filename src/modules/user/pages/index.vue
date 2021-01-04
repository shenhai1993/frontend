<template>
  <div class="twoColumnLayout">
    <div>
      <side-bar :ischangeLayout='true'>
        <span slot='title' class="title">用户管理</span>
        <group-panel :edit="true" slot="component" @onclick="changeGroup" :filter="true"></group-panel>
      </side-bar>
    </div>

    <router-view>
      <span slot="submenuName">用户管理</span>
    </router-view>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import RouterView from '@/components/RouterView.vue'
import GroupPanel from '@/modules/group/components/group'

export default {
  name: 'user',
  components: {
    SideBar,
    RouterView,
    GroupPanel
  },
  data () {
    return {
      groupId: 0
    }
  },
  methods: {
    changeGroup (group) {
      this.$router.push({query: {groupId: group.id}})
    }
  }
}
</script>

<style lang="scss" scoped>
  .twoColumnLayout {
    > div {
      &:nth-child(1) {
        width: 300px;
      }
      &:nth-child(2) {
        margin-left: 300px;
      }
    }
  }
</style>
