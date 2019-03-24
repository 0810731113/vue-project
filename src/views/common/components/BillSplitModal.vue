<template>
  <el-dialog
    width="40%"
    title="分账设置"
    :visible.sync="isShow"
    class="base-modal bill-split-modal"
  >
    <el-form label-width="80px" class="mw-form">
      <el-form-item label="分账模式">
        <el-select placeholder="请选择" v-model="form.ledgerMode" style="width: 80%" @change="onModeChange">
          <el-option
            v-for="item in BILL_SPLIT_MODE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.itemLedgerDtos.length&&form.ledgerMode!==0">
        <el-form class="sub-form" label-width="60px">
          <el-form-item v-for="item in form.itemLedgerDtos" :key="item.setFoodCd" :label="item.setFoodName" >
            <el-input-number v-model="item.splitPrice" :controls="false" :min="0" @blur="onInputBlur"></el-input-number>&nbsp;{{ form.ledgerMode === 1 ? '元' : '%' }}
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item v-if="form.itemLedgerDtos.length&&form.ledgerMode === 1">
        <div>当前套餐价格:<span style="color: red">{{form.menuSalePrice}}</span></div>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
      <div class="error-wrapper horizontal-center" v-if="!!errorMessage">
        <i class="el-icon-circle-cross"></i>
        {{ errorMessage }}
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
  import { BILL_SPLIT_MODE, ON_TEXT, OFF_TEXT } from 'constant/constants';
  import { OK, FORBIDDEN } from 'constant/statusCode';
  import { mapActions, mapState } from 'vuex';
  import cloneDeep from 'lodash/cloneDeep';

  export default {
    name: 'BillSplitModal',
    props: ['itemCd', 'callBack'],
    data () {
      return {
        isShow: false,
        OK,
        ON_TEXT,
        OFF_TEXT,
        FORBIDDEN,
        BILL_SPLIT_MODE,
        form: {
          itemCd: null,
          ledgerMode: 0,
          status: OK,
          itemLedgerDtos: []
        },
        errorMessage: ''
      };
    },
    computed: mapState({
      billSplitDetail: state => state.dishes.setMeal.billSplitDetail,
      error: state => state.error
    }),
    watch: {
      async isShow () {
        if (this.isShow) {
          await this.init();
        }
      }
    },
    methods: {
      ...mapActions([
        'saveSetMealBillSplitDetail'
      ]),
      init () {
        const { form, billSplitDetail, itemCd } = this;
        this.form = { ...form, ...cloneDeep(billSplitDetail), itemCd };
        this.errorMessage = '';
      },
      onModeChange () {
        this.form.itemLedgerDtos.map(item => {
          item.splitPrice = 0;
        });
      },
      onInputBlur () {
        this.form.itemLedgerDtos.map(item => {
          item.splitPrice = item.splitPrice.toFixed(0);
        });
      },
      async onSubmit () {
        if (+this.form.isStatus === 1 && +this.form.status === OK) {
          this.errorMessage = '配菜项非必选不能启用分账设置';
          return;
        }
        let total = 0;
        this.form.itemLedgerDtos.map(item => {
          total += item.splitPrice;
        });

        if (this.form.ledgerMode === 2) {
          if (total !== 100) {
            this.errorMessage = '分账比例之和必须等于100%';
            return;
          }
        } else if (this.form.ledgerMode === 1) {
          if (total !== +this.form.menuSalePrice) {
            this.errorMessage = '分账金额之和必须等于当前套餐价格';
            return;
          }
        }

        await this.saveSetMealBillSplitDetail(this.form);
        const { errorStatus, errorMsg } = this.error;
        if (errorStatus) {
          this.errorMessage = errorMsg;
        } else {
          this.isShow = false;
          this.callBack();
        }
      }
    }
  };

</script>
<style lang="scss">
  .bill-split-modal {
    padding: 15px 15px 0;

    .mw-form {
      width: 80%;

      .el-form-item {
        margin-bottom: 20px;
      }
    }

    .sub-form {
      padding: 10px 10px 0;
      width: 75%;
      border: 1px solid #C2CDD3;
      border-radius: 3px;
    }

    .operation-item {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
</style>
