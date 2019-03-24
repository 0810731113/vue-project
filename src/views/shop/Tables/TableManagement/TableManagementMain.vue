<template>
  <div class="module-padding">
    <div class="add-table-management-tips">
      <el-button size="small" ref="addTable" :disabled="isMaintain" @click="onClickAdd" class="btn-add btn-bottom" icon="el-icon-plus">新增</el-button>
      <el-button size="small" ref="addTable" :disabled="isMaintain" class="btn-add btn-bottom" icon="el-icon-plus" @click="onClickAddBatch">批量增加</el-button>
      <show-error-tip
        ref="showErrorTip"
        class="table-management-error-tip"
        :showError="(!tableManagerPageList || !tableManagerPageList.length) && guidance && tipVisibility"
        errorText="请添加餐桌管理" />
    </div>
    <el-button class="btn-primary" :disabled="isMaintain" @click="onClickEditBatch" v-if="!guidance">批量设置</el-button>
    <el-button class="btn-primary" :disabled="isMaintain" @click="onClickDeleteBatch" v-if="!guidance">批量删除</el-button>
    <el-button class="btn-primary" :disabled="isMaintain" @click="onClickSort" v-if="!guidance">顺序调整</el-button>
    <label class="label" v-if="!guidance">餐桌区域</label>
    <el-select v-model="selectedTableArea" @change="onSelectedItemChange" v-if="!guidance" style="width: 150px">
      <el-option
        v-for="item in tableAreaFilter"
        :key="item.mareaId"
        :label="item.mareaName"
        :value="item.mareaId"
        style="width: 100%" />
    </el-select>
    <label class="label" v-if="!guidance">餐桌类型</label>
    <el-select v-model="selectedTableType" @change="onSelectedItemChange" v-if="!guidance" style="width: 150px">
      <el-option
        v-for="item in tableTypeFilter"
        :key="item.mtableClsId"
        :label="item.mtableClsName"
        :value="item.mtableClsId"
        style="width: 100%" />
    </el-select>
    <el-table
      ref="managementTable"
      :data="tableManagerPageList"
      border
      @selection-change="handleSelectionChange"
      empty-text="您尚未添加餐桌">
      <el-table-column align="center" type="selection" v-if="!guidance" />
      <el-table-column prop="mtableId" align="center" label="餐桌代码"  min-width="15%" />
      <el-table-column prop="mtableName" class-name="table-auto" align="center" label="餐桌名称"  min-width="20%" />
      <el-table-column prop="mareaName" align="center" label="餐桌区域" class-name="table-auto" min-width="20%" />
      <el-table-column prop="mtableSeats" align="center" label="座位数"  min-width="10%" />
      <el-table-column prop="mtableClsName" align="center" label="餐桌类型" class-name="table-auto" min-width="10%" />
      <el-table-column prop="mtableStatus" align="center" label="状态"  min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.mtableStatus == FORBIDDEN ? '禁用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  min-width="15%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" :disabled="isMaintain" content="编辑" @click="onClickEdit(scope.row)" />
          <mw-button
            :disabled="isMaintain"
            :class="+scope.row.mtableStatus == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
            @click="onClickChangeStatus(scope.row)"
            :content="+scope.row.mtableStatus == FORBIDDEN ? '启用' : '禁用'" />
          <mw-button class="btn-delete" :disabled="isMaintain" content="删除" @click="onShowDeletePopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      class="table-pagination"
      :totalCount="countOfManagementList"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent="onChangeCurrent" />
    <EditBatchModal :selectedNames="selectedNames" :selectedIds="selectedIds" ref="EditBatchModal" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="deletePopup" />
    <Toast
      ref='toast'
      :content="toastContent"
      :timeout="2000"
      type="warning" />
    <Sortable
      :sortList="sortDataSource"
      :handleOK="onUpdateManagementSortList"
      :headerKey="['序号', '餐桌']"
      :sortKey="['mtableId', 'mtableName']"
      ref="sortable">
        <el-select v-model="selectedAreaInSortTable" @change="onSelectedItemChangeInSortTable" slot="filter" class="inline-select">
          <el-option
            v-for="item in tableAreaFilterInSortTable"
            :key="item.mareaId"
            :label="item.mareaName"
            :value="item.mareaId"
            style="width: 100%" />
        </el-select>
    </Sortable>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup, Sortable, MwButton, Toast, ShowErrorTip } from 'components';
  import EditBatchModal from '../Components/EditBatchModal';
  import { FORBIDDEN, OK, DELETE, ALL } from 'constant/statusCode';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { TABLE_MANAGEMENT_POPUP_REF, ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF } from 'constant/constants';

  export default{
    name: 'TableManagement',
    props: {
      guidance: {
        type: Boolean,
        default: false
      },
      showTableManagementModal: {
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
      Popup,
      MwButton,
      EditBatchModal,
      Sortable,
      Toast
    },
    data () {
      return {
        FORBIDDEN,
        OK,
        DELETE,
        ALL,
        DEFAULT_PAGE,
        DEFAULT_PAGES,
        TABLE_MANAGEMENT_POPUP_REF,
        ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF,
        edit: '',
        selectedNames: [],
        selectedIds: [],
        tableTypeFilter: [],
        tableAreaFilter: [],
        selectedAreaInSortTable: null,
        tableAreaFilterInSortTable: null,
        sortDataSource: [],
        isMaintain: !checkMaintainRight(this),
        toastContent: ''
      };
    },
    computed: {
      ...mapState({
        tableManagerPageList: state => state.tables.management.tableManagerPageList,
        tableManagerPageSortList: state => state.tables.management.tableManagerPageSortList,
        countOfManagementList: state => state.tables.management.countOfManagementList,
        tableTypelist: state => state.tables.management.tableTypelist,
        tableAreaList: state => state.tables.management.tableAreaList,
        pageIndex: state => state.tables.management.pageIndex,
        pageSize: state => state.tables.management.pageSize
      }),
      selectedTableType: {
        get () {
          return this.$store.state.tables.management.selectedTableType;
        },
        set (value) {
          this.setManagementSelectedType(value);
        }
      },
      selectedTableArea: {
        get () {
          return this.$store.state.tables.management.selectedTableArea;
        },
        set (value) {
          this.setManagementSelectedArea(value);
        }
      }
    },
    watch: {
      tableManagerPageSortList () {
        this.sortDataSource = this.tableManagerPageSortList.slice();
      },
      tableTypelist () {
        this.tableTypeFilter = [];
        this.tableTypeFilter.push({ mtableClsId: ALL, mtableClsName: '所有类型' });
        this.tableTypelist.map(item => {
          this.tableTypeFilter.push(item);
        });
      },
      tableAreaList () {
        this.tableAreaFilter = [];
        this.tableAreaFilterInSortTable = [];
        this.tableAreaFilter.push({ mareaId: ALL, mareaName: '所有区域' });
        this.tableAreaList.map(item => {
          this.tableAreaFilter.push(item);
          this.tableAreaFilterInSortTable.push(item);
        });

        if (this.tableAreaFilterInSortTable.length) {
          this.selectedAreaInSortTable = this.tableAreaFilterInSortTable[0].mareaId;
        }
      }
    },
    methods: {
      ...mapActions([
        'fetchTableManagementList',
        'fetchTableManagementSortList',
        'updateManagementSortList',
        'updateTableManagementStatus',
        'deleteBatchTableManagement',
        'getTableArealist',
        'getTableTypelist',
        'initTableFilter',
        'setManagementSelectedType',
        'setManagementSelectedArea'
      ]),
      async onSelectedItemChange () {
        let { selectedTableArea, selectedTableType } = this;
        if (selectedTableArea === ALL) { selectedTableArea = null; }
        if (selectedTableType === ALL) { selectedTableType = null; }
        await this.fetchTableManagementList({
          pageSize: DEFAULT_PAGES,
          pageIndex: DEFAULT_PAGE,
          mareaId: selectedTableArea,
          mtableClsId: selectedTableType });
      },
      async onSelectedItemChangeInSortTable () {
        await this.fetchTableManagementSortList({ mareaId: this.selectedAreaInSortTable });
      },
      async onUpdateManagementSortList (value) {
        let updSortOrderList = [];
        value.map((item, index) => {
          updSortOrderList.push({ mtableId: item.mtableId, mareaId: this.selectedAreaInSortTable, sortOrder: index });
        });
        await this.updateManagementSortList({ updSortOrderList });
      },
      onPageSizeChange (pageSize) {
        let { pageIndex, selectedTableArea, selectedTableType } = this;
        if (selectedTableArea === ALL) { selectedTableArea = null; }
        if (selectedTableType === ALL) { selectedTableType = null; }
        this.fetchTableManagementList({
          pageSize, pageIndex,
          mareaId: selectedTableArea,
          mtableClsId: selectedTableType
        });
      },
      onChangeCurrent (pageIndex) {
        let { pageSize, selectedTableArea, selectedTableType } = this;
        if (selectedTableArea === ALL) { selectedTableArea = null; }
        if (selectedTableType === ALL) { selectedTableType = null; }
        this.fetchTableManagementList({
          pageSize, pageIndex,
          mareaId: selectedTableArea,
          mtableClsId: selectedTableType
        });
      },
      onClickAdd () {
        this.guidance
          ? this.showTableManagementModal(TABLE_MANAGEMENT_POPUP_REF)
          : this.$router.push('/myd/tables/management/add');
      },
      onClickAddBatch () {
        this.guidance
          ? this.showTableManagementModal(ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF)
          : this.$router.push('/myd/tables/management/addbatch');
      },
      onClickEditBatch () {
        this.toastContent = '请选择要设置的餐桌';
        this.selectedNames.length
          ? this.onShowModal('EditBatchModal')
          : this.onShowModal('toast');
      },
      onClickDeleteBatch () {
        this.toastContent = '请选择要删除的餐桌';
        this.selectedNames.length
          ? this.onShowModal('deletePopup')
          : this.onShowModal('toast');
      },
      async onClickDelete () {
        this.selectedNames.length
          ? await this.deleteBatchTableManagement({ updStatusList: this.selectedIds })
          : await this.updateTableManagementStatus({ mtableId: this.editId, mtableStatus: DELETE });
      },
      onClickEdit (row) {
        this.guidance
          ? this.showTableManagementModal(TABLE_MANAGEMENT_POPUP_REF, row.mtableId)
          : this.$router.push(`/myd/tables/management/edit/${row.mtableId}`);
      },
      async onClickChangeStatus (row) {
        const { mtableId, mtableStatus } = row;
        const status = +mtableStatus === OK ? FORBIDDEN : OK;
        await this.updateTableManagementStatus({ mtableId, mtableStatus: status });
      },
      async onClickSort () {
        await this.fetchTableManagementSortList({ mareaId: this.selectedAreaInSortTable });
        this.onShowModal('sortable');
      },
      handleSelectionChange (rows) {
        this.selectedNames = rows.map(item => item.mtableName);
        this.selectedIds = rows.map(item => {
          return { mtableId: item.mtableId };
        });
      },
      onShowDeletePopup (row) {
        this.$refs.deletePopup.isShow = true;
        this.editId = row.mtableId;
      },
      onShowModal (type) {
        this.$refs[type].isShow = true;
      }
    },
    async created () {
      const { pageIndex, pageSize } = this;
      this.initTableFilter();
      await this.fetchTableManagementList({ pageSize, pageIndex, mareaId: null, mtableClsId: null });
      await this.getTableTypelist();
      await this.getTableArealist();
    }
  };
</script>

<style lang="scss">
  .label {
    margin-left: 10px;
  }

  .inline-select {
    width: 30%;
  }

  .add-table-management-tips {
    position: relative;
    display: inline-block;
    margin-right: 10px;

    .table-management-error-tip {
      width: 100px;
      top: 6px;
      left: 230px;
    }
  }
</style>
