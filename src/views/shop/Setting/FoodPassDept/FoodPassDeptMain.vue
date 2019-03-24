<template>
  <div class="module-padding">
    <el-button size="small" class="btn-add btn-bottom" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-table :data="deptList" border>
      <el-table-column prop="deptName" align="center" label="传菜点名称" min-width="20%" />
      <el-table-column prop="printerName" align="center" label="打印机" min-width="20%" />
      <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="20%" />
      <el-table-column prop="updateUserName" align="center" label="最后修改人" min-width="20%" />
      <el-table-column prop="updateTime" align="center" label="最后修改时间" min-width="20%" />
      <el-table-column align="center" label="操作" min-width="30%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowDeletePopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeCurrent="onChangeCurrent" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { Popup, Pagination, MwButton } from 'components';

  export default{
    name: 'FoodPassDeptMain',
    components: {
      Pagination,
      MwButton,
      Popup
    },
    data () {
      return {
        deptId: '',
        deptCls: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        deptList: state => state.setting.foodPass.deptList,
        recordCount: state => state.setting.foodPass.recordCount,
        pageIndex: state => state.setting.foodPass.pageIndex,
        pageSize: state => state.setting.foodPass.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchFoodPassDeptList',
        'deleteFoodOPassDeptItem'
      ]),
      onClickAdd () {
        this.$router.push('/myd/setting/foodpass/add');
      },
      onClickDelete () {
        const { deptId, deptCls } = this;
        this.deleteFoodOPassDeptItem({ deptId, deptCls });
      },
      onClickEdit (row) {
        this.$router.push(`/myd/setting/foodpass/edit/${row.deptId}`);
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchFoodPassDeptList({ pageSize, pageIndex });
      },
      onShowDeletePopup (row) {
        this.$refs.popup.isShow = true;
        this.deptId = row.deptId;
        this.deptCls = row.deptCls;
      }
    },
    async created () {
      const { pageSize, pageIndex } = this;
      await this.fetchFoodPassDeptList({ pageSize, pageIndex });
    }
  };
</script>
