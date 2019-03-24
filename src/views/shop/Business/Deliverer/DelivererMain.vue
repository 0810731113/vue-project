<template>
  <div class="business-deliverer">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-table :data="delivererList" border class="mw-table">
      <el-table-column prop="delivererName" class-name="table-auto" align="center" label="送餐者名称" min-width="20%" />
      <el-table-column prop="deliverer" :formatter="formatValue" class-name="table-auto" align="center" label="送餐者姓名" min-width="15%" />
      <el-table-column prop="change" align="center" label="零钱额度" min-width="15%" />
      <el-table-column prop="note" :formatter="formatValue" align="center" label="备注" min-width="15%" />
      <el-table-column :formatter="getStatusText" align="center" label="状态" min-width="15%" />
      <el-table-column align="center" label="操作" min-width="20%">
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
      :handleOk="() => this.deleteDeliverer(editId)"
      ref="popup" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';
import { OK } from 'constant/statusCode';

export default {
  name: 'delivererMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      OK,
      editId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllDeliverer({ pageIndex, pageSize });
  },
  computed: mapState({
    delivererList: state => state.business.deliverer.delivererList,
    recordCount: state => state.business.deliverer.recordCount,
    pageIndex: state => state.business.deliverer.pageIndex,
    pageSize: state => state.business.deliverer.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchAllDeliverer',
      'deleteDeliverer'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.fetchAllDeliverer({ pageIndex, pageSize: this.pageSize });
    },
    formatValue (row, column) {
      return row[column.property] || '-';
    },
    onClickAdd () {
      this.$router.push('/myd/business/deliverer/add');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/business/deliverer/edit/${row.delivererId}`);
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.delivererId;
    }
  }
};
</script>

<style lang="scss">
.business-deliverer {
  padding: 15px;
}
</style>

