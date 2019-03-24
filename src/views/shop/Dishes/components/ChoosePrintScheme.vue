<template>
  <el-dialog custom-class="base-modal choice-print-scheme" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">选中打印方案</div>
    <div class="ids-wrapper">
      <el-select v-model="printPlanName" class="print-plan-name" @change="getPrintPlanList">
        <el-option
          v-for="item in printNameList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <el-table :data="printPlanList" border>
      <el-table-column prop="deptName" align="center" label="制作部门" min-width="12%">
      </el-table-column>
      <el-table-column prop="mareaName" align="center" label="所属区域" min-width="12%">
        <template slot-scope="scope">
          {{ scope.row.mareaName}}
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="modal-footer">
      <el-button class="btn-submit" type="primary" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'choosePrintScheme',
    props: ['printPlanList', 'fetchPrintPlanList', 'getPrintNameList'],
    data () {
      return {
        isShow: false,
        printPlanName: ''
      };
    },
    watch: {
      async isShow () {
        if (this.isShow) {
          await this.init();
        };
      }
    },
    computed: mapState({
      printNameList: state => state.dishes.menuPrint.printNameList
    }),
    methods: {
      async init () {
        await this.getPrintNameList();
        const [printPlanName] = this.printNameList;
        if (printPlanName) {
          await this.fetchPrintPlanList({ printPlanName });
          this.printPlanName = printPlanName;
        }
      },
      getPrintPlanList () {
        const { printPlanName } = this;
        this.fetchPrintPlanList({ printPlanName });
      },
      onSubmit () {
        const { printPlanName } = this;
        if (printPlanName) {
          this.$parent.onUpdateMenuPrintPlan({ printPlanName });
        }
        this.isShow = false;
      }
    }
  };
</script>

<style lang='scss'>
  .choice-print-scheme {
    .el-dialog__body {
      padding: 15px 20px;
    }

    .print-plan-name {
      margin-bottom: 10px;
      width: 150px;
    }
  }
</style>
