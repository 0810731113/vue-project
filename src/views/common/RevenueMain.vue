<template>
  <div class="business-revenue">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-button size="small" type="primary" class="btn-base" @click="onClickGroup">分类分组管理</el-button>
    <el-table :data="revenueList" border class="mw-table">
      <el-table-column prop="revenueTypeName" class-name="table-auto" align="center" label="收入分类名称" />
      <el-table-column prop="revenueGroupName" class-name="table-auto" align="center" label="收入分类分组" />
      <el-table-column prop="sortOrder" align="center" label="顺序">
        <template slot-scope="scope">
          {{ scope.row.sortOrder !== null ? scope.row.sortOrder : '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" :formatter="getStatusText" />
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
      :handleOk="deleteRevenueItem"
      ref="popup" />
  </div>
</template>

<script>
import { Popup, Pagination, MwButton } from 'components';
import { OK } from 'constant/statusCode';
import { isShop } from 'utils/configUtil';
import { SYSTEM_KEY } from 'constant/constants';

export default {
  name: 'revenueMain',
  props: ['fetchAllRevenue', 'deleteRevenue', 'revenueList', 'recordCount', 'pageIndex', 'pageSize', 'isMaintain'],
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
      isShop: isShop()
    };
  },
  async created () {
    await this.refreshTableFromServer();
  },
  methods: {
    async onChangeCurrent (pageIndex) {
      await this.fetchAllRevenue({ pageIndex, pageSize: this.pageSize });
    },
    onClickAdd () {
      this.$router.push('/myd/business/revenue/add');
    },
    onClickGroup () {
      this.$router.push('/myd/business/revenue/group');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/business/revenue/edit/${row.revenueTypeId}`);
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.revenueTypeId;
    },
    async deleteRevenueItem () {
      await this.deleteRevenue(this.editId);
      await this.refreshTableFromServer();
    },
    async refreshTableFromServer () {
      const { pageIndex, pageSize } = this;
      await this.fetchAllRevenue({ pageIndex, pageSize });
    }
  }
};
</script>

<style lang="scss">
.business-revenue {
  padding: 15px;
}
</style>

