<template>
  <div class="revenue-group-main">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-button size="small" class="btn-base" @click="() => { this.$router.push('/myd/business/revenue') }">返回上一页</el-button>
    <el-table :data="allGroupList" border class="mw-table">
      <el-table-column prop="revenueGroupName" align="center" label="分类分组名称" />
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button :disabled="isMaintain || scope.row.revenueGroupId === UNCLASSIFIED" class="btn-edit" content="编辑" @click="onClickEdit(scope.row)" />
          <mw-button :disabled="isMaintain || scope.row.revenueGroupId === UNCLASSIFIED" class="btn-delete" content="删除" @click="onClickDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onPopupDelete"
      ref="popup" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { DEFAULT_PAGE } from 'constant/pagination';
import { checkMaintainRight } from 'utils/permissionUtil';
import { OK, UNCLASSIFIED } from 'constant/statusCode';

export default {
  name: 'revenueGroupMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      editId: '',
      OK,
      UNCLASSIFIED,
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchRevenueGroupList({ pageIndex, pageSize });
  },
  computed: mapState({
    allGroupList: state => state.business.revenueGroup.allGroupList,
    recordCount: state => state.business.revenueGroup.recordCount,
    pageIndex: state => state.business.revenueGroup.pageIndex,
    pageSize: state => state.business.revenueGroup.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchRevenueGroupList',
      'deleteRevenueGroup'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchRevenueGroupList({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchRevenueGroupList({ pageIndex, pageSize: this.pageSize });
    },
    onClickAdd () {
      this.$router.push('/myd/business/revenue/addgroup');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/business/revenue/editgroup/${row.revenueGroupId}`);
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.revenueGroupId;
    },
    async onPopupDelete () {
      const { pageIndex, pageSize, editId } = this;
      await this.deleteRevenueGroup(editId);
      await this.fetchRevenueGroupList({ pageIndex, pageSize });
    }
  }
};
</script>

<style lang="scss">
.revenue-group-main {
  padding: 15px;
}
</style>

