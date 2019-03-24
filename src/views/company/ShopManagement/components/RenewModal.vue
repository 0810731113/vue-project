<template>
  <el-dialog custom-class="base-modal renew-modal" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">门店信息更新{{shopId}}</div>
    <el-form :model="form" ref="form" label-width="100px" >
      <el-form-item>
        <div class="renew-table">
          <el-col class="left" :span="11"><span class="title">旧值</span></el-col>
          <el-col :span="11"><span class="title">新值</span></el-col>
        </div>
      </el-form-item>
      <el-form-item label="门店名称">
        <div class="renew-table">
          <el-col class="left" :span="11"><span class="text">{{form.oldShopName}}</span></el-col>
          <el-col :span="11"><span class="text">{{form.newShopName}}</span></el-col>
        </div>
      </el-form-item>
      <el-form-item label="所属公司">
        <div class="renew-table">
          <el-col class="left" :span="11"><span class="text">{{form.oldCompany}}</span></el-col>
          <el-col :span="11"><span class="text">{{form.newCompany}}</span></el-col>
        </div>
      </el-form-item>
      <el-form-item label="地址">
        <div class="renew-table">
          <el-col class="left" :span="11"><span class="text">{{form.oldAddress}}</span></el-col>
          <el-col :span="11"><span class="text">{{form.newAddress}}</span></el-col>
        </div>
      </el-form-item>
      <el-form-item label="餐营业态">
        <div class="renew-table">
          <el-col class="left" :span="11"><span class="text">{{form.oldFoodTradeName}}</span></el-col>
        </div>
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button type="primary" class="btn-submit" @click="onRenew">更新</el-button>
      </el-form-item>
      <el-form-item class="btn-wrapper error-wrapper" v-if="showError">
        <div>
          <i class="el-icon-circle-cross"></i>
          {{ errorMessage }}
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { TRADE_TYPE } from 'constant/constants';

export default {
  name: 'renewModal',
  props: ['shopId', 'shopMessage', 'updateMessage', 'getShopList'],
  data () {
    return {
      isShow: false,
      getData: [],
      form: {
        oldShopName: '',
        newShopName: '',
        oldCompany: '',
        newCompany: '',
        oldAddress: '',
        newAddress: '',
        oldFoodTradeId: '',
        oldFoodTradeName: ''
      },
      options: TRADE_TYPE,
      errorMessage: '',
      showError: false
    };
  },
  watch: {
    async shopMessage () {
      this.showError = false;
      this.getData = this.shopMessage;
      const { newShopMessage, oldShopMessage } = this.getData;
      const { shopName: newShopName, company: newCompany, address: newAddress } = newShopMessage;
      const { shopName: oldShopName, company: oldCompany, address: oldAddress, foodTradeId: oldFoodTradeId } = oldShopMessage;
      this.form = { ...this.form, oldShopName, newShopName, oldCompany, newCompany, oldAddress, newAddress, oldFoodTradeId };
      const data = this.options.filter(item => {
        if (oldFoodTradeId === item.value) {
          return item;
        }
      });
      this.form.oldFoodTradeName = data[0].name;
    }
  },
  methods: {
    async onRenew () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      const { newShopName, newAddress } = this.form;
      await this.updateMessage({ operateShopGUID: this.shopId, newShopName, newAddress, noShowError: true });
      const { errorStatus, errorMsg } = this.$store.state.error;
      if (errorStatus) {
        this.errorMessage = errorMsg;
        this.showError = true;
        return;
      }
      await this.getShopList();
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss">
  .renew-modal {
    .el-form-item__label {
      font-weight: 700;
    }

    .el-dialog__body {
      padding: 30px 20px 5px;
    }

    .left {
      margin-right: 15px;
    }

    .renew-table {
      margin-left: 20px;
    }

    .el-form-item {
      margin-bottom: 10px;
    }

    .operation-item {
      margin-top: 25px;
    }

    .btn-wrapper {
      margin-left: 10%;
    }
  }
</style>
