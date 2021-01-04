<template>
  <div class="exhibition">
    <headerbar class='headerbar'>
      <span slot='submenuName'>总览</span>
    </headerbar>
    <section class="m-15 clearfix">

      <div class="p-10">
        <overview></overview>
      </div>

      <div class="p-10">
        <chart></chart>
      </div>

    </section>
  </div>
</template>

<script>
import headerbar from '../../components/HeaderBar.vue'
import overview from './overview.vue'
import chart from './chart.vue'

export default {
  components: {
    headerbar, overview, chart
  }
}
</script>

<style lang="scss" scoped>
  .headerbar {
    margin-left: 0px;
  }
  .exhibition {
    height: 100%;
    > section {
      height: calc(100% - 85px);
      background-color: #fff;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1), 0px 0px 5px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      z-index: 10;
      > div {
        &:nth-child(1) {
          width: 300px;
          float: left;
        }
        &:nth-child(2) {
          margin-left: 300px;
        }
      }
    }
  }

</style>




