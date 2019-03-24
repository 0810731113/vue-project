<template>
  <div class="department-main">
    <el-button size="small" ref="btnAdd" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-table :data="deparmentList" border class="mw-table">
      <el-table-column prop="deptId" class-name="table-auto" align="center" label="部门代码" />
      <el-table-column prop="deptName" align="center" label="部门名称" />
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
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
      :totalCount="recordCount" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
import { OK } from 'constant/statusCode';
import { DEFAULT_PAGES, DEFAULT_PAGE } from 'constant/pagination';
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'departmentMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      OK,
      DEFAULT_PAGE,
      DEFAULT_PAGES,
      deptId: '',
      deptCls: 0,
      isMaintain: !checkMaintainRight(this)
    };
  },
  created () {
    const { deptCls } = this;
    this.fetchShopDeptList({ pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES, deptCls });
  },
  computed: {
    ...mapState({
      deparmentList: state => state.employe.department.deparmentList,
      recordCount: state => state.employe.department.recordCount,
      pageIndex: state => state.employe.department.pageIndex,
      pageSize: state => state.employe.department.pageSize
    })
  },
  methods: {
    ...mapActions([
      'fetchShopDeptList',
      'deleteShopDept'
    ]),
    async onChangeCurrent (pageIndex) {
      const { pageSize, deptCls } = this;
      await this.fetchShopDeptList({ pageIndex, pageSize, deptCls });
    },
    onClickAdd () {
      this.$router.push('/myd/employe/department/add');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/employe/department/edit/${row.deptId}`);
    },
    async onClickDelete () {
      const { pageIndex, pageSize, deptCls, deptId } = this;
      await this.deleteShopDept({ deptId });
      await this.fetchShopDeptList({ pageIndex, pageSize, deptCls });
    },
    onShowPopup (row) {
      this.$refs.popup.isShow = true;
      this.deptId = row.deptId;
    }
  }
};
</script>

<style lang="scss">
  .department-main {
    padding: 15px;
  }
</style>
