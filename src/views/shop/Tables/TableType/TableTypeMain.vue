<template>
  <div class="module-padding">
    <div class="add-table-type-tips">
      <el-button size="small" ref="addTable" class="btn-add btn-bottom" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
      <show-error-tip
        ref="showErrorTip"
        class="table-type-error-tip"
        :showError="!tableTypeList.length && guidance && tipVisibility"
        errorText="请添加餐桌类型" />
    </div>
    <el-table :data="tableTypeList" border style="width: 100%" empty-text="您尚未添加餐桌类型">
      <el-table-column prop="mtableClsName" class-name="table-auto" align="center" label="类型名称" />
      <el-table-column :formatter="getStatusText" align="center" label="状态" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button
            :disabled="isMaintain"
            :class="+scope.row.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
            @click="onClickChangeStatus(scope.row)"
            :content="+scope.row.status == FORBIDDEN ? '启用' : '禁用'" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowDeletePopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="!guidance"
      :totalCount="totalCountOfTableTypes"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent="onChangeCurrent" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
  import { Pagination, Popup, MwButton, ShowErrorTip } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { FORBIDDEN, OK, DELETE } from 'constant/statusCode';
  import { TABLE_TYPE_POPUP_REF, MAX_PAGE_SIZE } from 'constant/constants';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'TableTypeMain',
    props: {
      guidance: {
        type: Boolean,
        default: false
      },
      showTableTypeModal: {
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
        MAX_PAGE_SIZE,
        FORBIDDEN,
        OK,
        editId: '',
        TABLE_TYPE_POPUP_REF,
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        tableTypeList: state => state.tables.tableType.tableTypeList,
        totalCountOfTableTypes: state => state.tables.tableType.totalCountOfTableTypes,
        pageIndex: state => state.tables.tableType.pageIndex,
        pageSize: state => state.tables.tableType.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchAllTableTypes',
        'updateTableStatus'
      ]),
      onClickAdd () {
        this.guidance
          ? this.showTableTypeModal(TABLE_TYPE_POPUP_REF)
          : this.$router.push('/myd/tables/type/add');
      },
      async onClickDelete () {
        await this.updateTableStatus({ mtableClsId: this.editId, status: DELETE });
        if (this.guidance) {
          const { pageIndex } = this;
          await this.fetchAllTableTypes({ pageSize: MAX_PAGE_SIZE, pageIndex });
        }
      },
      onClickEdit (row) {
        this.guidance
          ? this.showTableTypeModal(TABLE_TYPE_POPUP_REF, row.mtableClsId)
          : this.$router.push(`/myd/tables/type/edit/${row.mtableClsId}`);
      },
      onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        this.fetchAllTableTypes({ pageSize, pageIndex });
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchAllTableTypes({ pageSize, pageIndex });
      },
      onShowDeletePopup (row) {
        this.$refs.popup.isShow = true;
        this.editId = row.mtableClsId;
      },
      async onClickChangeStatus (row) {
        const status = +row.status === OK ? FORBIDDEN : OK;
        await this.updateTableStatus({ mtableClsId: row.mtableClsId, status });
      }
    },
    async created () {
      const { pageSize, pageIndex } = this;
      this.guidance
        ? await this.fetchAllTableTypes({ pageSize: MAX_PAGE_SIZE, pageIndex })
        : await this.fetchAllTableTypes({ pageSize, pageIndex });
    }
  };
</script>

<style lang="scss">
  .add-table-type-tips {
    position: relative;

    .table-type-error-tip {
      width: 8.5%;
      top: 6px;
      left: 104px;
    }
  }
</style>

