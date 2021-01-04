.<template>
  <div style="position:relative;height: 100%;background-color: #ffffff">
    <div class="text-center welcome">
      <!-- <img src="../../static/images/logo_blue.png" /> -->
      <h2>欢迎使用<span>易秀</span>多媒体发布系统</h2>
      <small class="bottom">Copyright © 2011 - {{ new Date().getFullYear() }} 易秀</small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .welcome {
    position: absolute;
    width: calc(100% - 64px);
    top: 20%;
    h2 {
      font-size: 30px !important;
      span {
        color: #409EFF;
      }
    }
  }

  .bottom {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: calc(100% + 64px);
    height: 30px;
    z-index: 9999;
  }
</style>
