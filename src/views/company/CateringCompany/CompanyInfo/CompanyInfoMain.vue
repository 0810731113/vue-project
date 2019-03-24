<template>
  <el-form ref="form" :model="form" class="company-info" :rules="rules" label-width="100px">
    <el-form-item label="门店名称" prop="shopName" ref="shopName">
      <el-input :value="form.shopName" placeholder="请输入门店名称" :maxlength='INPUT_MAX_LENGTH' disabled />
    </el-form-item>
    <el-form-item label="登录号" prop="licenceCode">
      <el-input
        :value="form.licenceCode"
        placeholder="请输入登录号"
        @input="(value) => onChangeItem(value, 'licenceCode')"
        :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="餐饮业态">
      <el-select :value="form.foodTradeId" disabled class="restaurant-type">
        <el-option
          v-for="item in options"
          :key="item.name"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="电子邮件" prop="email">
      <el-input
        :value="form.email"
        placeholder="请输入电子邮件"
        @input="(value) => onChangeItem(value, 'email')"
        :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="电话" prop="tel">
      <el-input
        :value="form.tel"
        placeholder="请输入电话"
        @input="(value) => onChangeItem(value, 'tel')"
        :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="联络人" prop="contact">
      <el-input
        :value="form.contact"
        placeholder="请输入联络人"
        @input="(value) => onChangeItem(value, 'contact')"
        :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="联络人手机" prop="cellphoneCt">
      <el-input
        :value="form.cellphoneCt"
        placeholder="请输入联络人手机"
        @input="(value) => onChangeItem(value, 'cellphoneCt')"
        :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="地址">
      <el-input
        :value="form.addr"
        placeholder="请输入地址"
        @input="(value) => onChangeItem(value, 'addr')"
        :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="备注说明">
      <el-input
        :value="form.note"
        placeholder="请输入备注"
        @input="(value) => onChangeItem(value, 'note')"
        :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item style="text-align: center">
      <el-button class="btn-submit" :disabled="isMaintain" @click="onSubmit">保存</el-button>
    </el-form-item>
    <toast
      ref='toast'
      content="保存成功!"
      :timeout="2000"
      type="success"
    />
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Toast } from 'components';
import { validateShopName, validateName, validatePhone, validateMobile } from 'utils/validateUtil';
import { ERROR_INVALID_EMAIL } from 'constant/errorMessage';
import { TRADE_TYPE, INPUT_MAX_LENGTH } from 'constant/constants';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'companyInfo',
  components: {
    Toast
  },
  data () {
    return {
      INPUT_MAX_LENGTH,
      options: TRADE_TYPE,
      isMaintain: !checkMaintainRight(this),
      rules: {
        shopName: [{ validator: validateShopName, trigger: ['blur', 'change'] }],
        email: [{ type: 'email', message: ERROR_INVALID_EMAIL, trigger: ['blur', 'change'] }],
        tel: [{ validator: validatePhone, trigger: ['blur', 'change'] }],
        cellphoneCt: [{ validator: validateMobile, trigger: ['blur', 'change'] }],
        contact: [{ validator: validateName, trigger: ['blur', 'change'] }]
      }
    };
  },
  computed: mapState({
    form: state => state.cateringCompany.companyInfo.detail
  }),
  async created () {
    await this.fetchManageCompanyDetail();
  },
  methods: {
    ...mapActions([
      'fetchManageCompanyDetail',
      'saveManageCompanyInfo',
      'updateCompany'
    ]),
    onChangeItem (value, type) {
      this.updateCompany({ [type]: value.trim() });
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      await this.saveManageCompanyInfo({ dto: this.form });
      const { errorStatus } = this.$store.state.error;
      if (!errorStatus) {
        this.$refs.toast.isShow = true;
      }
    }
  }
};
</script>

<style lang="scss">
  .company-info {
    width: 53%;
    margin: auto;
    padding: 15px;

    .company-name,
    .company-id,
    .el-form-item__label {
      font-weight: 700;
      color: #666;
      padding-right: 30px;
    }

    .el-input {
      .el-input__inner {
        color: #323232;
      }
    }

    .restaurant-type {
      width: 100%;
    }
  }
</style>
