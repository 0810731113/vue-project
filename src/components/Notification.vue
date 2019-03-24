<template>
  <div class="el-notification mw-notification" v-show="show">
    <i class="el-notification__icon el-icon-circle-cross"></i>
    <div class="el-notification__group is-with-icon">
      <div class="el-notification__content">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
.mw-notification {
  right: 20px;
  top: 100px;
  z-index: 2000;
  background: rgba(243, 107, 95, .11);
  border: 1px solid #E55D51;
  border-radius: 3px;
  padding: 10px 15px;

  .el-notification__icon {
    width: 20px;
    height: 20px;
    font-size: 20px;
  }

  .is-with-icon {
    margin-left: 25px;
  }

  .el-notification__group {
    .el-notification__content {
      color: #E55D51;
      margin: 2px 0 0;
    }
  }
}
</style>
