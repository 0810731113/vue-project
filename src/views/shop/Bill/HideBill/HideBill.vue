<template>
  <div class="hide-bill-main">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-date-picker
          v-model="searchForm.date"
          placeholder="选择日期"
          :editable="false">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
        <el-button class="btn-reset" @click="onClickReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="division-line"></div>
    <el-row class="operation-button">
      <el-button class="btn-primary" @click="onOperationBill(0)">设为可见</el-button>
      <el-button class="btn-primary" @click="onOperationBill(1)">设为不可见</el-button>
    </el-row>
    <el-table ref="billTable" :data="billist.dtoList" border @selection-change="handleSelectionChange" @row-click="handleRowClick">
      <el-table-column type="selection" min-width="50px" />
      <el-table-column prop="sellNo" align="center" label="账单号" />
      <el-table-column prop="mtableName" align="center" label="桌号" />
      <el-table-column prop="saleAmt" align="center" label="折前金额" />
      <el-table-column prop="expAmt" align="center" label="折后金额" />
      <el-table-column prop="realAmt" align="center" label="实收金额" />
      <el-table-column prop="createUserName" align="center" label="收银员" />
      <el-table-column prop="selected" align="center" label="显示状态">
        <template slot-scope="scope">
          {{ scope.row.selected==1 ? '不可见' : '可见' }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="billist.pageIndex"
      :pageSize="billist.pageSize"
      :totalCount="billist.recordCount">
    </pagination>
    <popup
      title="账单操作"
      tips="您确认要更新这些数据吗？"
      :handleOk="() => this.onConfirm()"
      ref="popup"
    ></popup>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup } from 'components';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { INPUT_MAX_LENGTH } from 'constant/constants';
  import fecha from 'fecha';

  export default{
    name: 'HideBill',
    components: {
      Pagination,
      Popup
    },
    data () {
      return {
        DEFAULT_PAGE,
        DEFAULT_PAGES,
        INPUT_MAX_LENGTH,
        searchForm: {
          date: new Date()
        },
        multipleSelection: [],
        isShow: null
      };
    },
    async created () {
      await this.fetchBillList(this.getFormParams());
    },
    computed: {
      ...mapState({
        errorStatus: state => state.error.errorStatus,
        billist: state => state.bill.billist
      })
    },
    methods: {
      ...mapActions([
        'fetchBillList',
        'fetchBillListBatch'
      ]),
      async onClickSearch () {
        await this.fetchBillList(this.getFormParams());
      },
      onClickReset () {
        this.searchForm.date = new Date();
      },
      async onChangeSize (pageSize) {
        const postParameter = this.getFormParams();
        await this.fetchBillList({ ...postParameter, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        let postParameter = this.getFormParams();
        await this.fetchBillList({ ...postParameter, pageIndex });
      },
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      getFormParams () {
        const { pageIndex, pageSize } = this.billist;
        const { date } = this.searchForm;
        const fsSellDate = fecha.format(date || new Date(), 'YYYY-MM-DD');
        return { fsSellDate, pageIndex, pageSize };
      },
      handleRowClick (row, event, column) {
        this.$refs.billTable.toggleRowSelection(row);
      },
      onOperationBill (isShow) {
        this.isShow = isShow;
        this.$refs.popup.isShow = !!this.multipleSelection.length;
      },
      async onConfirm () {
        let sellNo = [];
        this.multipleSelection.map(x => {
          sellNo.push(x.sellNo);
        });
        let selected = this.isShow;
        await this.fetchBillListBatch({ sellNo, selected });
        await this.fetchBillList(this.getFormParams());
      }
    }
  };
</script>

<style lang="scss">
  .hide-bill-main {
    padding: 15px;

    .search-bar {
      .el-form-item {
        margin-bottom: 10px;
      }
    }

    .operation-button {
      padding: 10px 0;
    }
  }
</style>
