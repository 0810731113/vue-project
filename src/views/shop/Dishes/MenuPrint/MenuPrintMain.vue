<template>
  <div class ="dishes-menu-print">
    <div class="el-col-4" v-if="!isGuide">
      <div class="menu-cls-kind">
        <el-select :value="itemKind" @input="(value) => getClassifyList(value)">
          <el-option label="菜品" :value="1"></el-option>
          <el-option label="套餐" :value="2"></el-option>
        </el-select>
      </div>
      <div class="tree-border">
        <el-tree
          class="menu-tree"
          :data="classifyList"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
          :expand-on-click-node="false"
          @node-click="onClickNode" />
      </div>
    </div>
    <div :class="{ 'el-col-24': isGuide }" class="el-col-20">
      <div class="search-wrapper">
        <el-button class="btn-primary" :disabled="isMaintain" @click="onShowSetting">批量设置</el-button>
        <el-button class="btn-primary" v-if='isShop' :disabled="isMaintain" @click="toPrintControl">打印管理</el-button>
        <div class="select-wrapper">
          <el-select v-model="searchForm.deptId" class="print-depart" @change="getMenuPrintList">
            <el-option label="全部" :value="null" />
            <el-option
              v-for="item in printDeptList"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId" />
          </el-select>
        </div>
      </div>
      <el-table :data="menuPrintList" border @selection-change="onChangeSelection" max-height="640">
        <el-table-column type="selection" min-width="50px" />
        <el-table-column prop="itemId" align="center" label="菜品编号" min-width="15%" />
        <el-table-column prop="itemName" class-name="table-auto" align="center" label="菜品名称" min-width="15%" />
        <el-table-column prop="deptName" align="center" class-name="table-auto" label="打印部门" min-width="15%">
          <template slot-scope="scope">
            {{ +scope.row.isPrn === 0 ? '-' : +scope.row.isPrn === 1 && +scope.row.isSetDtlPrn === 2 ? '套餐明细部门': +scope.row.isPrn === 1  && +scope.row.isMulDept === 1 ? '多部门' : scope.row.deptName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="15%" />
        <el-table-column v-if="!isGuide" align="center" label="操作" min-width="20%">
          <template slot-scope="scope">
            <mw-button class="btn-manage" content="设置" :disabled="isMaintain" @click="onClickEdit(scope.row, itemKind)" />
          </template>
        </el-table-column>
      </el-table>
      <menu-print-setting
        ref="menuPrintSetting"
        :compKind="+itemKind"
        :isPrintMany="isPrintMany"
        :printDeptList="printDeptList"
        :printNameList="printNameList"
        :getPrintPlanList="getPrintPlanList"
        :printPlanList="printPlanList"
        :passToSingleSetting="passToSingleSetting"
        :updateMenuPrint="updateMenuPrint" />
      <toast
        ref='toast'
        content="请选择要操作的数据!"
        :timeout="2000"
        type="warning" />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { isShop } from 'utils/configUtil';
  import { OK, COMBO_DETAIL_DEPT } from 'constant/statusCode';
  import { Toast, MwButton } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { MenuPrintSetting } from '../components';

  export default {
    name: 'menuPrintMain',
    components: {
      MenuPrintSetting,
      MwButton,
      Toast
    },
    props: {
      isGuide: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        isShop: isShop(),
        OK,
        COMBO_DETAIL_DEPT,
        searchForm: {
          deptId: null,
          menuClsId: 0
        },
        defaultProps: {
          children: 'children',
          label: 'menuClsName'
        },
        itemCd: [],
        singleCd: [],                                 // 单独设置时的单一cd
        menuClsIds: '',
        isMaintain: !checkMaintainRight(this),
        isPrintMany: 1,                               // 判断是批量设置还是单独设置 1:批量  2:单独
        passToSingleSetting: []                       // 传递给单独设置模块的数据
      };
    },
    async created () {
      const { deptId, menuClsId } = this.searchForm;
      const { itemKind } = this;
      let params = { deptId, itemKind, menuClsId };
      await this.fetchAllMenuPrint(params);
      await this.getAllPrintDept({ itemKind });
      if (!this.isGuide) {
        await this.fetchAllClassify({ showSystemData: false, menuClsKind: itemKind });
      }
    },
    computed: mapState({
      menuPrintList: state => state.dishes.menuPrint.menuPrintList,
      itemKind: state => state.dishes.menuPrint.itemKind,
      printDeptList: state => state.dishes.menuPrint.printDeptList,
      printPlanDetail: state => state.dishes.menuPrint.printPlanDetail,
      printNameList: state => state.dishes.menuPrint.printNameList,
      printPlanList: state => state.dishes.menuPrint.printPlanList,
      classifyList () {
        const { allClassify } = this.$store.state.dishes.classify;
        return [{ children: allClassify, menuClsName: '全部分类', menuClsId: 0 }];
      }
    }),
    methods: {
      ...mapActions([
        'fetchAllMenuPrint',
        'getAllPrintDept',
        'updateMenuPrint',
        'fetchAllClassify',
        'setItemKind',
        'getPrintNameList',
        'fetchPrintPlanList',         // 获取打印方案对应详情数据
        'updateSetMealMenuPrint',
        'getInitPrintPlanDetail'
      ]),
      async onClickNode (data) {
        const { deptId } = this.searchForm;
        const { itemKind } = this;
        await this.fetchAllMenuPrint({ menuClsId: this.getMenuClsId(data), deptId, itemKind });
      },
      async onClickEdit (row, itemKind) {
        const { itemCd } = row;
        this.isPrintMany = 2;
        this.singleCd = [itemCd];
        this.passToSingleSetting = row;
        if (itemKind === 1) {
          await this.getPrintNameList();
          await this.getInitPrintPlanDetail({ itemCd, noShowError: true });
        }
        this.$refs.menuPrintSetting.isShow = true;
      },
      async onShowSetting () {
        if (!this.itemCd.length) {
          this.$refs.toast.isShow = true;
        } else {
          this.isPrintMany = 1;
          if (this.itemKind === 1) {
            await this.getPrintNameList();
          }
          this.$refs.menuPrintSetting.isShow = true;
        }
      },
      toPrintControl () {
        this.$router.push('/myd/dishes/menuPrint/menuPrintControl');
      },
      onChangeSelection (datas) {
        this.itemCd = [];
        datas.map(data => {
          this.itemCd.push(data.itemCd);
        });
      },
      async onUpdateMenuPrint (params) {
        const { itemCd, singleCd, isPrintMany } = this;
        if (this.itemKind === 1) {
          await this.updateMenuPrint({ ...params, itemCd: isPrintMany === 1 ? itemCd : singleCd });
        } else if (this.itemKind === 2) {
          await this.updateSetMealMenuPrint({ ...params, itemCd: isPrintMany === 1 ? itemCd : singleCd });
        }
        await this.getMenuPrintList();
      },
      async getMenuPrintList () {
        const { menuClsIds, searchForm, itemKind } = this;
        await this.fetchAllMenuPrint({ ...searchForm, menuClsId: menuClsIds, itemKind });
      },
      async getClassifyList (itemKind) {
        await this.setItemKind({ itemKind });
        await this.fetchAllClassify({ menuClsKind: itemKind });
        await this.getMenuPrintList(itemKind);
        await this.getAllPrintDept({ itemKind });
      },
      getMenuClsId (data) {
        const ids = [data.menuClsId];
        if (data.level) {
          (data.children || []).map(item => {
            ids.push(item.menuClsId);
            (item.children || []).map(subItem => {
              ids.push(subItem.menuClsId);
            });
          });
        }
        this.menuClsIds = ids.toString();
        return ids.toString();
      },
      getPrintPlanList (printPlanName) {
        this.fetchPrintPlanList({ printPlanName });
      }
    }
  };
</script>

<style lang="scss">
  .dishes-menu-print {
    padding: 15px;

    .menu-cls-kind {
      margin: 0 20px 16px 0;
    }

    .tree-border {
      border: 1px solid #CDCDCD;
      margin-right: 20px;

      .menu-tree {
        border: none;
        max-height: 510px;
        overflow-y: auto;
        color: black;
      }
    }

    .el-col-20 {
      .search-wrapper {
        padding-bottom: 15px;

        .select-wrapper {
          float: right;
          display: block;
        }
      }
    }

    .el-select {
      .el-input__inner {
        height: 40px;
      }
    }

    .btn-setting {
      width: 137px;
    }
  }
</style>
