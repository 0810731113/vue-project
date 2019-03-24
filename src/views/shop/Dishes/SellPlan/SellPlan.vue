<template>
  <el-form class="mw-form sell-plan-add-or-edit" :rules="rules" ref="form" :model="form" label-width="120px">
    <el-form-item label="方案名称" prop="planName" class="plan-name-input">
      <el-input placeholder="请输入方案名称" v-model="form.planName" :maxlength='20' />
    </el-form-item>
    <el-form-item label="出售日期" prop="timeLimit">
      <el-select v-model="form.timeLimit" class="el-col-7">
        <el-option label="无限制" :value="FALSE" />
        <el-option label="指定时间" :value="TRUE" />
      </el-select>
      <el-date-picker
        class="el-col-17"
        :editable="false"
        v-show="form.timeLimit"
        v-model="form.dateTime"
        type="daterange"
        placeholder="选择时间范围" />
    </el-form-item>
    <el-form-item label="出售日" prop="sellDay">
      <el-checkbox-group v-model="form.sellDay">
        <el-checkbox v-for="item in sellDayList" :key="item.value" :label="item.value">{{item.text}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="出售餐段" class="is-required" prop="msectionIds">
      <el-checkbox-group v-model="form.msectionIds" class="output-msection">
        <div v-for="item in allMSectionList" :key="item.msectionId">
          <el-checkbox :label="item.msectionId">{{item.msectionName}}</el-checkbox>
          <span class="msection-time" v-if="form.msectionIds.includes(item.msectionId)">{{ `${item.beginTime} - ${item.endTime}` }}</span>
        </div>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="custom-section" prop="isCustom">
      <el-checkbox v-model="isCustom">自定义</el-checkbox>
      <el-time-picker
        placeholder="选择自定义时间"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        class="date-picker"
        :is-range="true"
        :arrow-control="true"
        :editable="false"
        :disabled="!isCustom"
        v-model="form.customerTime"
      />
    </el-form-item>
    <el-form-item label="出售区域" prop="mareaIds">
      <el-checkbox-group v-model="form.mareaIds" class="output-area">
        <el-checkbox v-for="item in allMareaList" :key="item.mareaId" :label="item.mareaId">{{item.mareaName}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="出售菜品" prop="menuCount">
      <el-button size="small" type="primary" @click="onShowRelation">已选择{{form.menuCount}}个</el-button>
    </el-form-item>
    <el-form-item label="服务范围" prop="serviceIds">
      <el-checkbox-group v-model="form.serviceIds" :min="1">
        <el-checkbox label="1">秒点</el-checkbox>
        <el-checkbox label="2">美易点Android</el-checkbox>
        <el-checkbox label="3">美易点Windows</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
    <relation-modal
      :treeData="tree"
      :itemType="ITEMTYPE.ALL"
      :menuList="menuList"
      :linkedMenus="linkedMenus"
      :fetchAllMenuItems="fetchAllMenuItems"
      :onChangeLinkedMenu="onChangeLinkedMenu"
      :onSelectedSubmitMenu="onChangeMenuCount"
      :rightTable="rightTable"
      ref="relation" />
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { RelationModal } from 'views/common';
import { OK, FORBIDDEN, TRUE, FALSE } from 'constant/statusCode';
import {
  ITEMTYPE,
  ITEMKIND,
  ON_TEXT,
  OFF_TEXT,
  INPUT_MAX_LENGTH
} from 'constant/constants';
import { validateDishName } from 'utils/validateUtil';
import fecha from 'fecha';

export default {
  name: 'SellPlan',
  components: {
    RelationModal
  },
  data () {
    const validateShift = (rule, value, callback) => {
      const { customerTime, msectionIds } = this.form;
      if (!this.isCustom && !msectionIds.length) {
        callback(new Error('出售餐段不能为空!'));
      }
      if (this.isCustom && !customerTime) {
        callback(new Error('自定义餐段不正确!'));
      } else {
        callback();
      }
    };
    return {
      OK,
      FORBIDDEN,
      TRUE,
      FALSE,
      ON_TEXT,
      OFF_TEXT,
      ITEMTYPE,
      INPUT_MAX_LENGTH,
      rightTable: [
        { key: 'itemName', name: '菜品' },
        { key: 'orderUint', name: '规格' },
        { key: 'salePrice', name: '标准价' }
      ],
      form: {
        guid: '',
        planName: '',
        timeLimit: 0,
        customerTime: [new Date(), new Date()],
        dateTime: [new Date(), new Date()],
        sellDay: [],
        msectionIds: [],
        mareaIds: [],
        lstMenuItem: [],
        menuCount: 0,
        status: OK,
        operate: '',
        serviceIds: ['1'],
        customerStartTime: '',
        customerEndTime: ''
      },
      linkedMenus: [],
      isCustom: false,
      isEdit: !!this.$route.params.guid,
      rules: {
        planName: [
          { required: true, message: '请输入方案名称', trigger: ['blur', 'change'] },
          { validator: validateDishName, trigger: ['blur', 'change'] }
        ],
        sellDay: [{ required: true, message: '请选择出售日' }],
        mareaIds: [{ required: true, message: '请选择出售区域' }],
        serviceIds: [{ required: true }],
        isCustom: [{ validator: validateShift, trigger: ['blur', 'change'] }]
      }
    };
  },
  watch: {
    isCustom () {
      if (!this.isCustom) {
        this.form = {
          ...this.form,
          customerEndTime: null,
          customerStartTime: null
        };
      }
    }
  },
  async created () {
    const { guid } = this.$route.params;
    if (this.isEdit) {
      await this.getSellPlanDetail({ guid });
      this.initData();
    } else {
      this.form = { ...this.form, operate: 'add' };
    }
    await this.getAllSellDay();
    await this.getAllMarea();
    await this.getAllMSection();
  },
  computed: mapState({
    sellDayList: state => state.dishes.sellPlan.sellDayList,
    pageIndex: state => state.dishes.sellPlan.pageIndex,
    pageSize: state => state.dishes.sellPlan.pageSize,
    allMareaList: state => state.dishes.sellPlan.allMareaList,
    allMSectionList: state => state.dishes.sellPlan.allMSectionList,
    sellPlanDetail: state => state.dishes.sellPlan.sellPlanDetail,
    menuList: state => state.dishes.explain.menuList,
    tree: state => state.dishes.sellPlan.tree,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'getAllSellDay',
      'getSellPlanDetail',
      'saveMenuSellPlan',
      'getAllMarea',
      'getAllMSection',
      'fetchAllMenuItems',
      'fetchSellPlanTrees'
    ]),
    initData () {
      const { form, sellPlanDetail } = this;
      const { beginTime, endTime, sellDay, mAreaIds, mSectionIds, serviceIds, selectItems, selectItemsCount, customerStartTime, customerEndTime } = sellPlanDetail;
      this.isCustom = !!(customerStartTime || customerEndTime);
      this.form = {
        ...form,
        ...sellPlanDetail,
        dateTime: [new Date(beginTime), new Date(endTime)],
        customerTime: this.isCustom ? [new Date('2018-01-04 ' + customerStartTime), new Date('2018-01-04 ' + customerEndTime)] : [new Date(), new Date()],
        sellDay: sellDay.split(',').map(item => +item),
        mareaIds: mAreaIds.split(','),
        msectionIds: mSectionIds.split(','),
        menuCount: selectItemsCount,
        lstMenuItem: selectItems,
        serviceIds: serviceIds ? serviceIds.split(',') : ['1'],
        operate: 'edit'
      };
    },
    async onShowRelation (row) {
      await this.fetchSellPlanTrees({ type: ITEMKIND.INGREDIENT });
      await this.fetchAllMenuItems({ menuClsId: 0, itemType: ITEMTYPE.ALL });
      const relation = this.$refs.relation;
      const selectMenu = [];
      this.form.lstMenuItem.map(item => {
        selectMenu.push(item);
      });
      const items = [];
      this.menuList.filter(item => {
        selectMenu.filter(menu => {
          if (
            item.itemCd === menu.itemCd &&
            item.orderUintCd === menu.orderUintCd
          ) {
            items.push(item);
          }
        });
      });
      this.linkedMenus = items;
      relation.isShow = true;
    },
    onChangeLinkedMenu (item) {
      const index = this.linkedMenus.findIndex(
        menu =>
          menu.itemCd === item.itemCd && menu.orderUintCd === item.orderUintCd
      );
      if (index >= 0) {
        this.linkedMenus.splice(index, 1);
      } else {
        this.linkedMenus.push(item);
      }
    },
    onChangeMenuCount (datas) {
      const { itemCds } = datas;
      this.form.menuCount = itemCds.length;
      const items = this.linkedMenus.filter(item =>
        itemCds.includes(item.itemCd)
      );
      this.form.lstMenuItem = items;
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate(valid => {
        validForm = valid;
      });
      if (!validForm) return;

      const { timeLimit, dateTime, sellDay, mareaIds, msectionIds, serviceIds, customerTime } = this.form;
      const data = {
        ...this.form,
        sellDay: sellDay.toString(),
        mareaIds: mareaIds.toString(),
        serviceIds: serviceIds.toString(),
        msectionIds: msectionIds.toString(),
        beginTime: fecha.format(new Date(), 'YYYY-MM-DD 00:00:00'), // 无限制, 数据库不能为空。。
        endTime: fecha.format(new Date(), 'YYYY-MM-DD 00:00:00')
      };

      if (timeLimit) {
        const [beginTime, endTime] = dateTime;
        data.beginTime = fecha.format(beginTime, 'YYYY-MM-DD 00:00:00');
        data.endTime = fecha.format(endTime, 'YYYY-MM-DD 00:00:00');
      }

      if (this.isCustom) {
        const [customerStartTime, customerEndTime] = customerTime;
        data.customerStartTime = fecha.format(customerStartTime, 'HH:mm:ss');
        data.customerEndTime = fecha.format(customerEndTime, 'HH:mm:ss');
      }

      await this.saveMenuSellPlan(data);
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
.sell-plan-add-or-edit {
  .plan-name-input {
    width: 80%;
  }

  .custom-section {
    width: 100%;
    display: inline-block;
    margin-top: -16px;

    .date-picker {
      width: 60% !important;
    }
  }

  .output-msection {
    .el-checkbox {
      width: 200px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .msection-time {
      vertical-align: top;
    }
  }

  .output-area {
    .el-checkbox {
      width: 200px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }

  .el-date-editor--daterange.el-input {
    margin-left: 25px;
  }

  .operation-item {
    margin-right: 80px;
  }
}
</style>
