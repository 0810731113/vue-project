<template>
  <div class="module-padding">
    <div class="add-host-tips">
      <el-button size="small" ref="addPrinter" class="btn-add btn-bottom" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
      <show-error-tip
        ref="showErrorTip"
        class="host-error-tip"
        :showError="(!hostList || !hostList.length) && guidance && tipVisibility"
        errorText="请添加站点" />
    </div>
    <el-table :data="hostList" border>
      <el-table-column prop="hostId" class-name="table-auto" align="center" label="站点名称" min-width="15%" />
      <el-table-column prop="printerName" align="center" label="打印机名称" min-width="15%" />
      <el-table-column prop="hostDesc" align="center" label="说明" min-width="15%" />
      <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="12%" />
      <el-table-column prop="updateUserId" align="center" label="最后修改人" min-width="18%" />
      <el-table-column prop="updateUserName" align="center" label="最后修改时间" min-width="20%" />
      <el-table-column align="center" label="操作" min-width="15%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button v-if="scope.row.dataKind !== SYSTEM_KEY" class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowDeletePopup(scope.row)" />
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
  import { Popup, Pagination, MwButton, ShowErrorTip } from 'components';
  import { SYSTEM_KEY, HOST_POPUP_REF } from 'constant/constants';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default{
    name: 'HostMain',
    props: {
      guidance: {
        type: Boolean,
        default: false
      },
      showHostModal: {
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
        SYSTEM_KEY,
        HOST_POPUP_REF,
        hostId: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        hostList: state => state.setting.host.hostList,
        recordCount: state => state.setting.host.recordCount,
        pageIndex: state => state.setting.host.pageIndex,
        pageSize: state => state.setting.host.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchHostList',
        'deleteHostItem'
      ]),
      onClickAdd () {
        this.guidance ? this.showHostModal(HOST_POPUP_REF) : this.$router.push('/myd/setting/host/add');
      },
      onClickDelete () {
        const { hostId } = this;
        this.deleteHostItem({ hostId });
      },
      onClickEdit (row) {
        this.guidance ? this.showHostModal(HOST_POPUP_REF, row.hostId) : this.$router.push(`/myd/setting/host/edit/${row.hostId}`);
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchHostList({ pageSize, pageIndex });
      },
      onShowDeletePopup (row) {
        this.$refs.popup.isShow = true;
        this.hostId = row.hostId;
      }
    },
    async created () {
      const { pageSize, pageIndex } = this;
      this.guidance
      ? await this.fetchHostList()
      : await this.fetchHostList({ pageSize, pageIndex });
    }
  };
</script>

<style lang="scss">
  .add-host-tips {
    position: relative;

    .host-error-tip {
      width: 7%;
      top: 6px;
      left: 104px;
    }
  }
</style>
