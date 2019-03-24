<template>
  <div class="body-main">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="查询范围:">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          placeholder="选择起止日期"
          :editable="false"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="账单号:">
        <el-input placeholder="账单号" v-model="searchForm.fsSellNo" />
      </el-form-item>
      <el-form-item label="挂账对象:">
        <el-select placeholder="请选择" v-model="searchForm.fsCreditAccountId">
          <el-option :value="null" label="全部" />
          <el-option
            v-for="item in chagreObj"
            :key="item.creditAccountId"
            :label="item.creditAccountName"
            :value="item.creditAccountId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
        <el-button class="btn-reset" @click="onClickReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="division-line"></div>
    <el-row class="operation-buttom-wrap">
      <el-button class="btn-primary" @click="onClickChargeBill">收账</el-button>
      <el-button class="btn-primary" @click="onRedirect">查看已收帐</el-button>
      <a class="link mw-link" @click="goRoute">查看挂账名单</a>
    </el-row>
    <el-table ref="billTable" :data="chagreList.list" border @selection-change="onChangeSelection" @row-click="onClickRow">
      <el-table-column type="selection" min-width="50px" />
      <el-table-column prop="fsSellNo" align="center" label="账单号" />
      <el-table-column prop="fsCreditAccountName" align="center" label="挂账对象" />
      <el-table-column prop="fdDebtAmt" align="center" label="挂账金额" />
      <el-table-column prop="fsCreateTime" align="center" label="挂账时间" />
      <el-table-column prop="fsCreateUserName" align="center" label="收银员" />
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="chagreList.pageIndex"
      :pageSize="chagreList.pageSize"
      :totalCount="chagreList.recordCount">
    </pagination>
    <Popup
      ref="pop_Model_Alert"
      type="warning"
      okText="确认"
      size="small">
      <div slot="content">
        {{alert_message}}
      </div>
    </Popup>
    <Toast
      ref='toast'
      content="请选择需要操作的数据!"
      :timeout="2000"
      type="warning"
    />
    <popup
      ref="pop_Model_Form"
      type="submit"
      size="small"
      :handleOk="() => onSubmit()">
      <div slot="content">
        <el-form label-width="90px" :model="collectForm" ref="collectForm" :rules="rules">
          <el-form-item label="交易流水号" prop="fsOrderNo">
            <el-input placeholder="交易流水号" v-model="collectForm.fsOrderNo" :maxlength='INPUT_MAX_LENGTH' :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="挂账金额" prop="fdCreditAmy">
            <el-input placeholder="挂账金额" v-model="collectForm.fdCreditAmy" :maxlength='INPUT_MAX_LENGTH' :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="付款类型:"  prop="fiPaymentTypeId">
            <el-select placeholder="请选择付款类型" v-model="collectForm.fiPaymentTypeId">
              <el-option
                v-for="item in orderObj.collectPayment"
                :key="item.paymentTypeId"
                :label="item.paymentTypeName"
                :value="item.paymentTypeId.toString()">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实收金额" prop="fdRealAmt">
            <el-input-number v-model.number="collectForm.fdRealAmt" :min="0" :max="collectForm.fdCreditAmy" controls-position="right"/>
          </el-form-item>
          <el-form-item label="备注" prop="fsNote">
            <el-input placeholder="备注" v-model="collectForm.fsNote" :maxlength='INPUT_MAX_LENGTH'></el-input>
          </el-form-item>
        </el-form>
      </div>
    </popup>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup, Toast } from 'components';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { INPUT_MAX_LENGTH } from 'constant/constants';
  import fecha from 'fecha';

  export default {
    name: 'ChargeBill',
    components: {
      Popup,
      Pagination,
      Toast
    },
    data () {
      return {
        DEFAULT_PAGE,
        DEFAULT_PAGES,
        INPUT_MAX_LENGTH,
        searchForm: {
          date: [new Date(), new Date()],
          fsSellNo: null,
          fsCreditAccountId: null
        },
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const dateTime = new Date();
              dateTime.setTime(dateTime.getTime() - 8.64e7);
              picker.$emit('pick', [dateTime, dateTime]);
            }
          }, {
            text: '近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 8.64e7 * 6);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 8.64e7 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        multipleSelection: [],
        alert_message: '',
        creditAmy: 0,
        sellNo: [],
        collectForm: {
          fsOrderNo: '',
          fdCreditAmy: 0,
          fiPaymentTypeId: '',
          fsCreditAccountId: '',
          fdRealAmt: 0,
          fsNote: ''
        },
        rules: {
          fiPaymentTypeId: [
            { required: true, message: '请选择付款类型', trigger: 'change' }
          ],
          fdRealAmt: [
            { type: 'number', message: '金额必须是数字' }
          ]
        }
      };
    },
    async created () {
      await this.fetchChargeObj();
      await this.fetchChargeList(this.getFormParams());
    },
    computed: {
      ...mapState({
        chagreObj: state => state.bill.chargeobj,
        chagreList: state => state.bill.charge,
        errorStatus: state => state.error.errorStatus,
        orderObj: state => state.bill.orderobj
      })
    },
    methods: {
      ...mapActions([
        'fetchChargeObj',
        'fetchChargeList',
        'fetchOrderNo',
        'fetchUpdateChargeBill'
      ]),
      async onClickSearch () {
        await this.fetchChargeList(this.getFormParams());
      },
      onClickReset () {
        this.searchForm = {
          date: [new Date(), new Date()],
          fsSellNo: null,
          fsCreditAccountId: null
        };
      },
      async onChangeSize (pageSize) {
        const postParameter = this.getFormParams();
        await this.fetchChargeList({ ...postParameter, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        const postParameter = this.getFormParams();
        await this.fetchChargeList({ ...postParameter, pageIndex });
      },
      getFormParams () {
        const { pageIndex, pageSize } = this.chagreList;
        const { date, fsSellNo, fsCreditAccountId } = this.searchForm;
        const [startDate, endDate] = date;
        const fsStarDate = fecha.format(startDate || new Date(), 'YYYY-MM-DD');
        const fsEndDate = fecha.format(endDate || new Date(), 'YYYY-MM-DD');
        return { chargeBillSearchModel: { fsStarDate, fsEndDate, fsSellNo, fsCreditAccountId }, pageIndex, pageSize };
      },
      async onClickChargeBill () {
        if (!this.multipleSelection.length) {
          this.$refs.toast.isShow = true;
          return;
        }

        let obj = this.multipleSelection.find((x) => {
          return x.fsCreditAccountId !== this.multipleSelection[0].fsCreditAccountId;
        });
        if (obj && !obj.length) {
          this.alert_message = '挂账人不一致，无法收账!';
          this.$refs['pop_Model_Alert'].isShow = true;
          return;
        }
        this.creditAmy = 0;
        this.sellNo = [];
        for (let item of this.multipleSelection) {
          this.creditAmy += parseFloat(item.fdDebtAmt);
          this.sellNo.push(item.fsSellNo);
        }
        await this.fetchOrderNo({ fdCreditAmy: this.creditAmy });
        this.collectForm.fsOrderNo = this.orderObj.chargeBill.fsOrderNo;
        this.collectForm.fdCreditAmy = this.creditAmy;
        this.collectForm.fsCreditAccountId = this.multipleSelection[0].fsCreditAccountId;
        this.$refs['pop_Model_Form'].isShow = true;
      },
      onChangeSelection (val) {
        this.multipleSelection = val;
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.collectForm.validate((valid) => {
          validForm = valid;
        });

        if (!validForm) return;
        await this.fetchUpdateChargeBill({ sellNo: this.sellNo, chargeBill: this.collectForm });
        await this.fetchChargeList(this.getFormParams());
        this.$refs['pop_Model_Form'].isShow = false;
      },
      onClickRow (row, event, column) {
        this.$refs.billTable.toggleRowSelection(row);
      },
      onRedirect () {
        this.$router.push('/myd/bill/chargebilldone');
      },
      goRoute () {
        this.$router.push('/myd/business/creditaccount');
        if (sessionStorage.getItem('isIframe') === 'true') {
          window.parent.Navigation('#business', '#credit');
        }
      }
    }
  };
</script>

<style lang="scss">
.body-main {
  padding: 15px;

  .search-bar {
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .link {
    float: right;
    line-height: 40px;
    margin-right: 40px;
    font-size: 16px;
  }

  .operation-buttom-wrap {
    padding: 10px 0;
  }
}
</style>
