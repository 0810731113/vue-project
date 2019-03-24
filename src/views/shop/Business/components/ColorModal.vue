<template>
  <el-dialog custom-class="base-modal color-modal" :visible.sync="isShow">
    <div class="modal-title" slot="title">选择颜色</div>
    <div
      v-for="color in colors"
      :key="color"
      class="circle-wrap"
      v-bind:class="{ selected: color === selectedColor }"
      v-bind:style="{ backgroundColor: color }"
      @click="selectedColor = color"
    >
    </div>
    <span slot="footer" class="modal-footer">
      <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      <el-button class="btn-cancel" @click="onShowOrHideModal">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'colorModal',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    onUpdateColor: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      isShow: false,
      selectedColor: '',
      colors: ['#79AB3C', '#F14930', '#FD8D35', '#48C2FA', '#EEDF24', '#A549C2', '#5B58DC', '#FFFFFF', '#FA7368']
    };
  },
  methods: {
    async onSubmit () {
      const { paymentId } = this.data;
      await this.onUpdateColor({ paymentId, color: this.selectedColor });
      this.onShowOrHideModal();
    },
    onShowOrHideModal () {
      this.selectedColor = '';
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss">
.color-modal {
  .el-dialog__body {
    padding: 30px 50px;
    text-align: center;
    margin: auto;
  }

  .circle-wrap {
    width: 60px;
    height: 60px;
    display: inline-block;
    border-radius: 50%;
    border: 1px solid #000;
    margin: 5px 10px;

    &.selected {
      border: 2px solid #000;
    }
  }
}
</style>
