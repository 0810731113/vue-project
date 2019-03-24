<template>
  <el-form class="mw-form payment-form" :rules="rules" ref="form" :model="form" label-width="120px">
    <el-form-item label="付款方式名称" prop="paymentName">
      <el-input placeholder="请输入付款方式名称" v-model.trim="form.paymentName" :maxlength="20" :disabled="!!couponType" />
    </el-form-item>
    <el-form-item label="付款类型" prop="paymentTypeId">
      <el-select v-model="form.paymentTypeId" class="input-wrap" :disabled="!!couponType" @change="onPaymentTypeSelectionChange">
        <el-option
          v-for="item in paymentTypes"
          v-if="+item.status === OK"
          :key="item.paymentTypeId"
          :label="item.paymentTypeName"
          :value="item.paymentTypeId">
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 满减券 -->
    <div v-if="+couponType === FULL_COUPON">
      <el-form-item label="优惠内容">
        满<el-input class="input-discount" v-model="form.fulMoney" :disabled="true" />元 ，减
        <el-input class="input-discount" v-model="form.cutMoney" :disabled="true" />元
      </el-form-item>
    </div>
    <!-- 优惠券 -->
    <div v-if="+couponType === CASH_COUPON">
      <el-form-item label="面值">
        <el-input v-model="form.fulMoney" class="input-wrap" :disabled="true" />
      </el-form-item>
      <el-form-item label="劵折扣率(%)">
        <el-input-number v-model="form.discountRate" class="input-wrap" :controls="false" :min="0" :max="100" />
      </el-form-item>
      <el-form-item label="折扣归属" prop="discountPaymentId">
        <el-select v-model="form.discountPaymentId" class="input-wrap">
          <el-option label="请选择折扣归属" value="-1" />
          <el-option
            v-for="item in sortListBackup"
            :key="item.paymentId"
            :label="item.paymentName"
            :value="item.paymentId">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <!-- 折扣券 -->
  <div v-if="+couponType === DISCOUNT_COUPON">
      <el-form-item label="劵折扣率(%)">
        <el-input v-model="form.discount" class="input-wrap" :disabled="true" />
        <div class="discpunt-tips">券折扣率=100-CRM后台折扣率，举例：CRM后台折扣率为80%，则此处显示20%</div>
      </el-form-item>
    </div>
    <!-- 销售代金券, 赠送代金券 -->
    <div v-if="COUPON_CODES.includes(+form.paymentTypeId)">
      <el-form-item label="面值">
        <el-input-number v-model="form.defaultPrice" class="input-wrap" :controls="false" :min="0" :max="9999" />
      </el-form-item>
      <el-form-item label="券实收" prop="couponPayment">
        <el-input-number v-model="form.couponPayment" class="discount-rate" :controls="false" :min="0" :max="9999" />
        <span v-if="+form.paymentTypeId != 213">
          劵折扣率<el-input v-model="form.discountRate" disabled class="discount-rate" />%
        </span>
      </el-form-item>
      <el-form-item label="验券平台" v-if="+form.paymentTypeId === GROUP_PURCHASE">
        <el-select v-model="form.voucherPlatform" class="input-wrap">
          <el-option label="美团点评" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="折扣归属" prop="discountPaymentId">
        <el-select v-model="form.discountPaymentId" class="input-wrap">
          <el-option label="请选择折扣归属" value="-1" />
          <el-option
            v-for="item in sortListBackup"
            :key="item.paymentId"
            :label="item.paymentName"
            :value="item.paymentId">
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div v-if="+couponType || COUPON_CODES.includes(+form.paymentTypeId)">
      <el-form-item label="使用范围">
        <el-radio class="radio" v-model="form.isPartAmtDiscount" :label="FALSE">所有菜品金额总和</el-radio>
        <el-radio class="radio" v-model="form.isPartAmtDiscount" :label="TRUE">可打折菜品金额总和</el-radio>
      </el-form-item>
    </div>
    <el-form-item label="是否计入开票">
      <el-switch v-model="form.isCalcInvoice" :active-value="TRUE" :inactive-value="FALSE" />
    </el-form-item>
    <el-form-item label="是否计入实收">
      <el-switch v-model="form.isCalcPaid" :active-value="TRUE" :inactive-value="FALSE" />
    </el-form-item>
    <el-form-item label="是否为隐藏项目">
      <el-switch v-model="form.isPremium" :active-value="TRUE" :inactive-value="FALSE" />
      <span>（是：结账界面中的付款方式不显示该项）</span>
    </el-form-item>
    <el-form-item label="有效时间">
      <el-select v-model="form.isEffectiveDate" class="el-col-6">
        <el-option label="无限制" :value="0" />
        <el-option label="固定时间" :value="1" />
      </el-select>
      <el-date-picker
        popper-class="payment-date-picker"
        v-if="form.isEffectiveDate"
        v-model="form.dateTime"
        :editable="false"
        type="datetimerange"
        placeholder="选择时间范围" />
      <div class="empty-date-tips" v-show="checkEmptyDate()">*请选择时间范围</div>
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button type="primary" @click="onSubmit" class="btn-submit" v-if="!isChain">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import fecha from 'fecha';
import { mapState, mapActions } from 'vuex';
import { COUPON_TYPES, COUPON_CODES, GROUP_PURCHASE, MW_COUPONS } from 'constant/payment';
import { OK, FORBIDDEN, TRUE, FALSE } from 'constant/statusCode';
import { validateDishName } from 'utils/validateUtil';
import { isChain } from 'utils/configUtil';
import {
  SYSTEM_KEY, ON_TEXT, OFF_TEXT,
  FULL_COUPON, CASH_COUPON, DISCOUNT_COUPON
} from 'constant/constants';

export default {
  name: 'payment',
  data () {
    const validateCoupon = (rule, value, callback) => {
      const { defaultPrice } = this.form;
      if (defaultPrice && +value > defaultPrice) {
        callback(new Error('券实收不能大于面值'));
      } else {
        if (defaultPrice) {
          this.form.discountRate = ((1 - (value / defaultPrice)) * 100).toFixed(2) || 0;
        }
        callback();
      }
    };
    const validateDiscount = (rule, value, callback) => {
      const { discountRate } = this.form;
      if (+discountRate && value === '-1') {
        callback(new Error('请选择折扣归属'));
      }
      callback();
    };
    return {
      OK,
      FORBIDDEN,
      SYSTEM_KEY,
      TRUE,
      FALSE,
      ON_TEXT,
      OFF_TEXT,
      MW_COUPONS,
      FULL_COUPON,
      CASH_COUPON,
      COUPON_CODES,
      GROUP_PURCHASE,
      DISCOUNT_COUPON,
      discountCoupon: ['125', '72', '70','213'],
      sortListBackup: [],
      form: {
        defaultPrice: 0,
        discountRate: 0,
        couponPayment: 0,
        voucherPlatform: 1,
        paymentId: 0,
        paymentName: '',
        paymentTypeId: '',
        isPremium: 0,
        isCalcInvoice: 0,
        isCalcPaid: 0,
        isEffectiveDate: 0,
        isPartAmtDiscount: 0,
        discountPaymentId: '-1',
        dateTime: '',
        status: OK
      },
      rules: {
        paymentName: [
          { required: true, message: '请输入付款方式名称', trigger: 'blur, change' },
          { validator: validateDishName, trigger: ['blur', 'change'] }
        ],
        paymentTypeId: [{ required: true, message: '请选择付款类型', trigger: 'blur, change' }],
        couponPayment: [{ validator: validateCoupon, trigger: ['blur', 'change'] }],
        discountPaymentId: [{ validator: validateDiscount, trigger: 'blur, change' }]
      },
      isEdit: !!this.$route.params.id,
      couponType: 0,
      isChain: isChain()
    };
  },
  async created () {
    const { id } = this.$route.params;
    const { couponID, couponName, couponType, fulMoney, cutMoney, discount } = this.$route.query;
    await this.fetchSortPayment();
    if (id) {
      await this.fetchPaymentDetail(id);
      const { paymentTypeId } = this.paymentDetail;
      await this.fetchAllPaymentTypes({ type: MW_COUPONS.includes(+paymentTypeId) ? SYSTEM_KEY : +!SYSTEM_KEY });
      this.initData(this.paymentDetail);
      const payment = this.paymentTypes.find(item => item.paymentTypeId === paymentTypeId && item.status === OK);
      if (!payment) {
        this.form.paymentTypeId = null;
      }
      if(this.form.paymentTypeId == '213'){
        this.form.couponPayment = this.form.cardRealAmt
      }
    } else {
      await this.getPaymentLastId();
      await this.fetchAllPaymentTypes({ type: +!SYSTEM_KEY });
//      await this.fetchAllPaymentTypes();
      this.form.paymentId = this.lastId;
      this.form.paymentTypeId = this.paymentTypes[0].paymentTypeId;

      this.onPaymentTypeSelectionChange (this.form.paymentTypeId)

    }

    if (couponID) {
      this.couponType = couponType || 0;
      this.initData({
        isMwCoupon: true,
        paymentName: couponName,
        paymentTypeId: COUPON_TYPES[couponType],
        fulMoney, cutMoney, discount, couponID
      });
    }
  },
  computed: mapState({
    paymentDetail: state => state.business.payment.paymentDetail,
    mwCouponsList: state => state.business.payment.mwCouponsList,
    sortList: state => state.business.payment.sortList,
    lastId: state => state.business.payment.lastId,
    paymentTypes: state => state.business.paymentType.typesList,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'fetchAllPayment',
      'fetchSortPayment',
      'fetchAllPaymentTypes',
      'fetchMWCoupons',
      'savePayment',
      'updatePayment',
      'getPaymentLastId',
      'fetchPaymentDetail'
    ]),
    initData (editData) {
      const { form, sortList } = this;
      console.log(sortList)
      const { endDate, starDate, paymentTypeId, discountRate, defaultPrice, fullMoney, isMwCoupon } = editData;
      this.form = {
        ...form,
        ...editData,
        couponPayment: (+defaultPrice * (1 - discountRate / 100)).toFixed(2),
        dateTime: starDate && endDate ? [new Date(starDate), new Date(endDate)] : [new Date(), new Date()]
      };

      this.sortListBackup = sortList;
      if (isMwCoupon) return;

      switch (paymentTypeId) {
        case '30':
          this.couponType = 3;
          this.form = { ...this.form, discount: discountRate || 0 };
          break;
        case '31':
          this.couponType = 1;
          this.form = { ...this.form, fulMoney: fullMoney || 0 };
          break;
        case '32':
          this.couponType = 2;
          this.form = { ...this.form, fulMoney: defaultPrice || 0 };
          break;
      }
      this.onPaymentTypeSelectionChange(paymentTypeId);
       //兼容老版本数据
      const item = this.sortListBackup.find(item => item.paymentId === this.form.discountPaymentId);
      if (!item) {
        this.form.discountPaymentId = '-1';
      }
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm || this.checkEmptyDate()) return;

      const { isEffectiveDate, dateTime, paymentTypeId, discount, fulMoney } = this.form;
      let data = { ...this.form };
      if(data.paymentTypeId == '213'){
        data.cardRealAmt = data.couponPayment
      }
      if (isEffectiveDate) {
        const [starDate, endDate] = dateTime;
        data.starDate = fecha.format(starDate, 'YYYY-MM-DD HH:mm:ss');
        data.endDate = fecha.format(endDate, 'YYYY-MM-DD HH:mm:ss');
      }
      delete data.dateTime;
      switch (paymentTypeId) {
        case '30':
          data = { ...data, discountRate: discount || 0 };
          break;
        case '32':
          data = { ...data, defaultPrice: fulMoney };
          break;
        default:
          break;
      }

      this.isEdit ? await this.updatePayment(data) : await this.savePayment(data);

      if (!this.errorStatus) {
        this.$router.back();
      }
    },
    onCancel () {
      this.$router.back();
    },
    checkEmptyDate () {
      const { isEffectiveDate, dateTime } = this.form;
      const [starDate, endDate] = dateTime;
      return isEffectiveDate ? !starDate && !endDate : false;
    },
    onPaymentTypeSelectionChange (selection) {
      //console.log(this.sortList)
      this.discountCoupon.includes(selection)
        ? this.sortListBackup = this.sortList.filter(item => item.isCalcPaid === 0)
        : this.sortListBackup = this.sortList.slice();
    }
  }
};
</script>

<style lang="scss">
.payment-form {
  width: 45%;

  .input-wrap {
    width: 240px;
  }

  .input-discount {
    width: 50px;
  }

  .discount-rate {
    width: 80px;
    padding: 0 5px;
  }

  .discpunt-tips {
    color: orangered;
    line-height: 1.5;
  }

  .empty-date-tips {
    color: #ff4949;
  }
}

.payment-date-picker {
  width: 55%;
  margin-left: 15px;
}

@media screen and (max-width: 1540px) {
  .payment-form {
    width: 55%;

    .date-picker {
      width: 350px !important;
    }
  }
}
</style>
