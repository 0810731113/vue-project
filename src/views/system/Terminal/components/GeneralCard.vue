<template>
  <div class="general-card">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">{{ data.title }}</span>
      </div>
      <span class="summary-item">
        <img class="icon-home" src="./images/icon_home.png" />
        <span class="item-count">{{ data.totalCount }}家</span>
        <span class="item-tips">门店数</span>
      </span>
      <span class="summary-item">
        <img src="./images/icon_android.png" />
        <span class="item-count">{{ data.androidCount }}家</span>
        <span class="item-tips">Android端</span>
      </span>
      <span class="summary-item">
        <img src="./images/icon_window.png" />
        <span class="item-count">{{ data.windowsCount }}家</span>
        <span class="item-tips">Windows端</span>
      </span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GeneralCard',
  props: {
    data: {
      type: Object,
      defaule: () => {}
    }
  }
};
</script>

<style lang="scss">
.general-card {
  margin-bottom: 15px;
  display: inline-block;

  .box-card {
    width: 720px;
    display: inline-block;

    .card-title {
      color: #333;
      background-color: #f5f5f5;
      border-color: #ddd;
      font-weight: 500;
    }

    .summary-item {
      width: 220px;
      font-size: 16px;
      font-weight: 600;
      position: relative;
      display: inline-block;

      .item-count {
        position: absolute;
        right: 50px;
      }

      .item-tips {
        position: absolute;
        right: 50px;
        bottom: 10px;
      }
    }
  }

  .icon-home {
    width: 55px;
    height: 58px;
  }
}
</style>
