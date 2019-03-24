<template>
  <el-dialog custom-class="base-modal classify-modal" :visible.sync="isShow" size="small">
    <el-table border :data="data" max-height="400">
      <el-table-column align="center" label="门店ID" prop="shopId" />
      <el-table-column align="center" label="门店名称" prop="shopName" />
      <el-table-column align="center" label="总店名称" prop="companyName" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'versionModal',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isShow: false
    };
  }
};
</script>
