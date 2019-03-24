<template>
  <el-form class="mw-form bargain-full-add-or-edit" ref='form' :model="dto" :rules="rules" label-width="180px">
    <el-form-item label="金额满减方案名称" prop="bargainName">
      <el-input placeholder="请输入金额满减方案名称" v-model="dto.bargainName" :maxlength='50' class="width-full"/>
    </el-form-item>
    <el-form-item label="计划时间" prop="dateTime">
      <el-date-picker
        :editable="false"
        v-model="dto.dateTime"
        type="daterange"
        placeholder="请选择时间范围"
      />
    </el-form-item>
    <el-form-item label="餐段" prop="msectionIdList" v-if="isShop">
      <el-checkbox-group v-model="dto.msectionIdList" class="msection">
        <el-checkbox v-for="item in allMSectionList" :key="item.msectionId" :label="item.msectionId">
          {{item.msectionName}}&nbsp;{{item.beginTime}}-{{item.endTime}}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="计划类型" prop="planType">
      <plan-type
        v-model="dto.planType"
        :planTypeList="planTypeList"
        :onSelectDate="(date) => onSelectDate(date, 'planTypeValue')"
        :onChangeDate="(date) => onChangeDate(date, 'planTypeValue')"
        @changeWeek="onChangeWeek"
        :selectedWeekDay="dto.weekDays"
        :disabled="dto.dateTime"
        :selectedDate="dto.planTypeValue"
      />
    </el-form-item>
    <el-form-item label="不可用日期" prop="notusableDate" v-if="false">
      <date-picker-and-text
        :onSelectDate="(date) => onSelectDate(date, 'notusableDate')"
        :onChangeDate="(date) => onChangeDate(date, 'notusableDate')"
        :selectedDate="dto.notusableDate"
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch
        v-model="dto.status"
        :active-text="ON_TEXT"
        :inactive-text="OFF_TEXT"
        :active-value="OK"
        :inactive-value="FORBIDDEN"
      />
    </el-form-item>
    <el-form-item class="second-title" label="金额满减设置" />
    <el-form-item label="金额次数" prop="fullCutType">
      <el-radio class="radio" v-model="bargainFull.fullCutType" :label='0'>单次满减</el-radio>
      <el-radio class="radio" v-model="bargainFull.fullCutType" :label='1'>累计满减</el-radio>
    </el-form-item>
    <el-form-item label="满额设置">
      <el-radio class="radio" v-model="settingType" :label='0'>减价</el-radio>
      <el-radio class="radio" v-model="settingType" :label='1'>折扣</el-radio>
      <div v-if="+settingType === 0">
        <span>{{ bargainFull.fullCutType ? '每' : '' }}</span>满
        <el-input-number v-model="bargainFull.fullmoney" @blur="onBlurFullmoney" class="input-text" :min="0" :max="999" :controls="false" controls-position="right"/>
        元，以减价
        <el-input-number :controls="false" :min="0" :max="999" v-model="bargainFull.cutmoney" class="input-text" />元执行
      </div>
      <div v-if="+settingType === 1">
        <span>{{ bargainFull.fullCutType ? '每' : '' }}</span>满
        <el-input-number v-model="bargainFull.fullmoney" @blur="onBlurFullmoney" class="input-text" :min="0" :max="999" :controls="false"/>
        元，以折扣率
        <el-input-number :controls="false" :min="0" :max="100" v-model="bargainFull.discountRate" class="input-text" />%执行<div class="tip">*举例：打九折，折扣率设置10</div>
      </div>
    </el-form-item>
    <el-form-item label="减掉金额对应结账方式">
      <el-select v-model="bargainFull.paymentId">
        <el-option
          key="90002"
          label="减价"
          value="90002"
        />
        <el-option
          v-for="item in cutPaymentsList"
          :key="item.paymentId"
          :label="item.paymentName"
          :value="item.paymentId"
        />
      </el-select>
    </el-form-item>
    <el-form-item class="operation-item">
      <div class="notice">注：同一账单允许折扣方案与满减优惠共存，满减设置的是折后金额</div>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit btn-save" @click="onSubmit" v-if="!isChain">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { REGEX_PRICE } from 'constant/regex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT, PAYMENT_SALE_ID } from 'constant/constants';
import { validateDishName } from 'utils/validateUtil';
import { DatePickerAndText, PlanType } from '../components';
import fecha from 'fecha';
import { isChain, isShop } from 'utils/configUtil';

export default {
  name: 'bargainFull',
  components: {
    PlanType,
    DatePickerAndText
  },
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      planTypeList: [
        { planTypeId: 1, planTypeName: '全部' },
        { planTypeId: 2, planTypeName: '星期' },
        { planTypeId: 3, planTypeName: '可用日期' }
      ],
      dto: {
        bargainId: '',
        bargainName: '',
        dateTime: '',
        beginTime: '',
        endTime: '',
        msectionIdList: [],
        planType: 1,
        planTypeValue: '',
        notusableDate: '',
        weekDays: '',
        status: OK
      },
      bargainFull: {
        fullCutType: 0,
        fullmoney: '0',
        cutmoney: '0.00',
        discountRate: '0',
        paymentId: PAYMENT_SALE_ID,
        cutRadioValue: '0',
        status: 1
      },
      settingType: 1,
      isEdit: !!this.$route.params.bargainId,
      rules: {
        bargainName: [
          { required: true, message: '请输入金额满减方案名称', trigger: 'blur' },
          { validator: validateDishName, trigger: 'blur' }
        ],
        dateTime: [{ required: true, message: '请选择日期' }]
      },
//      isChain: isChain(),
      isChain: false,
      isShop: isShop()
    };
  },
  watch: {
    'bargainFull.cutRadioValue' () {
      this.changeValue();
    }
  },
  async created () {
    const { bargainId } = this.$route.params;
    if (this.isEdit) {
      await this.fetchBargainFullDetail({ bargainId });
      this.initData();
    } else {
      await this.getBargainMaxId();
      this.dto.bargainId = this.lastId;
    }
    if (this.isShop) {
      await this.getAllMSection();
    }

    await this.getCutPaymentsList();
  },
  computed: mapState({
    bargainFullDetail: state => state.preferential.bargainFull.bargainFullDetail,
    cutPaymentsList: state => state.preferential.bargainFull.cutPaymentsList,
    allMSectionList: state => state.dishes.sellPlan.allMSectionList,
    lastId: state => state.preferential.bargainFull.lastId,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'getAllMSection',
      'getBargainMaxId',
      'insertBargainFull',
      'updateBargainFull',
      'getCutPaymentsList',
      'fetchBargainFullDetail'
    ]),
    initData () {
      const { dto, bargainFullDetail } = this;
      const { beginTime, endTime, msectionIdList, bargainFull, planTypeValue, planType } = bargainFullDetail;
      if (planType === 2) {
        this.dto.weekDays = planTypeValue;
      }
      this.dto = {
        ...dto,
        ...bargainFullDetail,
        dateTime: [new Date(beginTime), new Date(endTime)],
        msectionIdList: msectionIdList ? msectionIdList.split(',') : [],
        planTypeValue: planType === 3 ? planTypeValue : ''
      };

      this.bargainFull = {
        ...bargainFull,
        cutRadioValue: bargainFull.cutmoney === '0.00' ? '1' : '0'
      };

      this.settingType = +bargainFull.cutmoney === 0 ? 1 : 0;
    },
    changeValue () {
      const { cutRadioValue } = this.bargainFull;
      if (cutRadioValue === '0') {
        this.bargainFull.discountRate = '0';
      } else {
        this.bargainFull.cutmoney = '0.00';
      }
    },
    onSelectDate (date, type) {
      const value = this.dto[type];
      date = fecha.format(date, 'MMDD');
      if ((value !== '') && (value.substr(value.length - 1, 1) !== ',')) {
        this.dto[type] += ',';
      }

      const index = value.split(',').findIndex(item => item === date);
      if (index < 0) {
        this.dto[type] += date;
      }
    },
    onChangeWeek (data) {
      this.dto.weekDays = data.toString();
    },
    onChangeDate (value, type) {
      this.dto[type] = value;
    },
    onBlurFullmoney (event) {
      const { value } = event.target;
      this.bargainFull.fullmoney = REGEX_PRICE.test(value) ? value : '0';
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      const { planType, msectionIdList, planTypeValue, weekDays, dateTime } = this.dto;
      const [beginTime, endTime] = dateTime;
      this.dto = {
        ...this.dto,
        beginTime: fecha.format(beginTime, 'YYYY-MM-DD'),
        endTime: fecha.format(endTime, 'YYYY-MM-DD'),
        msectionIdList: msectionIdList.toString(),
        planTypeValue: planTypeValue.toString()
      };
      if (planType === 1) {
        this.dto.planTypeValue = '1';
      } else if (planType === 2) {
        this.dto.planTypeValue = weekDays;
      }

      const { dto, bargainFull } = this;
      delete this.dto.bargainFull;
      +this.settingType === 1 ? bargainFull.cutmoney = 0 : bargainFull.discountRate = 0;
      if (this.isEdit) {
        await this.updateBargainFull({ dto, bargainFull });
      } else {
        await this.insertBargainFull({ dto, bargainFull });
      }

      if (!this.errorStatus) {
        this.onCancel();
      }
    },
    onCancel () {
      this.$router.push({ path: '/myd/preferential/bargainFull' });
    }
  }
};
</script>

<style lang="scss">
  .bargain-full-add-or-edit {
    padding: 15px;
    margin-top: 15px;

    .el-date-picker {
      width: 100% !important;
    }

    .second-title {
      font-weight: 600;
      font-size: 15px;
    }

    .input-text {
      width: 100px;
      height: 38px;
      margin: 0 5px;
    }

    .msection {
      .el-checkbox {
        width: 300px;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }

    .tip {
      color: #FFB038;
    }

    .notice {
      color: red;
      font-weight: 600;
    }
  }
</style>
