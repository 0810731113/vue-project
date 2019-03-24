<template>
  <div class="business-creditAccount">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <!--<a class="link mw-link" @click="goRoute">挂账账单处理</a>-->
    <el-table :data="creditAccountList" border class="mw-table">
      <el-table-column prop="creditAccountName" class-name="table-auto" align="center" label="挂账对象名称" min-width="20%" />
      <el-table-column prop="creditAmt" align="center" label="信用额度" min-width="10%" >
        <template slot-scope="scope">
          {{ scope.row.creditAmt.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="debtAmt" align="center" label="未销账金额" min-width="10%" >
        <template slot-scope="scope">
          {{ scope.row.balanceAmt && scope.row.balanceAmt.toFixed(2) }}
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="已用额度" min-width="10%">-->
        <!--<template slot-scope="scope">-->
          <!--{{ (scope.row.creditAmt - scope.row.debtAmt).toFixed(2) }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="contact" class-name="table-auto" align="center" :formatter="formatterText" label="联系人" min-width="10%" />
      <el-table-column prop="cellphoneCt" align="center" label="联系人手机" :formatter="formatterText" min-width="15%" />
      <el-table-column align="center" label="状态" :formatter="getStatusText" min-width="15%" />
      <el-table-column align="center" label="操作" min-width="15%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onClickDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onDeleteCreditAccount"
      ref="popup" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'creditAccountMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      editId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  created () {
    const { pageIndex, pageSize } = this;
    this.fetchAllCreditAccount({ pageIndex, pageSize });
  },
  computed: mapState({
    creditAccountList: state => state.business.creditAccount.creditAccountList,
    recordCount: state => state.business.creditAccount.recordCount,
    pageIndex: state => state.business.creditAccount.pageIndex,
    pageSize: state => state.business.creditAccount.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchAllCreditAccount',
      'deleteCreditAccount'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.fetchAllCreditAccount({ pageIndex, pageSize: this.pageSize });
    },
    async onDeleteCreditAccount () {
      const { pageIndex, pageSize, editId } = this;
      await this.deleteCreditAccount(editId);
      this.fetchAllCreditAccount({ pageIndex, pageSize });
    },
    formatterText (row, column, cellValue) {
      if ((cellValue === null) || (cellValue === '')) {
        return '-';
      }
      return cellValue;
    },
    onClickAdd () {
      this.$router.push('/myd/business/creditaccount/add');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/business/creditaccount/edit/${row.creditAccountId}`);
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.creditAccountId;
    }
//    goRoute () {
//      this.$router.push('/bill/chargebill');
//      if (sessionStorage.getItem('isIframe') === 'true') {
//        window.parent.Navigation('#billprocessing', '#creditprocessing');
//      }
//    }
  }
};
</script>

<style lang="scss">
.business-creditAccount {
  padding: 15px;

  .link {
    float: right;
    line-height: 40px;
    margin-right: 40px;
    font-size: 16px;
  }
}
</style>
