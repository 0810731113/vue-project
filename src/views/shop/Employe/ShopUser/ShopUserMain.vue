<template>
  <div class="shop-user-main">
    <el-button size="small" ref="btnAdd" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-table :data="shopUserList" border class="mw-table">
      <el-table-column prop="deptName" align="center" label="所属部门" />
      <el-table-column prop="staffId" align="center" label="员工编号" />
      <el-table-column prop="shopUserName" align="center" label="员工姓名" />
      <el-table-column prop="cellphone" align="center" label="手机号码" />
      <el-table-column prop="shopUserId" align="center" label="登录账号" />
      <el-table-column prop="note" align="center" label="备注" />
      <el-table-column prop="fingerprintStatus" align="center" label="指纹授权状态">
        <template slot-scope="scope">
          {{ scope.row.fingerprintStatus === OK ? '已授权' : scope.row.fingerprintStatus === FORBIDDEN ? '未授权' : '未录入' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button
            :disabled="isMaintain"
            :class="scope.row.fingerprintStatus === OK ? 'btn-forbid' : 'btn-ok'"
            :content="scope.row.fingerprintStatus === OK ? '禁用授权' : '启用授权'"
            @click="onClickUpdatePrintStatus(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowPopup(scope.row)" v-if="!(+scope.row.staffId === 99999 || scope.row.staffId === 'cash')"/>
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
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
import { OK, FORBIDDEN } from 'constant/statusCode';
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'shopUserMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      OK,
      FORBIDDEN,
      content: '',
      staffId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchShopUserList({ pageIndex, pageSize });
  },
  computed: {
    ...mapState({
      shopUserList: state => state.employe.shopUser.shopUserList,
      recordCount: state => state.employe.shopUser.recordCount,
      pageIndex: state => state.employe.shopUser.pageIndex,
      pageSize: state => state.employe.shopUser.pageSize
    })
  },
  methods: {
    ...mapActions([
      'deleteShopUser',
      'fetchShopUserList',
      'updateUserPrintStatus'
    ]),
    async onChangeCurrent (pageIndex) {
      const { pageSize } = this;
      await this.fetchShopUserList({ pageIndex, pageSize });
    },
    onClickAdd () {
      this.$router.push('/myd/employe/shopuser/add');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/employe/shopuser/edit/${row.staffId}`);
    },
    async onClickUpdatePrintStatus (row) {
      const { pageIndex, pageSize } = this;
      await this.updateUserPrintStatus({ fingerPrintStatus: row.fingerprintStatus === OK ? FORBIDDEN : OK, staffId: row.staffId });
      await this.fetchShopUserList({ pageIndex, pageSize });
    },
    async onClickDelete () {
      const { pageIndex, pageSize, staffId } = this;
      await this.deleteShopUser({ staffId });
      await this.fetchShopUserList({ pageIndex, pageSize });
    },
    onShowPopup (row) {
      this.staffId = row.staffId;
      this.$refs.popup.isShow = true;
    }
  }
};
</script>

<style lang="scss">
  .shop-user-main {
    padding: 15px;
  }
</style>
