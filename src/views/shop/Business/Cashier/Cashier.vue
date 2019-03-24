<template>
  <el-form
    class="mw-form"
    :class="editPopup"
    label-width="80px"
    ref="form"
    :rules="rules"
    :model="form"
    @submit.prevent.native
  >
    <el-form-item label="班别名称" prop="shiftName">
      <el-input placeholder="请输入班别名称" v-model="form.shiftName" :maxlength='50'></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input placeholder="请输入备注" v-model="form.note" type="textarea" resize="none" :maxlength='50'></el-input>
    </el-form-item>
    <el-form-item v-if="!guidance" class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button native-type='submit' type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { validateName } from 'utils/validateUtil';
import { ON_TEXT, OFF_TEXT, INPUT_MAX_LENGTH } from 'constant/constants';

export default {
  name: 'cashier',
  props: ['guidance', 'shiftId'],
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      INPUT_MAX_LENGTH,
      form: {
        shiftId: 0,
        shiftName: '',
        note: ''
      },
      rules: {
        shiftName: [
          { required: true, message: '请输入班别名称', trigger: 'blur, change' },
          { validator: validateName, trigger: ['blur', 'change'] }

        ]
      },
      isEdit: !!this.$route.params.id || !!this.shiftId
    };
  },
  async created () {
    const id = this.$route.params.id || this.shiftId;

    if (id) {
      await this.fetchCashierDetail(id);
      this.initData();
    } else {
      await this.getCashierLastId();
      this.form.shiftId = this.lastId;
    }
  },
  computed: {
    ...mapState({
      cashierDetail: state => state.business.cashier.cashierDetail,
      lastId: state => state.business.cashier.lastId,
      errorStatus: state => state.error.errorStatus
    }),
    editPopup () {
      return {
        'edit-or-add-pop-up': this.guidance
      };
    }
  },
  methods: {
    ...mapActions([
      'saveCashier',
      'updateCashier',
      'fetchCashierDetail',
      'getCashierLastId'
    ]),
    initData () {
      const { cashierDetail } = this;
      this.form = { ...cashierDetail };
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return validForm;

      const { isEdit, form, guidance } = this;
      const data = { ...form, noShowError: guidance };
      if (isEdit) {
        await this.updateCashier(data);
      } else {
        await this.saveCashier(data);
      }

      if (this.errorStatus) {
        return false;
      } else if (!this.guidance) {
        this.$router.back();
      }
      return validForm;
    },
    onCancel () {
      this.$router.back();
    }
  }
};
</script>
<style lang="scss">
  .edit-or-add-pop-up {
    width: 80% !important;
  }
</style>
