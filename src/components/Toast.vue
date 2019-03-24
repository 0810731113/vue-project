<template>
  <el-dialog
    class='base-toast'
    :class="className"
    :visible.sync="isShow"
    width="20%"
    :close-on-click-modal="false"
    @close="callback"
  >
    <div :class="`icon-base icon-${type}`">
    </div>
    <div class="content">
      {{ content }}
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'toast',
  props: {
    content: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    },
    timeout: {
      type: Number,
      default: 2000
    },
    className: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'tiny'
    },
    callback: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      isShow: false
    };
  },
  watch: {
    isShow () {
      setTimeout(() => {
        this.isShow = false;
      }, this.timeout);
    }
  }
};
</script>

<style lang="scss">
.base-toast {
  .icon-base {
    height: 76px;
    width: 76px;
    margin: 0 auto;
    margin-bottom: 30px;
  }

  .icon-success {
    background-image: url('./images/icon_success.png');
  }

  .icon-warning {
    background-image: url('./images/icon_warning.png');
  }

  .icon-error {
    background-image: url('./images/icon_error.png');
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    text-align: center;
  }
}
</style>
