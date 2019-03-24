<template>
    <div class="reconciliation-log-container">
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
            v-model="searchForm.dateRange"
            @change="(event) => logDateRange(event)"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="daterange"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="销售单号:" prop="sellNo">
          <el-input v-model="searchForm.sellNo" placeholder="销售单号" :controls="false" :maxlength="20"/>
        </el-form-item>
      </el-form>
      <div class="horizontal-center">
        <el-button class="btn-search" @click="onSearchClick">搜索</el-button>
        <el-button class="btn-reset" @click="onResetClick">重置</el-button>
      </div>
      <div class="division-line"></div>
      <el-table :data="logList" border style="width: 100%" >
        <el-table-column prop="sellNo" align="center" class="table-auto" label="销售单号" min-width="150" fixed>
          <template slot-scope="scope">
            {{scope.row.adjustStatus === 1 ? scope.row.sellNo : null}}
          </template>
        </el-table-column>
        <el-table-column prop="sourceName" align="center" class="table-auto" label="订单来源" min-width="100" fixed>
          <template slot-scope="scope">
            {{scope.row.adjustStatus === 1 ? scope.row.sourceName : null}}
          </template>
        </el-table-column>
        <el-table-column prop="adjustStatus" align="center" class="table-auto" label="账单类型" min-width="100">
          <template slot-scope="scope">
            {{scope.row.adjustStatus === 1 ? '当前单据' : '原始单据'}}
          </template>
        </el-table-column>
        <el-table-column prop="settleTime" align="center" class="table-auto" label="结账时间" min-width="200"/>
        <el-table-column prop="createTime" align="center" class="table-auto" label="调账时间" min-width="200"/>
        <el-table-column prop="userName" align="center" class="table-auto" label="操作人员" min-width="100"/>
        <el-table-column prop="paymentAmt" align="center" class="table-auto" label="支付金额" min-width="100"/>
        <el-table-column align="center" class="table-auto" label="实收结算方式">
          <el-table-column v-for="(item, index) in headerList" :key="index" :prop="item.toString()" align="center"
                           class="table-auto" :label="headerMap[item]" min-width="100"/>
          <el-table-column prop="0" align="center" class="table-auto" label="合计" min-width="100"/>
        </el-table-column>
        <el-table-column prop="adjustReason" align="center" class="table-auto" label="调账理由" min-width="200"/>
        <el-table-column prop="note" align="center" class="table-auto" label="备注" min-width="100"/>
      </el-table>
      <pagination
        :onChangeCurrent="onChangeCurrent"
        :currentPage="pageIndex"
        :pageSize="pageSize"
        :totalCount="recordCount" />
    </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination } from 'components';
  import { validateNumber } from 'utils/validateUtil';
  import fecha from 'fecha';

  export default {
    name: 'ReconciliationLogMain',
    components: {
      Pagination },
    data () {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        searchForm: {
          shopId: null,
          dateRange: [Date.now(), Date.now()],
          sellNo: null,
          userId: null
        },
        searchFormBackUp: {
          shopId: null,
          dateRange: [Date.now(), Date.now()],
          sellNo: null,
          userId: null
        },
        rules: {
          sellNo: [
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    async created () {
      await this.fetchReconciliationShopList();
      this.searchForm.shopId = this.shopList.length ? this.shopList[0].shopId : null;
      const { shopId } = this.searchForm;
      await this.fetchReconciliationUserList({ shopId });
      await this.refreshReconciliationLogList();
    },
    computed: mapState({
      shopList: state => state.reconciliation.reconciliationDetail.shopList,
      userList: state => state.reconciliation.reconciliationDetail.userList,
      logList: state => state.reconciliation.reconciliationLog.logList,
      headerMap: state => state.reconciliation.reconciliationLog.headerMap,
      headerList: state => state.reconciliation.reconciliationLog.headerList,
      pageIndex: state => state.reconciliation.reconciliationLog.pageIndex,
      pageSize: state => state.reconciliation.reconciliationLog.pageSize,
      recordCount: state => state.reconciliation.reconciliationLog.recordCount
    }),
    methods: {
      ...mapActions([
        'fetchReconciliationShopList',
        'fetchReconciliationUserList',
        'fetchReconciliationLogList',
        'refreshReconciliationLogList'
      ]),
      logDateRange(event){
        console.log(event)
      },
      async onSearchClick () {
        let validForm = true;
        this.$refs.search.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        await this.refreshTableFromServer(this.searchForm);
        this.backUpSearchForm();
      },
      backUpSearchForm () {
        const { shopId, sellDate, sellNo, staffId } = this.searchForm;
        this.searchFormBackUp = { shopId, sellDate, sellNo, staffId };
      },
      onResetClick () {
        this.searchForm = {
          shopId: this.shopList.length ? this.shopList[0].shopId : null,
          dateRange: [Date.now(), Date.now()],
          sellNo: null,
          userId: null
        };
      },
      async onChangeCurrent (pageIndex) {
        console.log(pageIndex)
        var that = this
        var params = Object.assign({},this.searchFormBackUp,{dateRange: that.searchForm.dateRange})
        await this.refreshTableFromServer(params, pageIndex);
      },
      async onShopSelectionChange (shopId) {
        await this.fetchReconciliationUserList({ shopId });
      },
      async refreshTableFromServer (searchForm, pageIndex) {
        if (!pageIndex) {
          pageIndex = this.pageIndex ? this.pageIndex : 1;
        }
        let pageSize = this.pageSize ? this.pageSize : 10;
        const { sellNo, dateRange, shopId } = searchForm;
//        console.log(dateRange)
        const [startDate, endDate] = dateRange;
//        console.log(startDate,endDate)
//        console.log(fecha.format(startDate, 'YYYY-MM-DD'))
        await this.fetchReconciliationLogList({
          shopId,
          sellNo,
          startDate: fecha.format(startDate, 'YYYY-MM-DD'),
          endDate: fecha.format(endDate, 'YYYY-MM-DD'),
//          startDate: '2019-02-01',
//          endDate: '2019-02-20',
          pageIndex,
          pageSize
        });
      }
    }
  };

</script>
<style lang="scss">
  .reconciliation-log-container {
    padding: 15px;

    .search-bar {
      margin-bottom: 10px;

      .el-form-item {
        margin-bottom: 10px;
      }
    }

    .el-table__body-wrapper {
      overflow-x: auto !important;
    }
  }
</style>
