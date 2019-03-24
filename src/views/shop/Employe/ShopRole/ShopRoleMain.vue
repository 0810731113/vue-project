<template>
  <div class="shop-role-main">
    <el-button size="small" ref="btnAdd" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">添加角色权限</el-button>
    <el-table :data="shopRoleList" border class="mw-table">
      <el-table-column prop="roleName" align="center" label="角色名称" />
      <el-table-column prop="updateUserName" align="center" label="最后修改人" />
      <el-table-column prop="updateTime" align="center" label="最后修改时间" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowPopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount"
    />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup"
    />
  </div>
</template>

<script>
import { OK } from 'constant/statusCode';
import { mapActions, mapState } from 'vuex';
import { checkMaintainRight } from 'utils/permissionUtil';
import { Popup, Pagination, MwButton } from 'components';

export default {
  name: 'shopRoleMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      OK,
      roleId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchShopRoleList({ pageIndex, pageSize });
  },
  computed: {
    ...mapState({
      shopRoleList: state => state.employe.shopRole.shopRoleList,
      recordCount: state => state.employe.shopRole.recordCount,
      pageIndex: state => state.employe.shopRole.pageIndex,
      pageSize: state => state.employe.shopRole.pageSize,
      errorStatus: state => state.error.errorStatus
    })
  },
  methods: {
    ...mapActions([
      'fetchShopRoleList',
      'updateShopRoleStatus'
    ]),
    async onChangeCurrent (pageIndex) {
      const { pageSize } = this;
      await this.fetchShopRoleList({ pageIndex, pageSize });
    },
    onClickAdd () {
      this.$router.push('/myd/employe/shoprole/add');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/employe/shoprole/edit/${row.roleId}`);
    },
    async onClickDelete () {
      const { pageIndex, pageSize, roleId } = this;
      await this.updateShopRoleStatus({ roleId });
      if (!this.errorStatus) {
        this.$toast.show({ content: '删除成功' });
      }

      await this.fetchShopRoleList({ pageIndex, pageSize });
    },
    onShowPopup (row) {
      this.$refs.popup.isShow = true;
      this.roleId = row.roleId;
    }
  }
};
</script>

<style lang="scss">
  .shop-role-main {
    padding: 15px;

    .btn-add {
      width: 130px;
    }
  }
</style>
