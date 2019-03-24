<template>
  <el-form ref="form" :model="form" class="mw-form shop-list" :rules="rules" label-width="120px">
    <el-form-item label="门店ID" prop="shopGUID">
      <el-input v-model="form.shopGUID" placeholder="请输入门店ID" :disabled="isEdit" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="门店名称" prop="shopName">
      <el-input v-model="form.shopName" placeholder="请输入门店名称" :disabled="isEdit" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="门店代码" prop="shopId">
      <el-input v-model="form.shopId" :disabled="isEdit" placeholder="请输入门店代码" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="门店别名" prop="shopAlias">
      <el-input v-model="form.shopAlias" placeholder="请输入门店别名" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入电子邮件" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="电话" prop="tel">
      <el-input v-model="form.tel" placeholder="请输入电话" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="传真" prop="fax">
      <el-input v-model="form.fax" placeholder="请输入传真" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="所属区域">
      <citys :selected="form.selected" :getSelectValue="getSelectValue" />
    </el-form-item>
    <el-form-item label="地址" prop="addr">
      <el-input v-model="form.addr" placeholder="请输入地址" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="邮编" prop="postal">
      <el-input v-model="form.postal" placeholder="请输入邮编" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="联络人" prop="contact">
      <el-input v-model="form.contact" placeholder="请输入联络人" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="联络人手机" prop="cellphoneCt">
      <el-input v-model="form.cellphoneCt" placeholder="请输入联络人手机" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="门店说明" prop="shopDesc">
      <el-input v-model="form.shopDesc" placeholder="请输入门店说明" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="餐饮业态" prop="foodTradeId">
      <el-select v-model="form.foodTradeId" class="restaurant-type">
        <el-option
          v-for="item in options"
          :key="item.name"
          :label="item.name"
          :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="许可号" prop="licenceCode">
      <el-input v-model="form.licenceCode" placeholder="请输入许可号" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.note" placeholder="请输入备注" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="是否开启外卖">
        <el-switch v-model="form.isTakeAway" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" active-value="1" inactive-value="0" />
    </el-form-item>
    <el-form-item label="状态" v-if="false">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Citys } from 'components';
import { validateNumber, validateShopName, validateName, validatePhone, validateMobile } from 'utils/validateUtil';
import { ERROR_INVALID_EMAIL } from 'constant/errorMessage';
import { TRADE_TYPE, ON_TEXT, OFF_TEXT, INPUT_MAX_LENGTH } from 'constant/constants';
import { TRUE, FALSE, OK, FORBIDDEN } from 'constant/statusCode';

export default {
  name: 'shopList',
  components: {
    Citys
  },
  data () {
    return {
      OK,
      TRUE,
      FALSE,
      ON_TEXT,
      OFF_TEXT,
      FORBIDDEN,
      INPUT_MAX_LENGTH,
      options: TRADE_TYPE,
      form: {
        shopName: '',
        shopId: '',
        shopAlias: '',
        email: '',
        tel: '',
        fax: '',
        addr: '',
        postal: '',
        contact: '',
        cellphoneCt: '',
        shopDesc: '',
        foodTradeId: '',
        licenceCode: '',
        note: '',
        selected: [],
        provinceId: '',
        cityId: '',
        districtId: '',
        isTakeAway: '0',
        status: 1
      },
      isEdit: !!this.$route.params.shopId,
      rules: {
        shopGUID: [
          { required: true, message: '请输入门店ID', trigger: 'blur, change' },
          { validator: validateNumber, trigger: 'blur, change' }
        ],
        shopName: [
          { required: true, message: '请输入门店名称，最多80字符!', trigger: 'blur, change' },
          { validator: validateShopName, trigger: 'blur, change' }
        ],
        email: [{ type: 'email', message: ERROR_INVALID_EMAIL, trigger: 'blur, change' }],
        tel: [{ validator: validatePhone, trigger: 'blur, change' }],
        cellphoneCt: [{ validator: validateMobile, trigger: 'blur, change' }],
        contact: [{ validator: validateName, trigger: 'blur, change' }],
        foodTradeId: [{ required: true, message: '请选择正确的餐饮业态!', trigger: 'blur, change' }]
      }
    };
  },
  computed: mapState({
    shopDetail: state => state.shopManagement.shopList.shopDetail
  }),
  async created () {
    const { shopId } = this.$route.params;

    if (this.isEdit) {
      await this.fetchManageShopDetail({ operateShopGUID: shopId });
      const { provinceId, cityId, districtId } = this.shopDetail;
      this.form = { ...this.form, ...this.shopDetail, selected: [provinceId, cityId, districtId] };
    } else {
      this.form = { ...this.form };
    }
  },
  methods: {
    ...mapActions([
      'fetchManageShopDetail',
      'saveManageShopInfo',
      'updateManageShopInfo'
    ]),
    getSelectValue (data) {
      const [provinceId, cityId, districtId] = data;
      this.form = { ...this.form, provinceId, cityId, districtId };
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      if (this.isEdit) {
        await this.updateManageShopInfo({ dto: this.form });
      } else {
        await this.saveManageShopInfo({ dto: this.form });
      }

      const { errorStatus } = this.$store.state.error;
      if (!errorStatus) {
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
  .shop-list {
    width: 46%;
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
