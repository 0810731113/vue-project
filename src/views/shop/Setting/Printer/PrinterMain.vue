<template>
  <div class="module-padding">
    <div class="add-printer-tips">
      <el-button size="small" ref="addPrinter" class="btn-add btn-bottom" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">添加打印机</el-button>
      <show-error-tip
        ref="showErrorTip"
        class="printer-error-tip"
        :showError="(!printerList || !printerList.length) && guidance && tipVisibility"
        errorText="请添加打印机" />
    </div>
    <el-table :data="printerList" border>
      <el-table-column prop="printerName" class-name="table-auto" align="center" label="打印机名称" min-width="20%" />
      <el-table-column prop="ip" align="center" label="打印机IP" min-width="20%" >
        <template slot-scope="scope">
          {{scope.row.printerCls === 9 || scope.row.printerCls === 10 ? '' : scope.row.ip}}
        </template>
      </el-table-column>
      <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="20%" />
      <el-table-column align="center" label="操作" min-width="30%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowDeletePopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-if="!guidance"
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeCurrent="onChangeCurrent" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { PRINTER_POPUP_REF } from 'constant/constants';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { Popup, Pagination, MwButton, ShowErrorTip } from 'components';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

  export default{
    name: 'PrinterMain',
    props: {
      guidance: {
        type: Boolean,
        default: false
      },
      showPrinterModal: {
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
        DEFAULT_PAGE,
        DEFAULT_PAGES,
        PRINTER_POPUP_REF,
        id: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        printerList: state => state.setting.printer.printerList,
        recordCount: state => state.setting.printer.recordCount,
        pageIndex: state => state.setting.printer.pageIndex,
        pageSize: state => state.setting.printer.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchPrinterList',
        'deletePrinterItem',
        'setPrinterPageSize',
        'setPrinterPageIndex'
      ]),
      onClickAdd () {
        this.guidance
          ? this.showPrinterModal(PRINTER_POPUP_REF)
          : this.$router.push('/myd/setting/printer/add');
      },
      async onClickDelete () {
        const { id } = this;
        await this.deletePrinterItem({ id });
      },
      onClickEdit (row) {
        this.guidance
          ? this.showPrinterModal(PRINTER_POPUP_REF, row.id)
          : this.$router.push(`/myd/setting/printer/edit/${row.id}`);
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchPrinterList({ pageSize, pageIndex });
      },
      onShowDeletePopup (row) {
        this.$refs.popup.isShow = true;
        this.id = row.id;
      }
    },
    async created () {
      this.guidance
        ? await this.fetchPrinterList()
        : await this.fetchPrinterList({ pageSize: DEFAULT_PAGES, pageIndex: DEFAULT_PAGE });
    }
  };
</script>

<style lang="scss">
  .add-printer-tips {
    position: relative;

    .printer-error-tip {
      width: 7.8%;
      top: 6px;
      left: 104px;
    }
  }
</style>
