<template>
  <div class="shop-group-main">
    <el-button :disabled="isMaintain" class="btn-add" icon="el-icon-plus" @click="onClickAdd">新增</el-button>
    <el-table :data="shopGroupList" border class="mw-table">
      <el-table-column prop="shopGroupName" align="center" class-name="table-auto" label="分组名称" />
      <el-table-column prop="shopGroupKind" align="center" class-name="table-auto" :formatter="formatEmptyText" label="分组类型" />
      <el-table-column prop="shopCount" align="center" label="门店数量">
        <template slot-scope="scope">
          {{ scope.row.shopCount || '0' }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" align="center" :formatter="formatEmptyText" label="最后修改人" />
      <el-table-column prop="updateTime" align="center" label="最后修改时间" />
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          {{ +scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <mw-button :disabled="isMaintain" class="btn-edit" content="编辑" @click="onClickEdit(scope.row)" />
            <mw-button
              :disabled="isMaintain"
              :class="scope.row.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
              :content="scope.row.status == FORBIDDEN ? '启用' : '禁用'"
              @click="onClickChangeStatus(scope.row)"
            />
            <mw-button :disabled="isMaintain" class="btn-delete" content="删除" @click="onClickDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount">
    </pagination>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onPopupDelete"
      ref="popup"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { OK, FORBIDDEN, DELETE } from 'constant/statusCode';
import { DEFAULT_PAGE } from 'constant/pagination';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'shopGroupMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      OK,
      FORBIDDEN,
      DELETE,
      isEditId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.getShopGroupList({ pageIndex, pageSize });
  },
  computed: mapState({
    shopGroupList: state => state.shopManagement.shopGroup.shopGroupList,
    recordCount: state => state.shopManagement.shopGroup.recordCount,
    pageIndex: state => state.shopManagement.shopGroup.pageIndex,
    pageSize: state => state.shopManagement.shopGroup.pageSize
  }),
  methods: {
    ...mapActions([
      'getShopGroupList',
      'updateShopGroupStatus'
    ]),
    async onChangeSize (pageSize) {
      await this.getShopGroupList({ DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.getShopGroupList(pageIndex, this.pageSize);
    },
    onClickAdd () {
      this.$router.push({ path: '/myd/shopmanagement/shopgroup/add' });
    },
    onClickEdit (row) {
      this.$router.push(`/myd/shopmanagement/shopgroup/edit/${row.shopGroupId}`);
    },
    async onClickChangeStatus (row) {
      const { pageIndex, pageSize } = this;
      const status = +row.status === OK ? FORBIDDEN : OK;
      const { shopGroupId } = row;
      await this.updateShopGroupStatus({ shopGroupId, status });
      await this.getShopGroupList({ pageIndex, pageSize });
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      if (row) {
        this.isEditId = row.shopGroupId;
      }
    },
    async onPopupDelete () {
      const { pageIndex, pageSize, isEditId } = this;
      await this.updateShopGroupStatus({ shopGroupId: isEditId, status: DELETE });
      await this.getShopGroupList({ pageIndex, pageSize });
    }
  }
};
</script>

<style lang="scss">
.shop-group-main {
  padding: 15px;

  .search-bar {
    margin-bottom: 10px;
  }
}
</style>
