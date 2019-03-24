<template>
  <div class="business-sales">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-table :data="salesList" border class="mw-table">
      <el-table-column prop="expClsName" class-name="table-auto" align="center" label="销售分类名称" />
      <el-table-column prop="sortOrder" align="center" label="顺序">
        <template slot-scope="scope">
          {{ scope.row.sortOrder !== null ? scope.row.sortOrder : '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="formatStatus" label="状态" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain || (scope.row.dataKind === SYSTEM_KEY)" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain || (scope.row.dataKind === SYSTEM_KEY)" @click="onClickDelete(scope.row)" />
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
      :handleOk="deleteSalesItem"
      ref="popup" />
  </div>
</template>

<script>
import { Popup, Pagination, MwButton } from 'components';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { SYSTEM_KEY } from 'constant/constants';

export default {
  name: 'salesMain',
  props: ['recordCount', 'pageIndex', 'pageSize', 'salesList', 'fetchAllSales', 'deleteSales', 'isMaintain'],
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      editId: '',
      SYSTEM_KEY
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllSales({ pageIndex, pageSize });
  },
  methods: {
    async onChangeCurrent (pageIndex) {
      await this.fetchAllSales({ pageIndex, pageSize: this.pageSize });
    },
    onClickAdd () {
      this.$router.push('/myd/business/sales/add');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/business/sales/edit/${row.expClsId}`);
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.expClsId;
    },
    async deleteSalesItem () {
      await this.deleteSales(this.editId);
      const { pageIndex, pageSize } = this;
      await this.fetchAllSales({ pageIndex, pageSize });
    },
    formatStatus (row) {
      switch (row.status) {
        case OK:
          return '正常';
        case FORBIDDEN:
          return '禁用';
        default:
          return '未同步到店DB';
      }
    }
  }
};
</script>

<style lang="scss">
.business-sales {
  padding: 15px;
}
</style>

