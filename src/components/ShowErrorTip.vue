<template>
  <div v-if="showError" class="el-tooltip__popper mw-tooltip" x-placement="right">
    {{errorText}}
    <div x-arrow="" class="popper__arrow" style="top: 6px;"></div>
  </div>
</template>

<script>
export default {
  name: 'showErrorTip',
  props: {
    showError: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
  .mw-tooltip {
    top: -2px;
    right: 0;
    z-index: 0 !important;
  }
</style>
