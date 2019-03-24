<template>
  <div class="not-found">
    <div class="content">
      <img class="icon-error" src="./images/icon_error.png" />
      <div class="tips">
        <div class="tips-title">抱歉，您所要访问的页面不存在。</div>
        <div class="tips-content">
          可能因为： <br/>
          1、、系统找不到请求的页面<br/>
          2、输入的网址不正确
        </div>
        <div class="tips-method">您可以：</div>
        <div class="tips-link">
          <router-link class="link" to="/index">> 返回 首页</router-link><br/>
          <a class="link" @click="onClickBack">> 返回 上一页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    onClickBack () {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.not-found {
  height: 100%;
  width: 100%;

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 30%;
    width: 50%;
    margin: -10% 0 0 -20%;
  }

  .icon-error {
    vertical-align: sub;
  }

  .tips {
    text-align: left;
    margin-left: 110px;
    display: inline-block;

    .tips-title {
      font-size: 20px;
      color: #393D54;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .tips-method,
    .tips-content {
      font-size: 14px;
      color: #212121;
      line-height: 28px;
    }

    .tips-method {
      padding: 12px 0;
    }

    .tips-link {
      .link {
        text-decoration: none;
        color: #4A90E2;
        line-height: 24px;
        cursor: pointer;

        &:visited {
          color: #4A90E2;
        }
      }
    }
  }
}
</style>
