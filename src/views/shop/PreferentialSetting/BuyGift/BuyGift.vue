<template>
  <el-form class="mw-form buy-gift-form" ref='form' :model="dto" :rules="rules" label-width="180px">
    <el-form-item label="菜品买减方案名称" prop="bargainName">
      <el-input placeholder="请输入菜品买减方案名称" v-model="dto.bargainName" :maxlength='50' />
    </el-form-item>
    <el-form-item label="计划时间" prop="dateTime">
      <el-date-picker class="el-col-17" :editable="false" v-model="dto.dateTime" type="daterange" placeholder="请选择时间范围" />
    </el-form-item>
    <el-form-item label="餐段" prop="msectionIdList" v-if="isShop">
      <el-checkbox-group v-model="dto.msectionIdList" class="msection">
        <div class="el-col-12" v-for="item in allMSectionList" :key="item.msectionId">
          <el-checkbox :label="item.msectionId">{{item.msectionName}}&nbsp;{{item.beginTime}}-{{item.endTime}}</el-checkbox>
          <span class="msection-time" v-if="dto.msectionIdList.includes(item.msectionId)">
            {{ `${item.beginTime} - ${item.endTime}` }}
          </span>
        </div>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="custom-section" prop="isCustom"  v-if="isShop">
      <el-checkbox v-model="isCustom">自定义</el-checkbox>
      <el-time-select placeholder="起始时间" class="date-picker" :editable="false" :disabled="!isCustom" v-model="dto.customStartTime" :picker-options="{
          start: '00:00',
          step: '00:30',
          end: '23:30',
          maxTime: dto.customEndTime
        }">
      </el-time-select>
      <el-time-select placeholder="结束时间" class="date-picker" :editable="false" :disabled="!isCustom" v-model="dto.customEndTime" :picker-options="{
          start: '00:00',
          step: '00:30',
          end: '23:30',
          minTime: dto.customStartTime
        }">
      </el-time-select>
    </el-form-item>
    <el-form-item  prop="isCustom" label="餐段"  v-if="!isShop">
      <el-checkbox v-model="isCustom">自定义</el-checkbox>
      <el-time-select placeholder="起始时间" class="date-picker" :editable="false" :disabled="!isCustom" v-model="dto.customStartTime" :picker-options="{
          start: '00:00',
          step: '00:30',
          end: '23:30',
          maxTime: dto.customEndTime
        }">
      </el-time-select>
      <el-time-select placeholder="结束时间" class="date-picker" :editable="false" :disabled="!isCustom" v-model="dto.customEndTime" :picker-options="{
          start: '00:00',
          step: '00:30',
          end: '23:30',
          minTime: dto.customStartTime
        }">
      </el-time-select>
    </el-form-item>
    <el-form-item label="计划类型" prop="planType">
      <plan-type
        v-model="dto.planType"
        :onSelectDate="(date) => onSelectDate(date, 'planTypeValue')"
        :onChangeDate="(date) => onChangeDate(date, 'planTypeValue')"
        @changeWeek="onChangeWeek"
        :selectedWeekDay="dto.weekDays"
        :disabled="dto.dateTime"
        :selectedDate="dto.planTypeValue">
      </plan-type>
    </el-form-item>
    <el-form-item label="买减菜品">
      <span class="tip">已添加菜品 {{ bargainItems.length }} 个</span>
      <div class="menu-search-bar">
        <el-input v-model="searchData" class="menu-search">
          <el-button slot="append" icon="el-icon-search" @click="onClickSearch"></el-button>
        </el-input>
        <el-button class="btn-base" @click="onShowModal">添加菜品</el-button>
      </div>
    </el-form-item>
    <el-form-item prop="status">
      <el-table border :data="bargainItems" style="width: 100%">
        <el-table-column prop="itemId" label="编号" align="center" />
        <el-table-column prop="itemName" label="名称" align="center" />
        <el-table-column prop="orderUint" label="规格" align="center" />
        <el-table-column prop="salePrice" label="原价" align="center" />
        <el-table-column prop="fristCount" label="前原价" align="center">
          <template slot-scope="scope">
            <el-input-number :controls="false" :min="0" size="small" v-model="scope.row.saleQty" />
          </template>
        </el-table-column>
        <el-table-column prop="lastCount" label="后变价" align="center">
          <template slot-scope="scope">
            <el-input-number :controls="false" :min="0" size="small" v-model="scope.row.saleQty_gift" />
          </template>
        </el-table-column>
        <el-table-column prop="money" label="变价" align="center">
          <template slot-scope="scope">
            <el-input-number :controls="false" :min="0" size="small" v-model="scope.row.bargainPrice" />
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="折扣率%" align="center">
          <template slot-scope="scope">
            <el-input-number :controls="false" :min="0" :max="100" size="small" v-model="scope.row.discountRate" />
          </template>
        </el-table-column>
        <el-table-column label="删除" align="center">
          <template slot-scope="scope">
            <el-button class="btn-delete" @click="onDeleteDiscount(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch v-model="dto.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit" v-if="!isChain">保存</el-button>
    </el-form-item>
    <menu-modal :isFull="false" :onSubmitItems="onSubmitItems" :selectedIds="bargainItems" :selectedItems="bargainItems" ref="menuModal" />
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';
import { validateDishName } from 'utils/validateUtil';
import { PlanType, MenuModal } from '../components';
import cloneDeep from 'lodash/cloneDeep';
import fecha from 'fecha';
import { isChain, isShop } from 'utils/configUtil';

export default {
  name: 'buyGift',
  components: {
    MenuModal,
    PlanType
  },
  data () {
    const validateShift = (rule, value, callback) => {
      const { customEndTime, customStartTime } = this.dto;
      if (this.isCustom && (!customEndTime || !customStartTime)) {
        callback(new Error('自定义餐段不正确'));
      } else {
        callback();
      }
    };
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      dto: {
        bargainId: '',
        bargainName: '',
        dateTime: '',
        beginTime: '',
        endTime: '',
        msectionIdList: [],
        planType: 1,
        planTypeValue: '',
        weekDays: '',
        status: OK,
        customStartTime: '',
        customEndTime: ''
      },
      isCustom: false,
      searchData: '',
      originalList: [],
      bargainItems: [],
      isEdit: !!this.$route.params.bargainId,
      rules: {
        bargainName: [
          { required: true, message: '请输入菜品买减方案名称', trigger: 'blur' },
          { validator: validateDishName, trigger: 'blur' }
        ],
        dateTime: [{ required: true, message: '请选择日期' }],
        isCustom: [{ validator: validateShift, trigger: ['blur', 'change'] }]
      },
//      isChain: isChain(),
      isChain: false,
      isShop: isShop()
    };
  },
  watch: {
    isCustom () {
      if (!this.isCustom) {
        this.dto = { ...this.dto, customEndTime: null, customStartTime: null };
      }
    }
  },
  async created () {
    const { bargainId } = this.$route.params;
    if (bargainId) {
      await this.fetchBuyGiftDetail({ bargainId });
      this.initData();
    } else {
      await this.getBuyGiftMaxId();
      this.dto.bargainId = this.lastId;
    }
    if (this.isShop) {
      await this.getAllMSection();
    }
  },
  computed: mapState({
    lastId: state => state.preferential.buyGift.lastId,
    detail: state => state.preferential.buyGift.detail,
    allMSectionList: state => state.dishes.sellPlan.allMSectionList,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'saveBuyGift',
      'updateBuyGift',
      'getAllMSection',
      'getBuyGiftMaxId',
      'fetchBuyGiftDetail'
    ]),
    initData () {
      this.dto = this.detail;
      const { beginTime, endTime, msectionIdList, planTypeValue, planType, customStartTime, customEndTime } = this.detail;
      this.isCustom = !!(customStartTime || customEndTime);
      if (planType === 2) {
        this.dto.weekDays = planTypeValue;
      }

      this.dto = {
        ...this.dto,
        customEndTime: customEndTime && customEndTime.substring(-1, 5),
        customStartTime: customEndTime && customStartTime.substring(-1, 5),
        dateTime: [new Date(beginTime), new Date(endTime)],
        msectionIdList: msectionIdList ? msectionIdList.split(',') : [],
        planTypeValue: planType === 3 ? planTypeValue : ''
      };

      this.bargainItems = cloneDeep(this.detail.bargainBuyVOS);
      this.originalList = this.bargainItems;
    },
    onShowModal () {
      this.$refs.menuModal.isShow = true;
    },
    onSubmitItems (datas) {
      this.bargainItems = [...this.bargainItems, ...datas];
      this.originalList = datas;
    },
    onDeleteDiscount (row) {
      this.bargainItems = this.bargainItems.filter(item => item.itemCd !== row.itemCd);
      this.originalList = this.bargainItems;
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
    onClickSearch () {
      const { searchData, originalList } = this;
      this.bargainItems = originalList;
      const newList = this.bargainItems.filter(item => {
        if (item.itemName.includes(searchData)) {
          return item;
        }
      });
      this.bargainItems = newList;
    },
    onChangeWeek (data) {
      this.dto.weekDays = data.toString();
    },
    onChangeDate (value, type) {
      this.dto[type] = value;
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      const { planType, msectionIdList, planTypeValue, weekDays, dateTime, customEndTime, customStartTime } = this.dto;
      const [beginTime, endTime] = dateTime;
      this.dto = {
        ...this.dto,
        customEndTime: customEndTime ? `${customEndTime}:00` : '',
        customStartTime: customStartTime ? `${customStartTime}:00` : '',
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

      const { dto, bargainItems } = this;
      this.isEdit
        ? await this.updateBuyGift({ dto, bargainItems })
        : await this.saveBuyGift({ dto, bargainItems });
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
  .buy-gift-form {
    width: 65%;

    .tip {
      color: #FFB038;
      font-size: 15px;
    }

    .menu-search-bar {
      float: right;

      .menu-search {
        width: 60%;
      }
    }

    .msection {
      .el-checkbox {
        width: 300px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .msection-time {
        vertical-align: top;
      }
    }

    .custom-section {
      margin-top: -22px;
    }
  }
</style>
