<template>
  <div class="business-payment">
    <!-- search bar -->
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="支付方式名称：">
        <el-input v-model="searchForm.paymentName" placeholder="付款方式" />
      </el-form-item>
      <el-form-item label="付款类型:">
        <el-select v-model="searchForm.paymentTypeId" @change="getPaymentList">
          <el-option label="所有类型" :value="null" />
          <el-option
            v-for="item in paymentTypes"
            :key="item.paymentTypeId"
            :label="item.paymentTypeName"
            :value="item.paymentTypeId" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否实收:">
        <el-select v-model="searchForm.isCalcPaid" @change="getPaymentList">
          <el-option label="全部" :value="null" />
          <el-option label="实收" :value="TRUE" />
          <el-option label="非实收" :value="FALSE" />
        </el-select>
      </el-form-item>
      <el-form-item label="显示/隐藏:">
        <el-select v-model="searchForm.isPremium" @change="getPaymentList">
          <el-option label="全部" :value="null" />
          <el-option label="显示项" :value="FALSE" />
          <el-option label="隐藏项" :value="TRUE" />
        </el-select>
      </el-form-item>
      <div class="button-bar">
        <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
        <el-button class="btn-reset" @click="onClickReset">重置</el-button>
      </div>
    </el-form>
    <div class="division-line" />
    <!-- tools btns -->
    <el-dropdown class="btn-dropdown" menu-align="start" trigger="click" @command="onClickDropdown" v-if="!isChain">
      <el-button type="primary" class="btn-base" icon="el-icon-plus" :disabled="isMaintain">
        新增<i class="el-icon-caret-bottom el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown" class="payment-dropdown">
        <el-dropdown-item command="add">新增</el-dropdown-item>
        <el-dropdown-item command="add/mwcoupon" divided>美味优惠券</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button class="btn-primary" :disabled="isMaintain" @click="onShowSetting" v-if="!isChain">批量设置</el-button>
    <el-button class="btn-primary" :disabled="isMaintain" @click="onShowModalWithType('popup')" v-if="!isChain">删除</el-button>
    <el-button class="btn-primary" :disabled="isMaintain" @click="onShowSort" v-if="!isChain">顺序调整</el-button>
    <el-button class="btn-primary" @click="() => { this.$router.push('/myd/business/payment/type') }" v-if="!isChain">设置</el-button>
    <el-button class="btn-primary" :disabled="isMaintain" @click="onShowShortCutKeys" v-if="!isChain">快捷键设置</el-button>
    <!-- tables -->
    <el-table :data="paymentList" border @selection-change="onChangeSelection" class="mw-table">
      <el-table-column type="selection" min-width="50px" :selectable="onCheckDefalut" />
      <el-table-column prop="paymentName" class-name="table-auto" align="center" label="付款方式" min-width="15%" />
      <el-table-column prop="paymentTypeName" class-name="table-auto" align="center" label="付款类型" min-width="12%" />
      <el-table-column prop="isPremium" :formatter="getBoolText" align="center" label="是否隐藏" min-width="12%" />
      <el-table-column prop="isCalcPaid" :formatter="getBoolText" align="center" label="是否进入实收" min-width="12%" />
      <el-table-column prop="color" align="center" label="按钮颜色" min-width="15%">
        <template slot-scope="scope">
          <div class="btn-color" :style="{ backgroundColor: scope.row.color }" @click="onShowModalWithType('colorModal', scope.row)">选择颜色</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" :formatter="getStatusText" min-width="10%" />
      <el-table-column align="center" label="操作" min-width="20%">
        <template slot-scope="scope">
          <mw-button
            v-if="!(+scope.row.isCompany === 1 && scope.row.dataKind === SYSTEM_KEY)"
            :disabled="(scope.row.dataKind === SYSTEM_KEY) || isMaintain"
            class="btn-edit"
            content="编辑"
            @click="onClickEdit(scope.row)" />
          <mw-button
            v-if="!(+scope.row.isCompany === 1 || scope.row.dataKind === SYSTEM_KEY)"
            :disabled="(scope.row.dataKind === SYSTEM_KEY) || isMaintain"
            class="btn-delete"
            content="删除"
            @click="onShowModalWithType('popup', scope.row)" />
          <mw-button
            :disabled="isMaintain"
            :class="scope.row.isPremium ? 'btn-forbid' : 'btn-ok'"
            :content="scope.row.isPremium ? '隐藏' : '显示'"
            @click="onUpdateColorOrPremium({ isPremium: +!scope.row.isPremium, paymentId: scope.row.paymentId })" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount" />
    <color-modal ref="colorModal" :data="editRow" :onUpdateColor="onUpdateColorOrPremium" />
    <payment-setting
      ref="paymentSetting"
      :paymentIds="selectedIds"
      :data="selectedNames"
      :paymentTypes="paymentTypes"
      :updatePayments="updatePaymentByBatch" />
    <Sortable
      :sortList="sortList"
      :handleOK="onUpdateSort"
      :headerKey="['序号', '付款方式']"
      :sortKey="['paymentId', 'paymentName']"
      ref="sortable" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDeleteByIds"
      ref="popup" />
    <Toast
      ref='toast'
      content="请选择要操作的数据!"
      :timeout="2000"
      type="warning" />
    <shortcut-modal
      ref="shortcut"
      :data="paymentSortList"
      :shortCutKeys="shortCutKeys" />
    <coupon-modal
      :datas="mwCouponsList"
      :fetchMWCoupons="fetchMWCoupons"
      :recordCount="couponRecordCount"
      ref="coupon" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { ColorModal, PaymentSetting, ShortcutModal, CouponModal } from '../components';
import { Sortable, Popup, Pagination, Toast, MwButton } from 'components';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import { checkMaintainRight } from 'utils/permissionUtil';
import { SYSTEM_KEY } from 'constant/constants';
import { TRUE, FALSE } from 'constant/statusCode';
import { isShop, isChain } from 'utils/configUtil';

export default {
  name: 'paymentMain',
  data () {
    return {
      isShop: isShop(),
      isChain: isChain(),
      TRUE,
      FALSE,
      SYSTEM_KEY,
      editRow: {},
      selectedIds: [],
      selectedNames: [],
      sortList: [],
      searchForm: {
        paymentName: null,
        paymentTypeId: null,
        isCalcPaid: null,
        isPremium: null
      },
      isMaintain: !checkMaintainRight(this)
    };
  },
  components: {
    ColorModal,
    CouponModal,
    PaymentSetting,
    ShortcutModal,
    Sortable,
    MwButton,
    Popup,
    Pagination,
    Toast
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllPayment({ pageIndex, pageSize });
    await this.fetchAllPaymentTypes({ type: SYSTEM_KEY });
  },
  computed: mapState({
    paymentList: state => state.business.payment.paymentList,
    paymentSortList: state => state.business.payment.sortList,
    paymentTypes: state => state.business.paymentType.typesList,
    mwCouponsList: state => state.business.payment.mwCouponsList,
    shortCutKeys: state => state.business.payment.shortCutKeys,
    recordCount: state => state.business.payment.recordCount,
    pageIndex: state => state.business.payment.pageIndex,
    pageSize: state => state.business.payment.pageSize,
    couponRecordCount: state => state.business.payment.couponRecordCount
  }),
  methods: {
    ...mapActions([
      'fetchAllPayment',
      'fetchSortPayment',
      'fetchAllPaymentTypes',
      'fetchMWCoupons',
      'deletePayment',
      'deletePaymentByIds',
      'updatePayment',
      'updateSortPayment',
      'updatePaymentByBatch',
      'updateColorOrPremium'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.getPaymentList(pageIndex, this.pageSize);
    },
    async onClickSearch () {
      await this.getPaymentList(DEFAULT_PAGE, DEFAULT_PAGES);
    },
    async onUpdateColorOrPremium (params) {
      const { pageIndex, pageSize } = this;
      await this.updateColorOrPremium(params);
      await this.getPaymentList(pageIndex, pageSize);
    },
    onClickReset () {
      this.searchForm = {
        paymentName: null,
        paymentTypeId: null,
        isCalcPaid: null,
        isPremium: null
      };
    },
    onClickEdit (row) {
      this.$router.push(`/myd/business/payment/edit/${row.paymentId}`);
    },
    onCheckDefalut (row) {
      return row.dataKind !== SYSTEM_KEY;
    },
    onShowModalWithType (type, row) {
      if (this.isMaintain) return;
      if (!row && !this.selectedIds.length) {
        this.$refs.toast.isShow = true;
        return;
      }
      this.$refs[type].isShow = true;
      if (row) {
        this.editRow = row;
      }
    },
    onShowSetting () {
      if (!this.selectedIds.length) {
        this.$refs.toast.isShow = true;
        return;
      }
      const names = [];
      this.paymentList.map(item => {
        if (this.selectedIds.includes(item.paymentId)) {
          names.push(item.paymentName);
        }
      });
      this.selectedNames = names;
      this.$refs.paymentSetting.isShow = true;
    },
    onUpdateSetting (params) {
      this.paymentList.map(item => {
        if (this.selectedIds.includes(item.paymentId)) {
          this.onUpdateParams(params, item);
        }
      });
    },
    onUpdateParams (params, editRow = this.editRow) {
      this.editRow = { ...editRow, ...params };
      this.updatePayment(this.editRow);
      this.editRow = {};
    },
    async onUpdatePayments (params) {
      const { selectedIds, pageIndex, pageSize } = this;
      await this.updatePaymentByBatch({ ...params, paymentIds: selectedIds });
      await this.fetchAllPayment({ pageIndex, pageSize });
    },
    async onClickDropdown (type) {
      if (type === 'add') {
        this.$router.push(`/myd/business/payment/${type}`);
        return;
      }
      await this.fetchMWCoupons({ type: '1,2,3', pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES });
      this.$refs.coupon.isShow = true;
    },
    async onClickDeleteByIds () {
      if (!this.selectedIds.length) {
        await this.deletePayment(this.editRow.paymentId);
        return;
      }
      const { pageIndex, pageSize, selectedIds } = this;
      await this.deletePaymentByIds(selectedIds);
      await this.fetchAllPayment({ pageIndex, pageSize });
    },
    onChangeSelection (datas) {
      this.selectedIds = [];
      datas.map(data => {
        this.selectedIds.push(data.paymentId);
      });
    },
    async onShowSort () {
      if (!this.paymentSortList.length) {
        await this.fetchSortPayment();
      }
      this.sortList = this.paymentSortList.slice();
      this.$refs.sortable.isShow = true;
    },
    async onShowShortCutKeys () {
      await this.fetchSortPayment();
      this.$refs.shortcut.isShow = true;
    },
    async onUpdateSort (items) {
      let sortItems = [];
      items.map((item, index) => {
        const { paymentId } = item;
        sortItems.push({ paymentId, sortOrder: index });
      });
      await this.updateSortPayment({ dtos: sortItems });
      await this.fetchAllPayment({ pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES });
    },
    getPaymentTypeName (paymentTypeId) {
      const { paymentTypes } = this;
      if (paymentTypes && paymentTypes.length) {
        const type = this.paymentTypes.find(item => item.paymentTypeId === paymentTypeId);
        return type && type.paymentTypeName;
      }
    },
    getBoolText (row, column) {
      return row[column.property] ? '是' : '否';
    },
    async getPaymentList (pageIndex, pageSize) {
      pageIndex = pageIndex || DEFAULT_PAGE;
      pageSize = pageSize || DEFAULT_PAGES;
      const { paymentName } = this.searchForm;
      await this.fetchAllPayment({ ...this.searchForm, pageIndex, pageSize, paymentName: paymentName || null });
    }
  }
};
</script>

<style lang="scss">
.business-payment {
  padding: 15px;

  .division-line {
    margin: 15px 0;
  }

  .search-bar {
    .el-form-item {
      margin-bottom: 12px;

      .el-select {
        width: 180px;
      }
    }

    .button-bar {
      text-align: center;
    }
  }

  .btn-base {
    width: inherit;
  }

  .btn-shortcut {
    float: right;
  }

  .btn-dropdown {
    margin-right: 10px;

    .btn-add {
      font-size: 12px;
    }
  }

  .pagination-wrapper {
    margin: 15px 0;
  }

  .btn-color {
    width: 100%;
    cursor: pointer;
  }
}

.payment-dropdown {
  font-size: 14px;
  line-height: 24px;
}
</style>
