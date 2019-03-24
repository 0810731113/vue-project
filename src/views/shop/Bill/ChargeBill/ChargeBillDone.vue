<template>
  <div class="body-main">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="查询范围:">
        <el-date-picker
          v-model="searchForm.date"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="挂账对象:">
        <el-select placeholder="请选择" v-model="searchForm.fsCreditAccountId">
          <el-option :value="null" label="全部"></el-option>
          <el-option
            v-for="item in chagreObj"
            :key="item.creditAccountId"
            :label="item.creditAccountName"
            :value="item.creditAccountId">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="search-button-bar">
        <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
        <el-button class="btn-reset" @click="onClickReset">重置</el-button>
      </div>
    </el-form>
    <div class="division-line"></div>
    <el-row class="operation-buttom-wrap">
      <el-button type="primary" class="btn-base" :disabled="isMaintain" @click="onClickCancelChargeBill">取消收账</el-button>
      <el-button type="primary" class="btn-base" :disabled="isMaintain" @click="onRedirect">查看未收帐</el-button>
    </el-row>
    <el-table ref="billDoneTable" :data="chargebilldone.list" border @selection-change="handleSelectionChange"  @row-click="handleRowClick">
      <el-table-column type="selection" min-width="50px" />
      <el-table-column prop="fsOrderNo" align="center" label="交易流水号"  width="150" />
      <el-table-column prop="fsCreditAccountName" align="center" class-name="table-auto" label="挂账对象" />
      <el-table-column prop="fdCreditAmy" align="center" label="挂账金额" />
      <el-table-column prop="fiPaymentTypeName" align="center" label="支付方式" />
      <el-table-column prop="fdRealAmt" align="center" label="实收金额" />
      <el-table-column prop="fsPayTime" align="center" label="收款时间" />
      <el-table-column prop="fsUpdateUserName" align="center" label="操作人" />
      <el-table-column prop="fsNote" align="center" label="备注" />
      <el-table-column prop="" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" :disabled="isMaintain" v-on:click.stop="handleView(scope.$index, scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="chargebilldone.pageIndex"
      :pageSize="chargebilldone.pageSize"
      :totalCount="chargebilldone.recordCount">
    </pagination>
    <Toast
      ref='toast'
      content="请选择需要操作的数据!"
      :timeout="2000"
      type="warning"
    />
    <popup
      title="取消收账"
      tips="确定要取消选中的收账信息吗(本次操作无法恢复)?"
      :handleOk="() => this.onClickCancelConformChargeBill()"
      ref="popup">
    </popup>
    <popup
      ref="pop_Model_Form"
      type="submit"
      size="small"
      :handleOk="() => { this.$refs.pop_Model_Form.isShow = false }">
      <div slot="content">
        <el-form label-width="90px" class="detail-form" :model="detail">
          <el-form-item label="交易流水号:">{{ detail.fsOrderNo }}</el-form-item>
          <el-form-item label="挂账金额:">{{ detail.fdCreditAmy }}</el-form-item>
          <el-form-item label="挂账人:">{{ detail.fsCreditAccountName }}</el-form-item>
          <el-form-item label="付款类型:" >{{ detail.fiPaymentTypeName }}</el-form-item>
          <el-form-item label="实收金额:">{{ detail.fdRealAmt }}</el-form-item>
          <el-form-item label="付款时间:">{{ detail.fsPayTime }}</el-form-item>
          <el-form-item label="操作人:">{{ detail.fsUpdateUserName }}</el-form-item>
          <el-form-item label="备注:">{{ detail.fsNote }}</el-form-item>
        </el-form>
        <el-table border :data="chargebilldetail.sellEntityDtos" style="width: 100%">
          <el-table-column align="center" prop="sellNo" label="账单号" />
          <el-table-column align="center" prop="debtAmt" label="金额" />
        </el-table>
      </div>
    </popup>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup, Toast } from 'components/index';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import fecha from 'fecha';

  export default{
    name: 'ChargeBillDone',
    components: {
      Pagination,
      Popup,
      Toast
    },
    data () {
      return {
        searchForm: {
          date: new Date(),
          fsCreditAccountId: null
        },
        multipleSelection: [],
        alert_message: '',
        orderNo: [],
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        chagreObj: state => state.bill.chargeobj,
        errorStatus: state => state.error.errorStatus,
        chargebilldone: state => state.bill.chargebilldone,
        chargebilldetail: state => state.bill.chargebilldetail,
        detail () {
          const { chargedDetailPopModelDto } = this.chargebilldetail;
          return chargedDetailPopModelDto;
        }
      })
    },
    async created () {
      await this.fetchChargeObj();
      await this.fetchChargeDoneList(this.getFormParams());
    },
    methods: {
      ...mapActions([
        'fetchChargeObj',
        'fetchChargeDoneList',
        'fetchChargeCancel',
        'fetchBillDetail'
      ]),
      async onClickSearch () {
        await this.fetchChargeDoneList(this.getFormParams());
      },
      onClickReset () {
        this.searchForm = {
          date: new Date(),
          fsCreditAccountId: null
        };
      },
      async onChangeSize (pageSize) {
        const postParameter = this.getFormParams();
        await this.fetchChargeDoneList({ ...postParameter, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        const postParameter = this.getFormParams();
        await this.fetchChargeDoneList({ ...postParameter, pageIndex });
      },
      async onClickCancelChargeBill () {
        if (!this.multipleSelection.length) {
          this.$refs['toast'].isShow = true;
          return;
        }
        this.$refs['popup'].isShow = true;
      },
      async onClickCancelConformChargeBill () {
        this.orderNo = [];
        this.multipleSelection.map(x => {
          this.orderNo.push(x.fsOrderNo);
        });
        await this.fetchChargeCancel({ orderNo: this.orderNo });
        await this.fetchChargeDoneList(this.getFormParams());
      },
      getFormParams () {
        const { pageIndex, pageSize } = this.chargebilldone;
        const { date, fsCreditAccountId } = this.searchForm;
        const fsDate = fecha.format(date || new Date(), 'YYYY-MM');
        return { fsDate, fsCreditAccountId, pageIndex, pageSize };
      },
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      handleRowClick (row, event, column) {
        this.$refs.billDoneTable.toggleRowSelection(row);
      },
      async handleView (index, row) {
        await this.fetchBillDetail({ fsOrderNo: row.fsOrderNo });
        this.$refs.pop_Model_Form.isShow = true;
      },
      onRedirect () {
        this.$router.push('/myd/bill/chargebill');
      }
    }
  };
</script>

<style lang="scss">
  .body-main {
    padding: 15px;

    .operation-buttom-wrap {
      padding: 10px;
    }

    .search-button-bar {
      display: inline-block;
      line-height: 40px;
    }

    .detail-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
</style>
