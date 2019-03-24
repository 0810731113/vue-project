<template>
  <div class="module-padding">
    <div class="add-dining-area-tips">
      <el-button size="small" ref="addTable" class="btn-add btn-bottom" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
      <show-error-tip
        ref="showErrorTip"
        class="dining-area-error-tip"
        :showError="!diningAreaList.length && guidance && tipVisibility"
        errorText="请添加餐桌区域" />
    </div>
    <el-button class="btn-primary" @click="onShowSortTablePopup" :disabled="isMaintain" v-if="!guidance">顺序调整</el-button>
    <el-table :data="diningAreaList" border class="type-table" empty-text="您尚未添加餐桌区域">
      <el-table-column prop="mareaName" class-name="table-auto" align="center" label="餐区名称" />
      <el-table-column prop="mareaCount" align="center" label="餐桌数量" />
      <el-table-column prop="mareaStatus" align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.mareaStatus == FORBIDDEN ? '禁用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button
            :disabled="isMaintain"
            :class="+scope.row.mareaStatus == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
            @click="onClickChangeStatus(scope.row)"
            :content="+scope.row.mareaStatus == FORBIDDEN ? '启用' : '禁用'"  />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowDeletePopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="!guidance"
      :totalCount="totalCountOfDiningAreas"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent="onChangeCurrent">
    </pagination>
    <Sortable
      :handleOK="onUpdateDiningAreaSortList"
      :sortList="sortDataSource"
      :headerKey="['序号', '餐桌区域']"
      :sortKey="['mareaId', 'mareaName']"
      ref="sortable" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
  import { FORBIDDEN, OK, DELETE } from 'constant/statusCode';
  import { Pagination, Popup, Sortable, MwButton, ShowErrorTip } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { DINING_AREA_POPUP_REF, MAX_PAGE_SIZE } from 'constant/constants';
  import { mapActions, mapState } from 'vuex';

  export default{
    name: 'DiningAreaMain',
    props: {
      guidance: {
        type: Boolean,
        default: false
      },
      showDiningAreaModal: {
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
      Popup,
      Sortable
    },
    data () {
      return {
        FORBIDDEN,
        OK,
        edit: '',
        isMaintain: !checkMaintainRight(this),
        MAX_PAGE_SIZE,
        sortDataSource: [],
        DINING_AREA_POPUP_REF
      };
    },
    computed: {
      ...mapState({
        diningAreaList: state => state.tables.diningArea.diningAreaList,
        diningAreaSortList: state => state.tables.diningArea.diningAreaSortList,
        totalCountOfDiningAreas: state => state.tables.diningArea.totalCountOfDiningAreas,
        pageSize: state => state.tables.diningArea.pageSize,
        pageIndex: state => state.tables.diningArea.pageIndex
      })
    },
    watch: {
      diningAreaSortList () {
        this.sortDataSource = this.diningAreaSortList.slice();
      }
    },
    methods: {
      ...mapActions([
        'fetchAllDiningArea',
        'updateDiningAreaStatus',
        'fetchDiningAreaSortList',
        'updateDiningAreaSortList'
      ]),
      onClickAdd () {
        this.guidance
          ? this.showDiningAreaModal(DINING_AREA_POPUP_REF)
          : this.$router.push('/myd/tables/area/add');
      },
      async onClickDelete () {
        await this.updateDiningAreaStatus({ mareaId: this.editId, mareaStatus: DELETE });
        if (this.guidance) {
          const { pageIndex } = this;
          await this.fetchAllDiningArea({ pageSize: MAX_PAGE_SIZE, pageIndex });
        }
      },
      onClickEdit (row) {
        this.guidance
          ? this.showDiningAreaModal(DINING_AREA_POPUP_REF, row.mareaId)
          : this.$router.push(`/myd/tables/area/edit/${row.mareaId}`);
      },
      onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        this.fetchAllDiningArea({ pageSize, pageIndex });
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchAllDiningArea({ pageSize, pageIndex });
      },
      onShowDeletePopup (row) {
        this.$refs.popup.isShow = true;
        this.editId = row.mareaId;
      },
      async onClickChangeStatus (row) {
        const status = +row.mareaStatus === OK ? FORBIDDEN : OK;
        await this.updateDiningAreaStatus({ mareaId: row.mareaId, mareaStatus: status });
      },
      async onShowSortTablePopup () {
        await this.fetchDiningAreaSortList();
        this.$refs.sortable.isShow = true;
      },
      async onUpdateDiningAreaSortList (value) {
        let sortList = [];
        value.map((item, index) => {
          sortList.push({ mareaId: item.mareaId, sortOrder: index });
        });
        await this.updateDiningAreaSortList({ sortList });
      }
    },
    async created () {
      const { pageSize, pageIndex, guidance } = this;
      await this.fetchAllDiningArea({ pageSize: guidance ? MAX_PAGE_SIZE : pageSize, pageIndex });
    }
  };
</script>

<style lang="scss">
  .add-dining-area-tips {
    position: relative;
    display: inline-block;
    margin-right: 10px;

    .dining-area-error-tip {
      width: 100px;
      top: 6px;
      left: 104px;
    }
  }
</style>
