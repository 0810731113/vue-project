<template>
  <div class="base-modal multi-menu-print">
    <el-form>
      <el-form-item class="table-title">
        <span @click="onShowModal('choose')">制作部门方案</span>
        <span class="save-scheme" @click="onShowModal('save')">保存方案</span>
      </el-form-item>
      <el-form-item>
        <el-table :data="value" border ref="value" style="width: 100%" @header-click="addMenuPrintDepts">
          <el-table-column prop="deptId" label="制作部门" align="center">
            <template slot-scope="scope">
              <el-select v-model="value[scope.$index].deptId">
                <el-option
                  v-for="item in printDeptList"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="mareaId" label="所属区域" align="center">
            <template slot-scope="scope">
              <el-select v-model="value[scope.$index].mareaId" >
                <el-option label="不限" :value="null"></el-option>
                <el-option
                  v-for="item in tableAreaList"
                  :key="item.mareaId"
                  :label="item.mareaName"
                  :value="item.mareaId"
                  style="width: 100%">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column class-name="icon-add" label="+" prop="add" align="center">
            <template slot-scope="scope">
              <mw-button class="btn-delete" content="删除" @click.native.prevent="onDeleteRow(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <choose-print-scheme
      ref="choose"
      :printPlanList="printPlanList"
      :fetchPrintPlanList="fetchPrintPlanList"
      :getPrintNameList="getPrintNameList"
    />
    <save-print-scheme
      ref="save"
      :isPrintPlanExist="isPrintPlanExist"
      :saveMenuPrintPlan="saveMenuPrintPlan"
      :lstMulDept="value"
      :getPrintNameList="getPrintNameList"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { MwButton } from 'components';
  import cloneDeep from 'lodash/cloneDeep';
  import { ChoosePrintScheme, SavePrintScheme } from '../components/index';

  export default {
    name: 'multiMenuPrint',
    components: {
      MwButton,
      ChoosePrintScheme,
      SavePrintScheme
    },
    props: {
      value: {
        type: Array,
        default: () => []
      },
      printDeptList: {
        type: Array,
        default: () => []
      }
    },
    async created () {
      await this.getTableArealist();
    },
    computed: mapState({
      tableAreaList: state => state.tables.management.tableAreaList,
      printPlanList: state => state.dishes.menuPrint.printPlanList
    }),
    methods: {
      ...mapActions([
        'fetchPrintPlanList',
        'getPrintNameList',
        'isPrintPlanExist',
        'saveMenuPrintPlan',
        'getTableArealist'
      ]),
      onShowModal (type) {
        this.$refs[type].isShow = true;
      },
      async addMenuPrintDepts (column, event) {
        const { property } = column;
        if (property === 'add') {
          this.value.push({
            deptId: '',
            mareaId: ''
          });
        }
      },
      onDeleteRow (index) {
        this.value.splice(index, 1);
      },
      async onUpdateMenuPrintPlan (params) {
        await this.fetchPrintPlanList({ ...params });
        this.$emit('input', cloneDeep(this.printPlanList.slice()));
      }
    }
  };
</script>

<style lang="scss">
  .multi-menu-print {
    .icon-add {
      cursor: pointer;
    }

    .table-title {
      display: flex;
      justify-content: flex-end;
      color: #337ab7;
      cursor: pointer;

      .el-form-item__content {
        font-size: 16px;
        font-family: initial;
      }

      .save-scheme {
        margin-left: 20px;
      }
    }
  }
</style>
