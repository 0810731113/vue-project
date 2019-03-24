<template>
  <div class="reconciliation-container">
    <el-form :inline="true" ref="search" :model="searchForm" :rules="rules" class="search-bar">
      <el-form-item label="门店:">
        <el-select v-model="searchForm.shopId" @change="onShopSelectionChange">
          <el-option
            v-for="item in shopList"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="日期:">
        <el-date-picker
          v-model="searchForm.sellDate"
          type="date"
          :clearable="false"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="销售单号:" prop="sellNo">
        <el-input v-model="searchForm.sellNo" placeholder="销售单号" />
      </el-form-item>
      <el-form-item label="收银员:">
        <el-select v-model="searchForm.staffId">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in userList"
            :key="item.staffId"
            :label="item.staffName"
            :value="item.staffId"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="horizontal-center">
      <el-button class="btn-search" @click="onSearchClick">搜索</el-button>
      <el-button class="btn-reset" @click="onResetClick">重置</el-button>
    </div>
    <div class="division-line"></div>
    <el-table :data="reconciliationDetailList" border class="mw-table">
      <el-table-column prop="sellNo" align="center" label="销售单号" >
        <template slot-scope="scope">
          <span class="link" @click="() => onShowModal('detail', scope.row)">{{scope.row.sellNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billSourceName" align="center" label="订单来源" />
      <el-table-column prop="staffName" align="center" label="收银员" />
      <el-table-column prop="checkEndTime" align="center" label="结账时间" />
      <el-table-column prop="totalAmt" align="center" label="支付金额" />
      <el-table-column prop="note" align="center" class="table-auto" label="备注" />
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <mw-button content="调账" class="btn-reconciliation" :disabled="isMaintain" @click="() => onShowModal('action', scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination
    :onChangeCurrent="onChangeCurrent"
    :currentPage="pageIndex"
    :pageSize="pageSize"
    :totalCount="recordCount" />
    <reconciliation-detail ref="detail"></reconciliation-detail>
    <reconciliation ref="action" :detail="reconciliationDetail" :successCallBack="successCallBack"></reconciliation>
    <toast
      ref='toast'
      content="调账成功，调账后的报表数据须第二天生效!"
      :timeout="2000"
      type="success" />
  </div>
</template>
<script>
  import { MwButton, Pagination, Toast } from 'components';
  import { mapActions, mapState } from 'vuex';
  import fecha from 'fecha';
  import ReconciliationDetail from './ReconciliationDetail';
  import Reconciliation from './Reconciliation';
  import { validateNumber } from 'utils/validateUtil';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'ReconciliationMain',
    components: {
      MwButton,
      Pagination,
      ReconciliationDetail,
      Reconciliation,
      Toast
    },
    data () {
      return {
        reconciliationDetail: null,
        searchForm: {
          shopId: null,
          sellDate: '',
          sellNo: null,
          staffId: null
        },
        searchFormBackUp: {
          shopId: null,
          sellDate: '',
          sellNo: null,
          staffId: null
        },
        rules: {
          sellNo: [
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ]
        },
        isMaintain: !checkMaintainRight(this)
      };
    },
    async created () {
      await this.fetchReconciliationShopList();
      this.searchForm.shopId = this.shopList.length ? this.shopList[0].shopId : null;
      const { shopId } = this.searchForm;
      await this.fetchReconciliationUserList({ shopId });
//      await this.refreshTableFromServer(this.searchFormBackUp);
    },
    computed: mapState({
      shopList: state => state.reconciliation.reconciliationDetail.shopList,
      userList: state => state.reconciliation.reconciliationDetail.userList,
      pageIndex: state => state.reconciliation.reconciliationDetail.pageIndex,
      pageSize: state => state.reconciliation.reconciliationDetail.pageSize,
      recordCount: state => state.reconciliation.reconciliationDetail.recordCount,
      reconciliationDetailList: state => state.reconciliation.reconciliationDetail.reconciliationDetailList
    }),
    methods: {
      ...mapActions([
        'fetchReconciliationShopList',
        'fetchReconciliationDetailList',
        'fetchReconciliationUserList',
        'fetchReconciliationDetailItem',
        'fetchReconciliationPaymentList',
        'saveReconciliationDetail'
      ]),
      async onSearchClick () {
        let validForm = true;
        this.$refs.search.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        await this.refreshTableFromServer(this.searchForm);
        this.backUpSearchForm();
      },
      onResetClick () {
        this.searchForm = {
          shopId: this.shopList.length ? this.shopList[0].shopId : null,
          sellDate: '',
          sellNo: null,
          staffId: null
        };
      },
      async onChangeCurrent (pageIndex) {
        await this.refreshTableFromServer(this.searchFormBackUp, pageIndex);
      },
      async onShopSelectionChange (shopId) {
        await this.fetchReconciliationUserList({ shopId });
      },
      backUpSearchForm () {
        const { shopId, sellDate, sellNo, staffId } = this.searchForm;
        this.searchFormBackUp = { shopId, sellDate, sellNo, staffId };
      },
      async onShowModal (type, row) {
        const { sellNo, shopId } = row;
        this.reconciliationDetail = row;
        if (type === 'action') {
          await this.fetchReconciliationPaymentList({ shopId });
        }
        await this.fetchReconciliationDetailItem({ shopId, sellNo });
        this.$refs[type].isShow = true;
      },
      async successCallBack () {
        await this.refreshTableFromServer(this.searchFormBackUp);
        this.$refs.toast.isShow = true;
      },
      async refreshTableFromServer (searchForm, pageIndex) {
        const { sellNo, sellDate, staffId, shopId } = searchForm;
        if (!pageIndex) {
          pageIndex = this.pageIndex ? this.pageIndex : 1;
        }
        let pageSize = this.pageSize ? this.pageSize : 10;
        await this.fetchReconciliationDetailList({
          shopId,
          sellNo: sellNo === '' ? null : sellNo,
          sellDate: fecha.format(sellDate, 'YYYY-MM-DD'),
          uid: staffId,
          pageIndex,
          pageSize });
      }
    }
  };
</script>
<style lang="scss">
  .reconciliation-container {
    padding: 15px;

    .search-bar {
      margin-bottom: 10px;

      .el-form-item {
        margin-bottom: 10px;
      }
    }

    .link {
      cursor: pointer;
      color: #409EFF;

      &:focus {
        color: #206AC1;
      }
    }
  }
</style>
