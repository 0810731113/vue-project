<template>
  <el-dialog
    width="60%"
    :closeOnClickModal="false"
    class="base-modal reconciliation-detail-modal"
    :visible.sync="isShow"
    title="账单详情">
    <div class="sub-title">账单信息</div>
    <el-form label-width="90px" :inline="true" >
      <el-form-item class="el-col-6" label="日期：">{{ accountInfo.sellDate }}</el-form-item>
      <el-form-item class="el-col-7" label="销售单号：">{{ accountInfo.sellNo }}</el-form-item>
      <el-form-item class="el-col-4" label="订单来源：">{{ accountInfo.billSourceName }}</el-form-item>
      <el-form-item class="el-col-4" label="桌台号：">{{accountInfo.mtableName}}</el-form-item>
    </el-form>
    <el-form label-width="90px" :inline="true" >
      <el-form-item class="el-col-7" label="开台时间：">{{ accountInfo.sellTime }}</el-form-item>
      <el-form-item class="el-col-6" label="开台人员：">{{ accountInfo.createUserName }}</el-form-item>
      <el-form-item class="el-col-8" label="结账时间：">{{ accountInfo.checkEndTime }}</el-form-item>
    </el-form>
    <div class="sub-title" style="margin-top: 100px; clear: both">支付信息</div>
    <el-table :data="paymentInfo" border class="table">
      <el-table-column prop="paymentName" align="center" label="支付方式" min-width="50%"/>
      <el-table-column prop="payMoney" align="center" label="支付金额" min-width="50%"/>
    </el-table>
    <div class="sub-title">调账信息</div>
    <div v-for="item in historyList">
      <el-table :data="item" border class="table" :span-method="tableSpan">
        <el-table-column prop="adjustNo" align="center" label="序号" min-width="10%"/>
        <el-table-column prop="type" align="center" label="账单类型" min-width="10%"/>
        <el-table-column prop="totalAmt" align="center" label="支付总额" min-width="10%"/>
        <el-table-column prop="createUserName" align="center" label="调账人员" min-width="10%"/>
        <el-table-column prop="createTime" align="center" label="调账时间" min-width="15%"/>
        <el-table-column prop="adjustStatus" align="center" label="支付区分" min-width="10%">
          <template slot-scope="scope">
            {{ PAY_STATUS[scope.row.adjustStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="paymentName" align="center" label="支付方式" min-width="10%">
          <template slot-scope="scope">
            <div :class="scope.row.adjustStatus === 0 ? 'delete-status': ''">
              {{ scope.row.paymentName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payMoney" align="center" label="支付金额" min-width="10%">
          <template slot-scope="scope">
            <div :class="scope.row.adjustStatus === 0 ? 'delete-status': ''">
              {{ scope.row.payMoney }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import { PAY_STATUS } from 'constant/constants';
  export default {
    name: 'ReconciliationDetail',
    data () {
      return {
        PAY_STATUS,
        isShow: false
      };
    },
    computed: mapState({
      accountInfo: state => state.reconciliation.reconciliationDetail.accountInfo,
      paymentInfo: state => state.reconciliation.reconciliationDetail.paymentInfo,
      historyList: state => state.reconciliation.reconciliationDetail.historyList
    }),
    methods: {
      tableSpan ({ row, column, rowIndex, columnIndex }) {
        if (column.property === 'adjustNo' ||
          column.property === 'totalAmt' ||
          column.property === 'createUserName' ||
          column.property === 'type' ||
          column.property === 'createTime') {
          if (rowIndex === 0) {
            return [row.length, 1];
          }
          return [0, 0];
        }
        return [1, 1];
      }
    }
  };
</script>
<style lang="scss">
  .reconciliation-detail-modal {
    padding: 0 10px;

    .sub-title {
      padding: 5px 0;
      font-size: 16px;
      border-bottom: 1px dashed rgba(151, 151, 151, 0.3);
    }

    .el-form-item {
      margin-bottom: 0;
    }

    .el-dialog__body {
      padding: 10px 20px;
    }

    .table {
      width: 100%;
      margin-top: 10px;
    }

    .delete-status {
      color: red;
      text-decoration: line-through;
    }
  }
</style>

