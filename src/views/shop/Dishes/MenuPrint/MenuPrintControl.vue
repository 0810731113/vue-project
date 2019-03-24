<template>
  <div class ="dishes-menu-control">
    <el-table :data="ListPrintPlanDetail" border style="width: 100%;" max-height="500">
      <el-table-column prop="printName" label="打印方案名称" align="center" min-width="20%" />
      <el-table-column label="方案详情" prop="detailList" align="center">
        <template slot-scope="scope">
          <div v-html=" getPlanListDetails(scope.row['detailList']) "></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="12%">
        <template slot-scope="scope" @click='showAddPrintPlan'>
          <div class="btn-wrapper">
            <mw-button class="btn-edit" content="编辑" @click="showWritePrintPlan(scope.row)" />
            <mw-button class="btn-delete" @click="handleDeletePrintPlan(scope.row.printId)" content="删除" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class='add-print-plan' @click="showAddPrintPlan">+新增打印方案</div>
    <div class='back-box'>
      <el-button class="btn-submit" @click="goBack">返回</el-button>
    </div>
    <print-plan
      :tableArea="tableArea"
      :printDeptList="printDeptList"
      :getListPrintPlanDetail="getListPrintPlanDetail"
      :handleMenuPrintPlan="saveMenuPrintPlan"
      ref="addPrintPlan"
      title='新增打印方案' />
    <print-plan
      :tableArea="tableArea"
      :currentPlanDetail="currentPlanDetail"
      :printDeptList="printDeptList"
      :showTip="true"
      :getListPrintPlanDetail="getListPrintPlanDetail"
      :handleMenuPrintPlan="editMenuPrintPlan"
      ref="editPrintPlan"
      title='编辑打印方案' />
    <popup
      :title="popTitle"
      :tips="popTips"
      :handleOk="onClickDelete"
      ref="popup"
    />
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { MwButton, Popup } from 'components';
import PrintPlan from 'common/PrintPlan';

export default {
  name: 'MenuPrintControl',
  components: { PrintPlan, MwButton, Popup },
  data () {
    return {
      willDeletePrintPlan: '',
      popTitle: '',
      popTips: '',
      currentPlanDetail: { detailList: [], printId: null, printName: '' },
      tableArea: []
    };
  },
  computed: mapState({
    ListPrintPlanDetail: state => state.dishes.menuPrint.ListPrintPlanDetail,
    printDeptList: state => state.dishes.menuPrint.printDeptList,
    itemKind: state => state.dishes.menuPrint.itemKind
  }),
  methods: {
    ...mapActions([
      'getListPrintPlanDetail',
      'getAllPrintDept',
      'getTableArealist',
      'saveMenuPrintPlan',
      'editMenuPrintPlan',
      'deletePrintPlan'
    ]),
    // 展示时候进行的合并
    getPlanListDetails (data) {
      const showMulPrintPlan = [];
      let str = ``;
      data.forEach(item => {
        const index = showMulPrintPlan.findIndex(showPlan => showPlan.deptId === item.deptId);
        if (index > -1) {
          showMulPrintPlan[index].mareaName += `, ${item.mareaName}`;
        } else {
          showMulPrintPlan.push(JSON.parse(JSON.stringify(item)));
        }
      });
      const isSelectAll = (tableArea, mareaName) => {
        let res = '';
        if (mareaName) {
          res = mareaName.split(',').length === tableArea.length ? '全部区域' : mareaName;
        }

        return res;
      };
      showMulPrintPlan.forEach(item => {
        str = `${str}${str ? '<br />' : ''}区域：${isSelectAll(this.tableArea, item.mareaName)};&nbsp;&nbsp;&nbsp;&nbsp;打印：${item.deptName}`;
      });

      return str;
    },
    // 展示新增方案浮窗
    showAddPrintPlan () {
      this.$refs.addPrintPlan.isShow = true;
    },
    // 展示编辑方案浮窗
    showWritePrintPlan (currentPlanDetail) {
      this.currentPlanDetail = currentPlanDetail;
      this.$refs.editPrintPlan.isShow = true;
    },
    async onClickDelete () {
      await this.deletePrintPlan({ printPlanId: this.willDeletePrintPlan });
      this.getListPrintPlanDetail();
    },
    handleDeletePrintPlan (printPlanId) {
      this.popTitle = '删除操作';
      this.popTips = '您确认要删除此数据吗?';
      this.$refs.popup.isShow = true;
      this.willDeletePrintPlan = printPlanId;
    },
    goBack () {
      this.$router.go(-1);
    }
  },
  async created () {
    await this.getListPrintPlanDetail();
    // 获取菜品打印部门
    await this.getAllPrintDept({ itemKind: this.itemKind });
    // 取餐桌区域
    this.tableArea = await this.getTableArealist().then(item => item.tableMareaDLLList);
  }
};
</script>

<style lang='scss'>
.dishes-menu-control {
  padding: 15px 15px 0;

  .el-table__body .cell {
    line-height: 2.5;
  }

  .add-print-plan {
    text-align: center;
    height: 40px;
    line-height: 40px;
    border: 1px solid rgb(230, 233, 243);
    border-top: 0 none;
    background-color: rgb(239, 239, 239);

    &:hover {
      color: #f40;
      cursor: pointer;
    }
  }

  .back-box {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
