<template>
  <div class="business-payment-type">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-button size="small" @click="() => { this.$router.push('/myd/business/payment') }">返回付款方式列表</el-button>
    <el-table :data="paymentTypeList" border class="mw-table">
      <el-table-column prop="paymentTypeName" align="center" label="结账类型名称">
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button :disabled="(scope.row.dataKind === SYSTEM_KEY) || isMaintain" class="btn-edit" content="编辑" @click="onClickEdit(scope.row)" />
          <mw-button :disabled="(scope.row.dataKind === SYSTEM_KEY) || isMaintain" class="btn-delete" content="删除" @click="onShowDeleteModalClick(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onDeleteClick"
      ref="popup"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { SYSTEM_KEY } from 'constant/constants';
import { checkMaintainRight } from 'utils/permissionUtil';
import { OK } from 'constant/statusCode';

export default {
  name: 'paymentTypeMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      OK,
      SYSTEM_KEY,
      editId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchPaymentTypesByPage({ pageIndex, pageSize });
  },
  computed: mapState({
    paymentTypeList: state => state.business.paymentType.paymentTypeList,
    recordCount: state => state.business.paymentType.recordCount,
    pageIndex: state => state.business.paymentType.pageIndex,
    pageSize: state => state.business.paymentType.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchPaymentTypesByPage',
      'deletePaymentType'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.fetchPaymentTypesByPage({ pageIndex, pageSize: this.pageSize });
    },
    onClickAdd () {
      this.$router.push('/myd/business/payment/addtype');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/business/payment/edittype/${row.paymentTypeId}`);
    },
    onShowDeleteModalClick (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.paymentTypeId;
    },
    async onDeleteClick () {
      await this.deletePaymentType(this.editId);
      const { pageIndex, pageSize } = this;
      await this.fetchPaymentTypesByPage({ pageIndex, pageSize });
    }
  }
};
</script>

<style lang="scss">
.business-payment-type {
  padding: 15px;
}
</style>

