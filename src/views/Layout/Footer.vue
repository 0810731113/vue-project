<template>
  <el-row class="footer-wrapper">
    <el-col :span="24">
      <div class="grid-content bg-purple-dark">
        Copyright &copy 2013 - {{ fecha.format(new Date(), 'YYYY') }} 美味不用等（上海）信息科技股份有限公司 版权所有
        <a target="blank" href="http://www.miitbeian.gov.cn/" class="record-link">沪ICP备12024155号-7</a>
      </div>
      </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'Footer'
  };
</script>

<style lang="scss">
  .footer-wrapper {
    width: 100%;
    position: fixed;
    bottom: 0;
    line-height: 1;
    padding: 14px;
    font-size: 12px;
    text-align: center;
    background: #e4e4e4;
    z-index: 3999;

    .record-link {
      text-decoration: none;
    }
  }
</style>

