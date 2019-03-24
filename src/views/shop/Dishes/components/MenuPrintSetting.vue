<template>
  <el-dialog custom-class="base-modal menuPrint-setting-modal" :visible.sync="isShow" width="50%">
    <el-form class="menu-print mw-form" ref="form" :model="form" label-width="120px">
      <el-form-item>
        <el-radio class="radio" v-model="form.itemKind" :label="1">无打印部门</el-radio>
      </el-form-item>
      <el-form-item>
        <el-radio class="radio" v-model="form.itemKind" :label="2">
          {{ compKind === ITEMKIND.DISH ? "单个打印部门" : "套餐头部门" }}
        </el-radio>
        <el-select v-model="form.deptId" v-if="form.itemKind === 2" class="print-depart">
          <el-option label="不限" value="-1" />
          <el-option
            v-for="item in printDeptList"
            v-if="+item.deptId !== -1 && +item.deptId !== 9999"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-radio class="radio" v-model="form.itemKind" :label="3">
          {{ compKind === ITEMKIND.DISH ? "多打印部门方案" : "套餐明细部门" }}
        </el-radio>
        <el-select @change="_getPrintPlanList(form.printPlanName)" v-model="form.printPlanName" v-if="form.itemKind === 3 && compKind === ITEMKIND.DISH" class="print-depart">
          <el-option
            v-for="item in printNameList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.itemKind === 3 && compKind === ITEMKIND.DISH">
        <el-table :data="showMulPrintPlan" border style="width: 100%;" max-height="300">
          <el-table-column prop="mareaName" label="餐桌区域" align="center" min-width="12%">
            <template slot-scope="scope">
              {{ scope.row.mareaName || ''}}
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="打印部门" align="center" min-width="12%" />
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-submit" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
  import { ITEMKIND } from 'constant/constants';

  export default {
    name: 'menuPrintSetting',
    /**
     * printDeptList: 打印部门数组
     * updateMenuPrint: 调用更新方法
     * printNameList: 打印方案数组
     * compKind: 区分是打印部门模块还是套餐模块  1=打印部门  2=套餐
     */
    props: ['printDeptList', 'updateMenuPrint', 'printNameList', 'compKind', 'getPrintPlanList', 'printPlanList', 'isPrintMany', 'passToSingleSetting'],
    watch: {
      async isShow () {
        this.form.printPlanName = null;
        if (this.isPrintMany === 1) {
          this.showMulPrintPlan = [];
          this.form.itemKind = 1;
          this.form.deptId = null;
        } else if (this.isPrintMany === 2) {
          const { deptId, isPrn, isMulDept, isSetDtlPrn } = this.passToSingleSetting;
          if (isPrn === 0) {
            this.form.itemKind = 1;
          } else {
            if (this.compKind === 1) {
              if (isMulDept === 0) {
                this.form.itemKind = 2;
              } else {
                this.form.itemKind = 3;
              }
            } else if (this.compKind === 2) {
              if (isSetDtlPrn === 1) {
                this.form.itemKind = 2;
              } else {
                this.form.itemKind = 3;
              }
            }
          }
          this.form.deptId = deptId;
        }
      },
      printPlanList () {
        this.getShowMulPrintPlan(this.printPlanList);
      }
    },
    data () {
      return {
        isShow: false,
        showMulPrintPlan: [],               // 处理后台数据展示，接口调用仍传printPlanList
        form: {
          itemKind: 1,
          deptId: null,
          printPlanName: null               // 打印名称，获取选中打印方案参数
        },
        ITEMKIND
      };
    },
    methods: {
      _getPrintPlanList (printPlanName) {
        this.getPrintPlanList(printPlanName);
      },
      getShowMulPrintPlan (data) {
        // 展示所需的数据结构和后台存储的不同，展示用另一份
        const showMulPrintPlan = [];
        data.forEach(item => {
          const index = showMulPrintPlan.findIndex(showPlan => showPlan.deptId === item.deptId);
          if (index > -1) {
            showMulPrintPlan[index].mareaName += `, ${item.mareaName}`;
          } else {
            showMulPrintPlan.push(JSON.parse(JSON.stringify(item)));
          }
        });

        this.showMulPrintPlan = showMulPrintPlan;
      },
      async onSubmit () {
        const { deptId, itemKind } = this.form;
        if (itemKind === 3 && this.compKind === 1 && (!this.showMulPrintPlan || this.showMulPrintPlan.length === 0)) {
          this.$toast.show({ content: '请选择打印方案' });
          return;
        }
        if (this.compKind === 1) {
          if (itemKind === 1) {
            await this.$parent.onUpdateMenuPrint({ deptId: null, lstMulDept: this.printPlanList, isMulDept: null, isPrn: 0 });
          } else if (itemKind === 2) {
            await this.$parent.onUpdateMenuPrint({ deptId, lstMulDept: [], isMulDept: 0, isPrn: 1 });
          } else if (itemKind === 3) {
            await this.$parent.onUpdateMenuPrint({ deptId: null, lstMulDept: this.printPlanList, isMulDept: 1, isPrn: 1 });
          }
        } else if (this.compKind === 2) {
          if (itemKind === 1) {
            await this.$parent.onUpdateMenuPrint({ isPrn: 0, deptId: null, isSetDtlPrn: 0 });
          } else if (itemKind === 2) {
            await this.$parent.onUpdateMenuPrint({ isPrn: 1, deptId, isSetDtlPrn: '1' });
          } else if (itemKind === 3) {
            await this.$parent.onUpdateMenuPrint({ isPrn: 1, deptId: null, isSetDtlPrn: '2' });
          }
        }
        this.onShowOrHideModal();
      },
      onShowOrHideModal () {
        this.isShow = false;
      }
    }
  };
</script>

<style lang='scss'>
  .menuPrint-setting-modal {
    width: 680px;

    .ids-wrapper {
      width: 35%;
      word-wrap: break-word;
      display: inline-block;
      margin-left: 20px;

      .menu-print-id {
        font-size: 16px;
      }
    }

    .settinng-wrapper {
      width: 60%;
      display: inline-block;

      .el-select .el-input__inner {
        width: 100% !important;
      }
    }

    .el-dialog__body {
      padding: 0;
    }

    .print-depart {
      margin-left: 10px;
    }

    .el-form-item__content {
      margin-left: 0 !important;
    }

    .el-form-item {
      margin-bottom: 10px;

      .el-radio {
        min-width: 130px;
      }
    }

    .select-type {
      width: 50%;
    }
  }
</style>
