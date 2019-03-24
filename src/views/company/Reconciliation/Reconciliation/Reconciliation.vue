<template>
  <el-dialog
    width="60%"
    :closeOnClickModal="false"
    class="base-modal reconciliation-modal"
    :visible.sync="isShow"
    title="账单详情">
    <div class="sub-title">应收金额(￥): {{detail ? detail.totalAmt : null}}</div>
    <div class="sub-title">红冲账单</div>
    <el-button class="btn-primary top-gap" @click="onRevertClick" :disabled="reverted">红冲</el-button>
    <div class="sub-title">添加支付方式</div>
    <el-form class="top-gap" label-width="90px" :inline="true">
      <el-form-item label="付款方式：">
        <el-select v-model="paymentForm.paymentId" :disabled="!reverted">
          <el-option
            v-for="item in paymentSelect.filter(item => !(item.paymentId == 40001 || item.paymentId == 40003))"
            :key="item.paymentId"
            :label="item.paymentName"
            :value="item.paymentId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="金额：">
        <el-input-number :controls="false" v-model="paymentForm.payMoney" :disabled="!reverted"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-primary" @click="onAddPaymentClick" :disabled="!reverted">添加</el-button>
      </el-form-item>
    </el-form>
    <div class="sub-title_plus">支付信息</div>
    <el-table
      border
      class="table"
      :data="paymentList"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column prop="paymentName" align="center" label="付款方式" min-width="35%"/>
      <el-table-column prop="payMoney" align="center" label="金额" min-width="35%"/>
      <el-table-column align="center" label="删除" min-width="30%">
        <template slot-scope="scope">
          <div v-if="scope.row.userDefined">
            <mw-button content="删除" class="btn-delete" @click="() =>onDeleteClick(scope.$index)"/>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="sub-title_plus"><span style="color: red">*</span>调账理由</div>
    <el-input type="textarea" placeholder="请输入内容" v-model="adjustReason">
    </el-input>
    <span slot="footer" class="modal-footer">
      <el-button class="btn-submit" @click="onSubmitClick">保存</el-button>
    </span>
    <div class="error-wrapper horizontal-center" v-if="!!errorMessage">
      <i class="el-icon-circle-cross"></i>
      {{ errorMessage }}
    </div>
  </el-dialog>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { MwButton } from 'components';
  import cloneDeep from 'lodash/cloneDeep';

  export default {
    name: 'Reconciliation',
    props: ['detail', 'successCallBack'],
    components: { MwButton },
    data () {
      return {
        reverted: false,
        isShow: false,
        paymentList: [],
        paymentForm: {
          paymentId: '',
          payMoney: 0
        },
        adjustReason: '',
        errorMessage: ''
      };
    },
    watch: {
      paymentInfo () {
        this.paymentList = cloneDeep(this.paymentInfo);
      },
      isShow () {
        this.reverted = false;
        this.errorMessage = '';
        this.paymentList = cloneDeep(this.paymentInfo);
        this.paymentForm = {
          paymentId: '',
          payMoney: 0
        };
        this.adjustReason = '';
      }
    },
    computed: mapState({
      paymentSelect: state => state.reconciliation.reconciliationDetail.paymentList,
      paymentInfo: state => state.reconciliation.reconciliationDetail.paymentInfo,
      error: state => state.error
    }),
    methods: {
      ...mapActions([
        'saveReconciliationDetail',
        'updateReconciliationMsg'
      ]),
      onRevertClick () {
        const temp = this.paymentList.map(item => {
          item.payMoney = 0 - item.payMoney;
          return item;
        });
        this.paymentList = cloneDeep(this.paymentInfo).concat(temp);
        this.reverted = true;
      },
      onAddPaymentClick () {
        const { paymentId, payMoney } = this.paymentForm;
        if (!paymentId) {
          return;
        }
        const item = this.paymentSelect.find(item => item.paymentId === paymentId);
        const { paymentName, isCalcPaid, isCalcInvoice, paymentType } = item;
        this.paymentList.push({
          paymentId,
          paymentName,
          payMoney: payMoney.toFixed(2),
          userDefined: true,
          isCalcPaid,
          isCalcInvoice,
          paymentType
        });
        this.paymentForm.payMoney = 0;
      },
      onDeleteClick (index) {
        this.paymentList.splice(index, 1);
      },
      getSummaries (param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return +(prev + curr).toFixed(2);
              }
              return prev;
            }, 0);
          }
        });

        return sums;
      },
      async onSubmitClick () {
        if (!this.reverted) {
          this.errorMessage = '请红冲账单';
          return;
        };

        let total = 0;
        this.paymentList.map(item => {
          total += +item.payMoney;
        });

        if (!this.adjustReason) {
          this.errorMessage = '请填写调账理由';
          return;
        } else if (total !== this.detail.totalAmt) {
          this.errorMessage = '支付金额需等于应收金额，请重新确认！';
          return;
        }
        this.errorMessage = '';

        const { shopId, sellNo } = this.detail;
        const { adjustReason, paymentList } = this;
        const list = paymentList.filter(item => item.userDefined === true);
        await this.saveReconciliationDetail({ shopId, sellNo, adjustReason, paymentList: list });
//        await this.updateReconciliationMsg({ shopId, sellNo, adjustReason, paymentList: list });
        const { errorStatus, errorMsg } = this.error;
        if (errorStatus) {
          this.errorMessage = errorMsg;
        } else {
          await this.successCallBack();
          this.isShow = false;
        }
      }
    }
  };
</script>
<style lang="scss">
  .reconciliation-modal {
    padding: 0 10px;

    .sub-title {
      padding: 5px 0;
      font-size: 16px;
      border-bottom: 1px dashed rgba(151, 151, 151, 0.3);
    }

    .sub-title_plus {
      padding: 5px 0;
      font-size: 16px;
      font-weight: 300;
    }

    .el-dialog__body {
      padding: 10px 20px;
    }

    .top-gap {
      margin-top: 10px;
    }

    .btn-submit {
      text-align: center;
    }

    .table {
      max-height: 300px;
      overflow-y: auto;
    }
  }
</style>

