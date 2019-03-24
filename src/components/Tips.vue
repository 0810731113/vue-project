<template>
  <el-tooltip class="tips-wrapper" effect="light">
    <div slot="content" v-html="content"></div>
    <el-button class="btn-tips" />
  </el-tooltip>
</template>
<script>
  export default {
    name: 'Tips',
    props: {
      content: {
        type: String,
        default: ''
      }
    }
  };

</script>
<style lang="scss">
  .tips-wrapper {
    height: 22px;
    margin-left: 0 !important;
  }
</style>
