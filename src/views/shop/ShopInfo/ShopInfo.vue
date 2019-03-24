<template>
  <el-form ref="form" :model="form" class="shop-info" :rules="rules" :style="{'width': guidance ? '90%' : '60%'}" label-width="100px">
    <el-form-item label="所属总部">
      <label class="company-name">{{ form.companyName }}</label>
      <label class="company-id">{{ form.companyGUID }}</label>
    </el-form-item>
    <el-form-item label="门店名称" prop="shopFirstName" ref="shopName">
      <el-input
        :value="form.shopFirstName"
        placeholder="请输入门店名称"
        @input="(value) => onChangeItem(value, 'shopFirstName')"
        :maxlength='INPUT_MAX_LENGTH'
      />
    </el-form-item>
    <el-form-item label="登录号" v-if="!guidance">
      <el-input
        :value="form.licenceCode"
        placeholder="请输入登录号"
        @input="(value) => onChangeItem(value, 'licenceCode')"
        :maxlength='INPUT_MAX_LENGTH'
      />
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
        :maxlength='INPUT_MAX_LENGTH'
      />
    </el-form-item>
    <el-form-item label="电话" prop="tel">
      <el-input
        :value="form.tel"
        placeholder="请输入电话"
        @input="(value) => onChangeItem(value, 'tel')"
        :maxlength='INPUT_MAX_LENGTH'
      />
    </el-form-item>
    <el-form-item label="联络人" prop="contact">
      <el-input
        :value="form.contact"
        placeholder="请输入联络人"
        @input="(value) => onChangeItem(value, 'contact')"
        :maxlength='INPUT_MAX_LENGTH'
      />
    </el-form-item>
    <el-form-item label="联络人手机" prop="cellphoneCt">
      <el-input
        :value="form.cellphoneCt"
        placeholder="请输入联络人手机"
        @input="(value) => onChangeItem(value, 'cellphoneCt')"
        :maxlength='INPUT_MAX_LENGTH'
      />
    </el-form-item>
    <el-form-item label="地址">
      <el-input
        :value="form.addr"
        placeholder="请输入地址"
        @input="(value) => onChangeItem(value, 'addr')"
        :maxlength='INPUT_MAX_LENGTH'
      />
    </el-form-item>
    <el-form-item label="备注说明">
      <el-input
        :value="form.note"
        placeholder="请输入备注"
        @input="(value) => onChangeItem(value, 'note')"
        :maxlength='INPUT_MAX_LENGTH'
      />
    </el-form-item>
    <el-form-item label="门店ID">
      <el-input :value="form.shopGUID" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="餐厅Logo">
      <mw-upload
        ref="upload"
        :dataSource = '(form.logoURL && form.logoURL.length) ? [{url: form.logoURL}] : []'
        @getImageURI='getImageURI'
        :action="getActionUrl(`base/${API_UPLOAD_LOGO}`)"
        :multipleUpload="false"
        :multipleSelect="false"
        :deleteImage="deleteImage"
        :preview="true"
        uploadTip="注意：图片最大为350K，仅支持jpg、png、jpeg和bmp图片格式，图片宽度高度不能超过512*400">
      </mw-upload>
    </el-form-item>
    <el-form-item style="text-align: center">
      <el-button class="btn-submit" @click="onUnbind" v-if="!guidance && form.unbund">解绑</el-button>
      <el-button class="btn-submit" @click="onSubmit" v-if="!guidance">保存</el-button>
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
  import { Toast, MwUpload } from 'components';
  import { API_UPLOAD_LOGO } from 'constant/API';
  import { ERROR_INVALID_EMAIL } from 'constant/errorMessage';
  import { TRADE_TYPE, INPUT_MAX_LENGTH } from 'constant/constants';
  import { validateShopName, validateName, validatePhone, validateMobile } from 'utils/validateUtil';

  export default {
    name: 'ShopInfo',
    components: {
      MwUpload,
      Toast
    },
    data () {
      return {
        API_UPLOAD_LOGO,
        INPUT_MAX_LENGTH,
        options: TRADE_TYPE,
        rules: {
          shopFirstName: [
            { required: true, message: '请输入门店名称', trigger: ['blur', 'change'] },
            { validator: validateShopName, trigger: ['blur', 'change'] }
          ],
          email: [
            { type: 'email', message: ERROR_INVALID_EMAIL, trigger: ['blur', 'change'] }
          ],
          tel: [
            { validator: validatePhone, trigger: ['blur', 'change'] }
          ],
          cellphoneCt: [
            { validator: validateMobile, trigger: ['blur', 'change'] }
          ],
          contact: [
            { validator: validateName, trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    props: {
      guidance: {
        type: Boolean,
        default: false
      }
    },
    computed: mapState({
      form: state => state.shop.shopInfo
    }),
    async created () {
      await this.fetchShopInfo();
    },
    methods: {
      ...mapActions([
        'unbindShop',
        'updateInfo',
        'fetchShopInfo',
        'updateShopInfo',
        'deleteShopInfoImage'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) {
          this.$refs.shopName.$el.scrollIntoView();
          return validForm;
        }

        await this.updateShopInfo(this.form);
        const { errorStatus } = this.$store.state.error;
        if (errorStatus) {
          return false;
        } else if (!this.guidance) {
          this.$refs.toast.isShow = true;
        }
        return validForm;
      },
      async onUnbind () {
        await this.unbindShop();
        this.updateInfo({ unbund: false });
      },
      onChangeItem (value, type) {
        this.updateInfo({ [type]: value.trim() });
      },
      getImageURI (path) {
        this.updateInfo({ 'logoURL': path });
      },
      deleteImage (fileName) {
        this.deleteShopInfoImage({ fileName });
      }
    }
  };
</script>

<style lang="scss">
  .shop-info {
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
