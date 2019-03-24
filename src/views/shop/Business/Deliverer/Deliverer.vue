<template>
  <el-form
    class="mw-form"
    label-width="100px"
    ref="form"
    :rules="rules"
    :model="form"
    @submit.prevent.native
  >
    <el-form-item label="送餐者名称" prop="delivererName">
      <el-input placeholder="请输入送餐者名称" v-model="form.delivererName" :maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="配送员姓名" prop="deliverer">
      <el-input placeholder="请输入配送员姓名" v-model.trim="form.deliverer" :maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="cellphone">
      <el-input placeholder="请输入手机" v-model.number="form.cellphone"></el-input>
    </el-form-item>
    <el-form-item label="零钱额度" prop="change">
      <el-input-number placeholder="请输入零钱额度" class="input-number input-change" v-model.number="form.change" controls-position="right"/>
    </el-form-item>
    <el-form-item label="备注">
      <el-input placeholder="请输入备注" v-model="form.note" type="textarea" resize="none"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button native-type='submit' class="btn-submit" type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';
import { validateName, validateMobile } from 'utils/validateUtil';

export default {
  name: 'deliverer',
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      form: {
        delivererId: 0,
        delivererName: '',
        deliverer: '',
        change: 0.0,
        note: '',
        status: OK
      },
      rules: {
        delivererName: [
          { required: true, message: '请输入送餐者名称', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ],
        deliverer: [{ validator: validateName, trigger: ['blur', 'change'] }],
        cellphone: [{ validator: validateMobile, trigger: ['blur', 'change'] }],
        change: [
          { required: true, type: 'number', message: '请输入零钱额度' }
        ]
      },
      isEdit: !!this.$route.params.id
    };
  },
  async created () {
    const { id } = this.$route.params;

    if (id) {
      await this.fetchDelivererDetail(id);
      this.initData(this.delivererDetail);
    } else {
      await this.getDelivererLastId();
      this.form.delivererId = this.lastId;
    }
  },
  computed: mapState({
    delivererDetail: state => state.business.deliverer.delivererDetail,
    lastId: state => state.business.deliverer.lastId,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'saveDeliverer',
      'updateDeliverer',
      'fetchDelivererDetail',
      'getDelivererLastId'
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

      const { deliverer } = this.form;
      const data = { ...this.form, deliverer: deliverer || null };
      if (this.isEdit) {
        await this.updateDeliverer(data);
      } else {
        await this.saveDeliverer(data);
      }

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
  .mw-form {
    .input-change {
      width: 100%;
    }
  }
</style>
