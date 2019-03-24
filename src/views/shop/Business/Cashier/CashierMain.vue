<template>
  <div class="business-cashier">
    <div class="add-cashier-tips">
      <el-button size="small" ref="btnAdd" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">添加班别</el-button>
      <show-error-tip
        ref="showErrorTip"
        class="cashier-error-tip"
        :showError="!cashierList.length && guidance && tipVisibility"
        errorText="请添加班别" />
    </div>
    <el-table :data="cashierList" border class="mw-table">
      <el-table-column prop="shiftName" class-name="table-auto" align="center" label="收银班次名称" />
      <el-table-column prop="note" class-name="table-auto" align="center" label="备注" v-if="!guidance">
        <template slot-scope="scope">
          {{ scope.row.note || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态" v-if="!guidance">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain || (scope.row.shiftId === 'Z')" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain || (scope.row.shiftId === 'Z')" @click="onClickDelete(scope.row)" />
          <mw-button
            :disabled="isMaintain"
            :class="scope.row.status === OK ? 'btn-forbid' : 'btn-ok'"
            :content="scope.row.status === OK ? '禁用' : '启用'"
            @click="updateCashierStatus({ status: scope.row.status === OK ? FORBIDDEN : OK, shiftId: scope.row.shiftId })" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="!guidance"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="() => this.deleteCashier(editId)"
      ref="popup" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton, ShowErrorTip } from 'components';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { BUSINESS_CASHIER_POPUP_REF } from 'constant/constants';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'cashierMain',
  props: {
    guidance: {
      type: Boolean,
      default: false
    },
    showCashierModal: {
      type: Function,
      default: () => {}
    },
    tipVisibility: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Popup,
    MwButton,
    Pagination,
    ShowErrorTip
  },
  data () {
    return {
      OK,
      FORBIDDEN,
      editId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    this.guidance
      ? await this.fetchAllCashier()
      : await this.fetchAllCashier({ pageSize, pageIndex });
  },
  computed: mapState({
    cashierList: state => state.business.cashier.cashierList,
    recordCount: state => state.business.cashier.recordCount,
    pageIndex: state => state.business.cashier.pageIndex,
    pageSize: state => state.business.cashier.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchAllCashier',
      'deleteCashier',
      'updateCashierStatus'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.fetchAllCashier({ pageIndex, pageSize: this.pageSize });
    },
    onClickAdd () {
      this.guidance
        ? this.showCashierModal(BUSINESS_CASHIER_POPUP_REF)
        : this.$router.push('/myd/business/cashier/add');
    },
    onClickEdit (row) {
      this.guidance
        ? this.showCashierModal(BUSINESS_CASHIER_POPUP_REF, row.shiftId)
        : this.$router.push(`/myd/business/cashier/edit/${row.shiftId}`);
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.shiftId;
    }
  }
};
</script>

<style lang="scss">
.business-cashier {
  padding: 15px;

  .pagination-wrapper {
    margin: 15px 0;
  }

  .add-cashier-tips {
    position: relative;

    .cashier-error-tip {
      width: 6.7%;
      top: 6px;
      left: 104px;
    }
  }
}
</style>

