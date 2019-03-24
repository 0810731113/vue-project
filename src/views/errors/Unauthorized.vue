<template>
  <div class="unauthorized">
    <img src="./images/icon_error.png" />
    <div class="tips">
      <div class="tips-title">抱歉，您无访问该页面的权限。</div>
      <div class="tips-content">
        可能因为： <br/>
        1、抱歉，您无访问该页面的权限。
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'unauthorized'
};
</script>

<style lang="scss">
.unauthorized {
  margin-top: 10%;
  margin-left: 20%;

  .tips {
    text-align: left;
    margin-left: 110px;
    display: inline-block;
    vertical-align: top;
    padding-top: 30px;

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

        &:visited {
          color: #4A90E2;
        }
      }
    }
  }
}
</style>
