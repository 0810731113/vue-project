<template>
  <el-dialog custom-class="base-modal notices-modal" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">查看公告通知</div>
    <el-form :model="detail" ref="form" label-width="100px" >
      <el-form-item class="text" label="公告标题">
        <span>{{detail.title}}</span>
      </el-form-item>
      <el-form-item label="发送时间">
        <span>{{detail.createTime}}</span>
      </el-form-item>
      <el-form-item class="text" label="公告内容">
        <span>{{detail.content}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'noticesModal',
  props: ['detail'],
  data () {
    return {
      isShow: false
    };
  }
};
</script>

<style lang="scss">
  .notices-modal {
    .el-form-item__label {
      font-weight: 700;
    }

    .el-dialog__body {
      padding: 30px 60px;
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .text {
      word-break: break-all;
      max-height: 200px;
      overflow: auto;
    }
  }
</style>

