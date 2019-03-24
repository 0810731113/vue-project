<template>
  <div class="dishes-sell-plan">
    <el-button size="small" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-button size="small" class="btn-primary" :disabled="isMaintain" @click="onClickBatchDelete">删除</el-button>
    <el-table :data="sellPlanList" border @selection-change="onChangeSelection">
      <el-table-column type="selection" min-width="50px" />
      <el-table-column prop="planName" align="center" label="方案名称" min-width="12%" />
      <!--<el-table-column prop="menuCount" align="center" label="菜品数量" min-width="6%" />-->
      <el-table-column :formatter="formatTimeLimit" class-name="table-auto" align="center" label="出售日期" min-width="18%" />
      <el-table-column prop="msectionNames" :formatter="formatEmptyText" class-name="table-auto" align="center" label="出售餐段" min-width="12%" />
      <el-table-column prop="mareaNames" :formatter="formatEmptyText" class-name="table-auto" align="center" label="出售区域" min-width="12%" />
      <el-table-column align="center" :formatter="getServiceNames" class-name="table-auto" label="服务范围" min-width="12%" />
      <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="5%" />
      <el-table-column align="center" label="操作" min-width="10%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onClickDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount">
    </pagination>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onPopupDelete"
      ref="popup">
    </popup>
    <toast
      ref='toast'
      content="请选择要操作的数据!"
      :timeout="2000"
      type="warning">
    </toast>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { OK } from 'constant/statusCode';
  import { SERVICE } from 'constant/constants';
  import { Popup, Pagination, Toast, MwButton } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { DEFAULT_PAGE } from 'constant/pagination';

  export default {
    name: 'sellPlanMain',
    components: {
      Popup,
      MwButton,
      Pagination,
      Toast
    },
    data () {
      return {
        OK,
        SERVICE,
        guids: [],
        selectedNames: [],
        editId: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    async created () {
      const { pageIndex, pageSize } = this;
      await this.fetchSellPlanList({ pageIndex, pageSize });
    },
    computed: mapState({
      sellPlanList: state => state.dishes.sellPlan.sellPlanList,
      pageIndex: state => state.dishes.sellPlan.pageIndex,
      pageSize: state => state.dishes.sellPlan.pageSize,
      recordCount: state => state.dishes.sellPlan.recordCount
    }),
    methods: {
      ...mapActions([
        'fetchSellPlanList',
        'deleteMenuSellPlan'
      ]),
      onClickAdd () {
        this.$router.push({ path: '/myd/dishes/sellPlan/add' });
      },
      async onChangeSize (pageSize) {
        await this.fetchSellPlanList({ pageIndex: DEFAULT_PAGE, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        await this.fetchSellPlanList({ pageIndex, pageSize: this.pageSize });
      },
      onChangeSelection (datas) {
        this.guids = [];
        datas.map(data => {
          this.guids.push(data.guid);
        });
      },
      formatTimeLimit (row) {
        return row.timeLimit > 0 ? `${row.timeLimitDate}` : '不限';
      },
      getServiceNames (row) {
        let { serviceIds } = row;
        if (!serviceIds) return '-';
        let serviceNames = '';
        serviceIds = serviceIds.split(',');
        serviceIds.forEach((id) => {
          serviceNames += `${SERVICE[id]}、`;
        });
        return serviceNames.substr(0, serviceNames.length - 1);
      },
      onClickEdit (row) {
        this.$router.push(`/myd/dishes/sellPlan/edit/${row.guid}`);
      },
      onClickBatchDelete () {
        const type = !this.guids.length ? 'toast' : 'popup';
        this.$refs[type].isShow = true;
      },
      onClickDelete (row) {
        this.guids.push(row.guid);
        this.$refs.popup.isShow = true;
      },
      async onPopupDelete () {
        const { pageIndex, pageSize, guids } = this;
        await this.deleteMenuSellPlan({ guids });
        await this.fetchSellPlanList({ pageIndex, pageSize });
      }
    }
  };
</script>

<style lang="scss">
  .dishes-sell-plan {
    padding: 15px;

    .el-button {
      height: 36px;
    }

    .ingredient-group {
      margin-left: 30px;
    }

    .el-table {
      margin-top: 15px;
    }
  }
</style>
