<template>
  <el-form class="mw-form" label-width="100px" ref="form" :rules="rules" :model="form" @submit.prevent.native>
    <el-form-item label="对象名称" prop="creditAccountName">
      <el-input placeholder="请输入挂账对象名称" v-model="form.creditAccountName" :maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="信用额度">
      <el-input placeholder="请输入信用额度" class="balance" v-model.number="form.creditAmt" disabled></el-input>
      <el-button class="btn-base" @click="onShowModal">更改额度</el-button>
    </el-form-item>
    <el-form-item label="未销账金额" prop="balanceAmt">
      <el-input :value="form.balanceAmt" disabled></el-input>
    </el-form-item>
    <!--<el-form-item label="可用余额">-->
      <!--<el-input :value="form.creditAmt - form.usedAmt" disabled></el-input>-->
      <!--<div>*可用余额恢复，请在最新客户端版本通过销账完成。</div>-->
    <!--</el-form-item>-->
    <el-form-item label="联系人" prop="contact">
      <el-input placeholder="请输入联系人" v-model="form.contact" :maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="cellphoneCt">
      <el-input placeholder="请输入手机" v-model="form.cellphoneCt"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="telCt">
      <el-input placeholder="请输入电话" v-model="form.telCt"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input placeholder="请输入备注" v-model="form.note" type="textarea" resize="none" :maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button native-type='submit' type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
    <Popup ref="popup" title="更改额度" type="submit" :handleOk="() => this.onChangeCreditAmt()">
      <div slot="content">
        <div class="item">
          <span class="item-tips">当前额度</span>
          <el-input class="item-input" v-model.number="form.creditAmt" disabled />
        </div>
        <div class="item">
          <span class="item-tips">更改后额度</span>
          <el-input-number class="item-input" :controls="false" :min="0" :max="99999999" v-model="temCreditAmt"/>
        </div>
        <div class='error-msg' v-show="errorMsg">{{ errorMsg }}</div>
      </div>
    </Popup>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup } from 'components';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';
import { validateName, validatePhone, validateMobile } from 'utils/validateUtil';

export default {
  name: 'creditAccount',
  components: { Popup },
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      temCreditAmt: 0,
      errorMsg: null,
      form: {
        creditAccountId: 0,
        creditAccountName: '',
        creditAmt: 0,
        debtAmt: 0,
        usedAmt: 0,
        balanceAmt: 0,
        contact: '',
        cellphoneCt: '',
        telCt: '',
        note: '',
        status: OK
      },
      rules: {
        creditAccountName: [
          { required: true, message: '请输入对象名称', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ],
        contact: [{ validator: validateName, trigger: ['blur', 'change'] }],
        cellphoneCt: [{ validator: validateMobile, trigger: ['blur', 'change'] }],
        telCt: [{ validator: validatePhone, trigger: ['blur', 'change'] }]
      },
      isEdit: !!this.$route.params.id
    };
  },
  async created () {
    if (this.isEdit) {
      await this.fetchCreditAccountDetail(this.$route.params.id);
      this.initData();
    } else {
      await this.getCreditAccountLastId();
      this.form.creditAccountId = this.lastId;
    }
  },
  computed: mapState({
    creditAccountDetail: state => state.business.creditAccount.creditAccountDetail,
    lastId: state => state.business.creditAccount.lastId,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'saveCreditAccount',
      'updateCreditAccount',
      'fetchCreditAccountDetail',
      'getCreditAccountLastId'
    ]),
    initData () {
      const { form, creditAccountDetail } = this;
      const { debtAmt, creditAmt } = creditAccountDetail;
      const usedAmt = +creditAmt - +debtAmt;
      this.form = { ...form, ...creditAccountDetail, usedAmt };
    },
    onShowModal () {
      this.$refs.popup.isShow = true;
    },
    onChangeCreditAmt () {
      const { temCreditAmt, form } = this;
      if (form.usedAmt > temCreditAmt) {
        this.errorMsg = '更改后额度小于已使用金额';
        return;
      }

      this.errorMsg = '';
      this.$refs.popup.isShow = false;
      this.form.creditAmt = temCreditAmt;
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;
      const { creditAmt, usedAmt } = this.form;
      const data = { ...this.form, debtAmt: +creditAmt - +usedAmt };
      if (this.isEdit) {
        await this.updateCreditAccount(data);
      } else {
        await this.saveCreditAccount(data);
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
  width: 45%;

  .balance {
    width: 45%;
    margin-right: 5%;
  }

  .item {
    margin-bottom: 10px;

    .item-tips {
      width: 20%;
      display: inline-block;
    }

    .item-input {
      width: 70%;
    }
  }

  .error-msg {
    text-align: center;
    color: #ff4949;
  }
}
</style>
