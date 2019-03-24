<template>
  <el-form
    class="mw-form"
    label-width="120px"
    ref="form"
    :rules="rules"
    :model="form"
    @submit.prevent.native>
    <el-form-item label="结账类型名称" prop="paymentTypeName">
      <el-input placeholder="请输入结账类型名称" :maxlength="15" v-model="form.paymentTypeName" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input placeholder="请输入备注" v-model="form.note" type="textarea" resize="none" />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="() => { this.goRoute('/myd/business/payment/type') }">取消</el-button>
      <el-button native-type='submit' type="primary" @click="onSubmit" class="btn-submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';
import { validateName } from 'utils/validateUtil';

export default {
  name: 'paymentType',
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      form: {
        paymentTypeId: 0,
        paymentTypeName: '',
        note: '',
        status: OK
      },
      rules: {
        paymentTypeName: [
          { required: true, message: '请输入结账类型名称', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ]
      },
      isEdit: !!this.$route.params.id
    };
  },
  async created () {
    const { id } = this.$route.params;

    if (id) {
      await this.fetchPaymentTypeDetail(id);
      this.initData(this.paymentTypeDetail);
    } else {
      await this.getPaymentTypeLastId();
      this.form.paymentTypeId = this.lastId;
    }
  },
  computed: mapState({
    paymentTypeDetail: state => state.business.paymentType.paymentTypeDetail,
    lastId: state => state.business.paymentType.lastId,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'fetchPaymentTypeDetail',
      'getPaymentTypeLastId',
      'savePaymentType',
      'updatePaymentType',
      'clearError'
    ]),
    initData (editData) {
      this.form = { ...editData };
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      this.isEdit ? await this.updatePaymentType(this.form) : await this.savePaymentType(this.form);

      if (!this.errorStatus) {
        this.goRoute('/myd/business/payment/type');
      }
    },
    goRoute (router) {
      this.$router.push(router);
    }
  }
};
</script>
