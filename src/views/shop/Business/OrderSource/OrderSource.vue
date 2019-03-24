<template>
  <el-form
    class="mw-form order-source-main"
    label-width="120px"
    ref="form"
    :rules="rules"
    :model="form"
    @submit.prevent.native
  >
    <el-form-item label="订单来源名称" prop="billSourceName">
      <el-input placeholder="请输入订单来源名称" v-model.trim="form.billSourceName" :maxlength='30' />
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number placeholder="请输入排序" class="width-full" :controls="false" :min="0" :max="SORT" v-model.number="form.sort" />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button native-type='submit' type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT, SORT } from 'constant/constants';

export default {
  name: 'orderSource',
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      SORT,
      form: {
        billSourceId: 0,
        billSourceName: '',
        sort: 0,
        status: OK
      },
      rules: {
        billSourceId: [
          { required: true, message: '请输入订单来源代号' }
        ],
        billSourceName: [
          { required: true, message: '请输入订单来源名称' }
        ],
        sort: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须是正整数' }
        ]
      },
      isEdit: !!this.$route.params.id
    };
  },
  async created () {
    const { id } = this.$route.params;

    if (id) {
      await this.fetchOrderSourceDetail(id);
      this.initData(this.orderSourceDetail);
    } else {
      await this.getOrderSourceLastId();
      this.form.billSourceId = this.lastId;
    }
  },
  computed: mapState({
    orderSourceDetail: state => state.business.orderSource.orderSourceDetail,
    lastId: state => state.business.orderSource.lastId,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'saveOrderSource',
      'updateOrderSource',
      'getOrderSourceLastId',
      'fetchOrderSourceDetail'
    ]),
    initData (editData) {
      this.form = { ...editData, sort: +editData.sort };
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      this.isEdit ? await this.updateOrderSource(this.form) : await this.saveOrderSource(this.form);
      if (!this.errorStatus) {
        this.$router.back();
      }
    },
    onCancel () {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.order-source-main {
  .sort-input {
    width: 100% !important;
  }

  .operation-item {
    .el-form-item__content {
      margin-left: 50px !important;
    }
  }
}
</style>
