<template>
  <div class="form-container">
    <el-form class="mw-form" :model="parameterList" ref="form" label-width="260px">
      <el-form-item class="label-title" label="结账完成选项:" />
      <el-form-item label="支付自动结账">
        <el-radio-group
          :value="parameterList[PAY_AUTOMATICALLY].paramValue"
          @input="(value) => onChangeItem(value, PAY_AUTOMATICALLY, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结账自动清台">
        <el-radio-group
          :value="parameterList[CLEAR_TABLE_AFTER_PAYING].paramValue"
          @input="(value) => onChangeItem(value, CLEAR_TABLE_AFTER_PAYING, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否打印结账单">
        <el-radio-group
          :value="parameterList[PRINTER_BILL_AUTOMATICALLY].paramValue"
          @input="(value) => onChangeItem(value, PRINTER_BILL_AUTOMATICALLY, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="打印结账单时是否开钱箱">
        <el-switch
          active-value="1" inactive-value="0" active-text="是" inactive-text="否"
          :value="parameterList[OPEN_CASHIER_BOX].paramValue"
          @input="(value) => onChangeItem(value, OPEN_CASHIER_BOX, 'paramValue')">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否自动关闭结账完成弹出界面及倒数关闭秒数">
        <el-radio-group
          :value="parameterList[CLOSE_POPUP_AUTOMATICALLY].paramValue"
          @input="(value) => onChangeItem(value, CLOSE_POPUP_AUTOMATICALLY, 'paramValue')">
          <el-radio label="0">否 &nbsp;&nbsp;</el-radio>
          <el-radio label="1">是</el-radio>
          <span>倒数关闭秒数:</span>
          <el-input-number
            style="margin: 0 10px"
            size="small"
            :min="0"
            controls-position="right"
            :value="parameterList[CLOSE_POPUP_AUTOMATICALLY].int1"
            @input="(value) => onChangeItem(value, CLOSE_POPUP_AUTOMATICALLY, 'int1')" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="交班或日结後清除临时沽清商品">
        <el-radio-group
          :value="parameterList[HAND_OVER_OR_ACCOUNT].paramValue"
          @input="(value) => onChangeItem(value, HAND_OVER_OR_ACCOUNT, 'paramValue')">
          <el-radio label="1">交班</el-radio>
          <el-radio label="2">日结  临时沽清:指营业中设置数量的菜品售空</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="外卖数据计入营业报表">
        <el-radio-group
          :value="parameterList[TAKEOUT_SALE_REPORT].paramValue"
          @input="(value) => onChangeItem(value, TAKEOUT_SALE_REPORT, 'paramValue')">
          <el-radio label="1">否</el-radio>
          <el-radio label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退菜理由是否必选">
        <el-radio-group
          :value="parameterList[RETREAT_REASON_REQUIRED].paramValue"
          @input="(value) => onChangeItem(value, RETREAT_REASON_REQUIRED, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="赠菜理由是否必选">
        <el-radio-group
          :value="parameterList[GIFT_REASON_REQUIRED].paramValue"
          @input="(value) => onChangeItem(value, GIFT_REASON_REQUIRED, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="反结账理由是否必选" >
        <el-radio-group
          :value="parameterList[RECHECK_REASON_REQUIRED].paramValue"
          @input="(value) => onChangeItem(value, RECHECK_REASON_REQUIRED, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="秒付拉单是否关联会员" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：2.5.2及其以上<br/>Windows：端上永远开，不受此处开关控制"></Tips>
        <el-radio-group
          :value="parameterList[ASSOCIATION_MEMBERS].paramValue"
          @input="(value) => onChangeItem(value, ASSOCIATION_MEMBERS, 'paramValue')">
          <el-radio label="1">否</el-radio>
          <el-radio label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预付金功能是否开启" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：2.5及其以上<br/>Windows：端上永远开，不受此处开关控制"></Tips>
        <el-radio-group
          :value="parameterList[ADVANCE_MONEY].paramValue"
          @input="(value) => onChangeItem(value, ADVANCE_MONEY, 'paramValue')">
          <el-radio label="1">否</el-radio>
          <el-radio label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="label-title" label="付款方式选项:" />
      <el-form-item label="「销售代金券免找」对应哪个付款方式">
        <el-select
          :value="parameterList[SALE_COUPON].paramValue"
          @input="(value) => onChangeItem(value, SALE_COUPON, 'paramValue')"
          placeholder="请选择付款方式">
          <el-option
            v-for="item in paymentMethodListForCoupon"
            :key="item.paymentId"
            :label="item.paymentName"
            :value="item.paymentId" />
        </el-select>
      </el-form-item>
      <el-form-item label="「固定面值代金券免找」对应哪个付款方式">
        <el-select
          :value="parameterList[FIXED_FACE_VALUE].paramValue"
          @input="(value) => onChangeItem(value, FIXED_FACE_VALUE, 'paramValue')"
          placeholder="请选择付款方式">
          <el-option
            v-for="item in paymentMethodListForCoupon"
            :key="item.paymentId"
            :label="item.paymentName"
            :value="item.paymentId" />
        </el-select>
      </el-form-item>
      <el-form-item label="「赠送代金券免找」对应哪个付款方式">
        <el-select
          :value="parameterList[PRESENT_COUPON].paramValue"
          @input="(value) => onChangeItem(value, PRESENT_COUPON, 'paramValue')"
          placeholder="请选择付款方式">
          <el-option
            v-for="item in paymentMethodListForCoupon"
            :key="item.paymentId"
            :label="item.paymentName"
            :value="item.paymentId" />
        </el-select>
      </el-form-item>
      <el-form-item label="「团购券免找」对应哪个付款方式">
        <el-select
          :value="parameterList[GROUP_PURCHASE].paramValue"
          @input="(value) => onChangeItem(value, GROUP_PURCHASE, 'paramValue')"
          placeholder="请选择付款方式">
          <el-option
            v-for="item in paymentMethodListForCoupon"
            :key="item.paymentId"
            :label="item.paymentName"
            :value="item.paymentId" />
        </el-select>
      </el-form-item>
      <el-form-item label="外卖平台餐盒费对应的菜品id和规格">
        <el-select
          :value="parameterList[MEAL_BOX_COST].paramValue"
          @input="(value) => onChangeItems(value, MEAL_BOX_COST, 'paramValue')"
          placeholder="请选择菜品">
          <el-option
            v-for="item in menuList"
            :key="item.menuItemName"
            :label="item.menuItemName + '_' + item.menuOrderUint"
            :value="item.menuItemCd"/>
        </el-select>
      </el-form-item>
      <el-form-item label="外卖平台配送费对应的菜品id和规格">
        <el-select
          :value="parameterList[SENDER_COST].paramValue"
          @input="(value) => onChangeItems(value, SENDER_COST, 'paramValue')"
          placeholder="请选择菜品">
          <el-option
            v-for="item in menuList"
            :key="item.menuItemName"
            :label="item.menuItemName + '_' + item.menuOrderUint"
            :value="item.menuItemCd"/>
        </el-select>
      </el-form-item>
      <el-form-item label="「差额找零」对应哪个现金付款方式" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：V3.0及其以上<br/>Windows：暂不支持"></Tips>
        <el-select
          :value="parameterList[SUB_RECHANGE].paramValue"
          @input="(value) => onChangeItem(value, SUB_RECHANGE, 'paramValue')"
          placeholder="请选择付款方式">
          <el-option
            v-for="item in paymentMethodListForChange"
            :key="item.paymentId"
            :label="item.paymentName"
            :value="item.paymentId" />
        </el-select>
      </el-form-item>
      <div style="text-align: center">
        <el-button class="btn-submit" :disabled="isMaintain" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
    <toast
      ref='toast'
      :content="toastContent"
      :timeout="2000"
      :type="toastType" />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Toast, Tips } from 'components';
  import {
    SENDER_COST,
    MEAL_BOX_COST,
    ADVANCE_MONEY,
    SYSTEM_KEYS,
    SALE_COUPON,
    PRESENT_COUPON,
    GROUP_PURCHASE,
    OPEN_CASHIER_BOX,
    PAY_AUTOMATICALLY,
    TAKEOUT_SALE_REPORT,
    ASSOCIATION_MEMBERS,
    HAND_OVER_OR_ACCOUNT,
    CLEAR_TABLE_AFTER_PAYING,
    CLOSE_POPUP_AUTOMATICALLY,
    PRINTER_BILL_AUTOMATICALLY,
    RETREAT_REASON_REQUIRED,
    GIFT_REASON_REQUIRED,
    RECHECK_REASON_REQUIRED,
    SUB_RECHANGE,
    FIXED_FACE_VALUE,
  } from 'constant/systemOptions';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'CashierParameter',
    components: { Toast, Tips },
    data () {
      return {
        SENDER_COST,
        MEAL_BOX_COST,
        ADVANCE_MONEY,
        SALE_COUPON,
        PRESENT_COUPON,
        GROUP_PURCHASE,
        OPEN_CASHIER_BOX,
        PAY_AUTOMATICALLY,
        ASSOCIATION_MEMBERS,
        TAKEOUT_SALE_REPORT,
        HAND_OVER_OR_ACCOUNT,
        CLEAR_TABLE_AFTER_PAYING,
        CLOSE_POPUP_AUTOMATICALLY,
        PRINTER_BILL_AUTOMATICALLY,
        RETREAT_REASON_REQUIRED,
        GIFT_REASON_REQUIRED,
        RECHECK_REASON_REQUIRED,
        SUB_RECHANGE,
        FIXED_FACE_VALUE,
        toastType: '',
        toastContent: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        parameterList: state => state.setting.systemOptions.parameterList,
        paymentMethodListForChange: state => state.setting.systemOptions.paymentMethodListForChange,
        paymentMethodListForCoupon: state => state.setting.systemOptions.paymentMethodListForCoupon,
        errorStatus: state => state.error.errorStatus,
        menuList: state => state.setting.systemOptions.menuList
      })
    },
    methods: {
      ...mapActions([
        'updateParameter',
        'updateParameters',
        'updateParameterList',
        'fetchParameterList',
        'fetchPaymentForChange',
        'fetchPaymentForCoupon',
        'fetchMenuListForOpenParams'
      ]),
      onChangeItem (value, type, parameterName) {
        this.updateParameter({ value, type, parameterName });
      },
      onChangeItems (value, type, parameterName) {
        const params = [{ value, type, parameterName }];
        const item = this.menuList.find(item => item.menuItemCd === value);
        params.push({ value: item.menuOrderUintCd, type, parameterName: 'str1' });
        this.updateParameters({ params });
      },
      onShowModal (ref) {
        this.$refs[ref].isShow = true;
      },
      checkSelected () {
        const payments = [SALE_COUPON, PRESENT_COUPON, GROUP_PURCHASE,FIXED_FACE_VALUE];
        payments.map(item => {
          const { paramValue } = this.parameterList[item];
          const paymentMethod = this.paymentMethodListForCoupon.find(item => item.paymentId === paramValue);
          if (!paymentMethod) {
            this.onChangeItem(null, item, 'paramValue');
          }
        });
      },
      async onSubmit () {
        await this.updateParameterList();
        this.toastType = this.errorStatus ? 'warning' : 'success';
        this.toastContent = this.errorStatus ? '保存失败' : '保存成功';
        this.$refs.toast.isShow = true;
      }
    },
    async created () {
      await this.fetchMenuListForOpenParams();
      await this.fetchParameterList({ paramCls: SYSTEM_KEYS.CASHIER });
      await this.fetchPaymentForChange({ paymentTypeId: 10 });
      await this.fetchPaymentForCoupon({ isPremium: 1 });
      this.checkSelected();
    }
  };

</script>
<style lang="scss">
.form-container {
  .mw-form {
    width: 60%;
    margin-bottom: 30px;

    .el-radio-group {
      font-size: 14px;
    }
  }
}
</style>
