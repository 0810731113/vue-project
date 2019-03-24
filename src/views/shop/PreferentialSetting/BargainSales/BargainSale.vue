<template>
  <el-form class="mw-form bargain-sale-add-or-edit" ref='form' :model="dto" :rules="rules" label-width="180px">
    <el-form-item label="菜品特价方案名称" prop="bargainName">
      <el-input placeholder="请输入菜品特价方案名称" v-model="dto.bargainName" :maxlength='50' />
    </el-form-item>
    <el-form-item label="计划时间" prop="dateTimePlan">
      <el-date-picker
        class="date-picker"
        :editable="false"
        v-model="dto.dateTimePlan"
        type="daterange"
        placeholder="请选择时间范围">
      </el-date-picker>
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
    <el-form-item prop="isCustom"  v-if="!isShop" label="餐段">
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
        :disabled="dto.dateTimePlan"
        :selectedDate="dto.planTypeValue">
      </plan-type>
    </el-form-item>
    <el-form-item label="特价菜品" prop="bargainItems">
      <span class="tip">已添加菜品{{bargainItems.length}}个</span>
      <div class="menu-search">
        <el-input  v-model="searchData">
          <el-button slot="append" icon="el-icon-search" @click="onClickSearch" />
        </el-input>
        <el-button size="small" type="primary" class="btn-base" @click="onShowModal">添加菜品</el-button>
      </div>
      <el-table :data="bargainItems" border class="items-table">
        <el-table-column prop="itemId" align="center" label="编号" />
        <el-table-column prop="itemName" align="center" label="名称" />
        <el-table-column prop="orderUint" align="center" label="规格" />
        <el-table-column prop="salePrice" align="center" label="销售单价" />
        <el-table-column prop="bargainPrice" align="center" label="特价">
          <template slot-scope="scope">
            <el-input-number :controls="false" :min="0" size="small" v-model="scope.row.bargainPrice" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="删除">
          <template slot-scope="scope">
            <el-button size="small" class="btn-delete" @click="onDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch v-model="dto.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit" v-if="!isChain">保存</el-button>
    </el-form-item>
    <menu-modal :isFull="true" :onSubmitItems="onSubmitItems" :selectedIds="bargainItems" :selectedItems="bargainItems" ref="menuModal" />
    <popup title="删除操作" tips="您确认要删除此数据吗?" :handleOk="deleteRow" ref="popup" />
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';
import { validateDishName } from 'utils/validateUtil';
import { isShop, isChain } from 'utils/configUtil';
import { PlanType, MenuModal } from '../components';
import { Popup } from 'components';
import cloneDeep from 'lodash/cloneDeep';
import fecha from 'fecha';

export default {
  name: 'bargainSale',
  components: {
    PlanType,
    MenuModal,
    Popup
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
        dateTimePlan: [],
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
      bargainItems: [],
      originalList: [],
      searchData: '',
      isDeleteId: null,
      isEdit: !!this.$route.params.bargainId,
      rules: {
        bargainName: [
          { required: true, message: '请输入菜品特价方案名称', trigger: ['blur', 'change'] },
          { validator: validateDishName, trigger: ['blur', 'change'] }
        ],
        dateTimePlan: [{ required: true, message: '请选择时间范围' }],
        isCustom: [{ validator: validateShift, trigger: ['blur', 'change'] }]
      },
      isShop: isShop(),
//      isChain: isChain(),
      isChain: false,
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
    if (this.isEdit) {
      await this.fetchBargainSaleDetail({ bargainId });
      this.initData();
    } else {
      await this.getBargainMaxId();
      this.dto.bargainId = this.lastId;
    }
    if (this.isShop) {
      await this.getAllMSection();
    }
  },
  computed: mapState({
    bargainSaleDetail: state => state.preferential.bargainSale.bargainSaleDetail,
    allMSectionList: state => state.dishes.sellPlan.allMSectionList,
    lastId: state => state.preferential.bargainFull.lastId,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'getAllMSection',
      'getBargainMaxId',
      'insertBargainSale',
      'updateBargainSale',
      'fetchBargainSaleDetail'
    ]),
    initData () {
      const { dto, bargainSaleDetail } = this;
      const { beginTime, endTime, msectionIdList, planTypeValue, planType, customStartTime, customEndTime } = bargainSaleDetail;
      this.isCustom = !!(customStartTime || customEndTime);
      if (planType === 2) {
        this.dto.weekDays = planTypeValue;
      }

      this.dto = {
        ...dto,
        ...bargainSaleDetail,
        customEndTime: customEndTime && customEndTime.substring(-1, 5),
        customStartTime: customEndTime && customStartTime.substring(-1, 5),
        dateTimePlan: [new Date(beginTime), new Date(endTime)],
        msectionIdList: msectionIdList ? msectionIdList.split(',') : [],
        planTypeValue: planType === 2 ? '' : planTypeValue
      };

      this.bargainItems = cloneDeep(this.bargainSaleDetail.bargainSaleVOS);
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
    onChangeWeek (data) {
      this.dto.weekDays = data.toString();
    },
    onChangeDate (value, type) {
      this.dto[type] = value;
    },
    onShowModal () {
      this.$refs.menuModal.isShow = true;
    },
    onSubmitItems (datas) {
      this.bargainItems = [...this.bargainItems, ...datas];
      this.originalList = datas;
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
    onDelete (row) {
      this.isDeleteId = row.itemCd;
      this.$refs.popup.isShow = true;
    },
    deleteRow () {
      const { isDeleteId } = this;
      this.bargainItems = this.bargainItems.filter(item => {
        if (item.itemCd !== isDeleteId) {
          return item;
        }
      });

      this.originalList = this.bargainItems;
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;
      const { planType, msectionIdList, planTypeValue, weekDays, dateTimePlan, customEndTime, customStartTime } = this.dto;
      const [beginTime, endTime] = dateTimePlan;
      this.dto = {
        ...this.dto,
        customEndTime: customEndTime ? `${customEndTime}:00` : '',
        customStartTime: customStartTime ? `${customStartTime}:00` : '',
        beginTime: fecha.format(beginTime, 'YYYY-MM-DD'),
        endTime: fecha.format(endTime, 'YYYY-MM-DD'),
        msectionIdList: msectionIdList.toString(),
        planTypeValue: planTypeValue.toString()
      };
      if (planType === 2) {
        this.dto.planTypeValue = weekDays;
      }

      const { dto, bargainItems } = this;
      delete this.dto.bargainSaleVOS;

      if (this.isEdit) {
        await this.updateBargainSale({ dto, bargainItems });
      } else {
        await this.insertBargainSale({ dto, bargainItems });
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
.bargain-sale-add-or-edit {
  padding: 15px;
  margin-top: 15px;
  width: 70%;

  .tip {
    color: #FFB038;
    font-size: 15px;
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

  .menu-search {
    text-align: right;
    float: right;
    white-space: nowrap;
    display: inline-block;

    .el-input {
      width: 50%;
    }
  }

  .custom-section {
    margin-top: -22px;
  }

  .msection-list {
    min-width: 260px;
    line-height: 30px;
  }

  .define-msection {
    min-width: 80px;
    line-height: 30px;
  }

  .el-date-editor.el-input {
    width: 240px;
  }

  .items-table {
    margin-top: 15px;

    .el-table__body-wrapper {
      max-height: 300px;
    }
  }
}
</style>
