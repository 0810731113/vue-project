<template>
  <div class="module-padding">
    <div class="add-food-out-tips">
      <el-button ref="addPrinter" size="small" class="btn-add btn-bottom btn-base" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd" v-if="!isChain">增加打印部门</el-button>
      <show-error-tip
        ref="showErrorTip"
        class="food-out-error-tip"
        :showError="(!deptList || !deptList.length) && guidance && tipVisibility"
        errorText="请添加打印部门" />
    </div>
    <el-table :data="deptList" border>
      <el-table-column prop="deptName" class-name="table-auto" align="center" label="打印部门名称" min-width="15%" />
      <el-table-column prop="printerName" align="center" label="打印机名称" min-width="15%" >
        <template slot-scope="scope">
          {{scope.row.printerName ? scope.row.printerName : '未配置打印机'}}
        </template>
      </el-table-column>
      <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="10%" />
      <el-table-column prop="updateUserName" align="center" label="最后修改人" min-width="20%" />
      <el-table-column prop="updateTime" align="center" label="最后修改时间" min-width="20%" />
      <el-table-column align="center" label="操作" min-width="30%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button
            v-if="!isChain"
            :disabled="isMaintain"
            :class="scope.row.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
            :content="scope.row.status == FORBIDDEN ? '启用' : '禁用'"
            @click="onClickChangeStatus(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowDeletePopup(scope.row)" v-if="!isChain"/>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-if="!guidance"
      :totalCount ="recordCount"
      :currentPage ="pageIndex"
      :pageSize ="pageSize"
      :onChangeCurrent ="onChangeCurrent" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
  import { Popup, Pagination, MwButton, ShowErrorTip } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { FORBIDDEN, OK } from 'constant/statusCode';
  import { FOOD_OUT_DEPT_POPUP_REF } from 'constant/constants';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { isChain } from 'utils/configUtil';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

  export default{
    name: 'FoodOutMain',
    props: {
      guidance: {
        type: Boolean,
        default: false
      },
      showFoodOutDeptModal: {
        type: Function,
        default: () => {}
      },
      tipVisibility: {
        type: Boolean,
        default: false
      }
    },
    components: {
      ShowErrorTip,
      Pagination,
      MwButton,
      Popup
    },
    data () {
      return {
        OK,
        FORBIDDEN,
        DEFAULT_PAGE,
        DEFAULT_PAGES,
        FOOD_OUT_DEPT_POPUP_REF,
        deptId: '',
        deptCls: '',
        isMaintain: !checkMaintainRight(this),
        isChain: isChain()
      };
    },
    computed: {
      ...mapState({
        deptList: state => state.setting.foodOut.deptList,
        recordCount: state => state.setting.foodOut.recordCount,
        pageIndex: state => state.setting.foodOut.pageIndex,
        pageSize: state => state.setting.foodOut.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchFoodOutDeptList',
        'deleteFoodOutDeptItem',
        'updateFoodOutDeptStatus'
      ]),
      onClickAdd () {
        this.guidance
          ? this.showFoodOutDeptModal(FOOD_OUT_DEPT_POPUP_REF)
          : this.$router.push('/myd/setting/foodout/add');
      },
      onClickDelete () {
        const { deptId, deptCls } = this;
        this.deleteFoodOutDeptItem({ deptId, deptCls });
      },
      onClickEdit (row) {
        this.guidance
          ? this.showFoodOutDeptModal(FOOD_OUT_DEPT_POPUP_REF, row.deptId)
          : this.$router.push(`/myd/setting/foodout/edit/${row.deptId}`);
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchFoodOutDeptList({ pageSize, pageIndex });
      },
      onShowDeletePopup (row) {
        this.$refs.popup.isShow = true;
        this.deptId = row.deptId;
        this.deptCls = row.deptCls;
      },
      async onClickChangeStatus (row) {
        const status = +row.status === OK ? FORBIDDEN : OK;
        const { deptId, deptCls } = row;
        await this.updateFoodOutDeptStatus({ deptId, status, deptCls });
      }
    },
    async created () {
      this.guidance
        ? await this.fetchFoodOutDeptList()
        : await this.fetchFoodOutDeptList({ pageSize: DEFAULT_PAGES, pageIndex: DEFAULT_PAGE });
    }
  };
</script>
<style lang="scss">
  .module-padding {
    .cell {
      word-break: break-word;
    }
  }

  .add-food-out-tips {
    position: relative;

    .food-out-error-tip {
      width: 7%;
      top: 6px;
      left: 104px;
    }
  }
</style>
