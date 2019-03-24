<template>
    <div class="system-report-template-container">
      <div class="toolBar">
        <el-button class="btn-add btn-bottom" icon="el-icon-plus" :disabled="isMaintain" @click="onAddClick">新增</el-button>
        <el-form :inline="true" @submit.prevent.native>
          <el-form-item label="小票单据名称:" class="search-input">
            <el-input v-model="searchText" placeholder="请输入小票单据名称" @keyup.enter.native="onSearchClick">
              <el-button slot="append" icon="el-icon-search" @click="onSearchClick"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-table border :data="systemReportTemplateList">
        <el-table-column prop="reportTempletId" align="center" label="系统模板编号" min-width="15%">
        </el-table-column>
        <el-table-column prop="reportTempletName" align="center" label="系统模板名称" min-width="15%">
        </el-table-column>
        <el-table-column prop="reportTempletDesc" align="center" label="系统模板说明" min-width="15%">
        </el-table-column>
        <el-table-column prop="reportId" align="center" label="小票单据编码" min-width="10%">
        </el-table-column>
        <el-table-column prop="reportName" align="center" label="小票单据名称" min-width="15%">
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态" min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.status == FORBIDDEN ? '禁用' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-button class="btn-edit" :disabled="isMaintain" @click="onEditClick(scope.row)" />
            <el-button
              size="small"
              :disabled="isMaintain"
              :class="scope.row.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
              @click="onUpdateStatusClick(scope.row)"
            />
            <el-button class="btn-preview" @click="onPreviewClick(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :totalCount="recordCount"
        :currentPage="pageIndex"
        :pageSize="pageSize"
        :onChangeSize="onPageSizeChange"
        :onChangeCurrent= "onChangeCurrent"
      />
      <popup
        type="submit"
        :title="sysTemplateName"
        :handleOk="onShowOrHidePreviewModal"
        ref="previewModal">
        <div slot="content" style="text-align: center">
          <img :src="systemTemplateUrl" width="350px"/>
        </div>
      </popup>
    </div>
</template>
<script>
  import { Pagination, Popup } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { FORBIDDEN, OK } from 'constant/statusCode';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'SystemReportTemplateMain',
    components: {
      Popup,
      Pagination
    },
    data () {
      return {
        OK,
        FORBIDDEN,
        searchText: '',
        reportName: '',
        systemTemplateUrl: '',
        sysTemplateName: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    async created () {
      const { pageIndex, pageSize, reportName } = this;
      await this.fetchSystemReportTemplateList({ pageIndex, pageSize, reportName });
    },
    computed: {
      ...mapState({
        pageSize: state => state.tool.systemReportTemplate.pageSize,
        pageIndex: state => state.tool.systemReportTemplate.pageIndex,
        recordCount: state => state.tool.systemReportTemplate.recordCount,
        systemReportTemplateList: state => state.tool.systemReportTemplate.systemReportTemplateList
      })
    },
    methods: {
      ...mapActions([
        'fetchSystemReportTemplateList',
        'updateSysReportTemplateStatus'
      ]),
      onSearchClick () {
        this.reportName = this.searchText;
        this.refreshTableFromServer(this.pageSize, this.pageIndex);
      },
      onAddClick () {
        this.$router.push('/myd/tool/systemreporttemplate/add');
      },
      onEditClick (row) {
        const { reportId, reportTempletId } = row;
        this.$router.push(`/myd/tool/systemreporttemplate/edit/${reportTempletId}/report/${reportId}`);
      },
      onPreviewClick (row) {
        this.systemTemplateUrl = row.sysTempletUrl;
        this.sysTemplateName = row.reportTempletName;
        this.onShowOrHidePreviewModal();
      },
      onShowOrHidePreviewModal () {
        this.$refs.previewModal.isShow = !this.$refs.previewModal.isShow;
      },
      async onUpdateStatusClick (row) {
        const { reportTempletId, reportId } = row;
        const status = parseInt(row.status) === OK ? FORBIDDEN : OK;
        await this.updateSysReportTemplateStatus({ reportId, status, sysReportTempletId: reportTempletId });
        await this.refreshTableFromServer(this.pageSize, this.pageIndex);
      },
      onPageSizeChange (pageSize) {
        this.refreshTableFromServer(pageSize, this.pageIndex);
      },
      onChangeCurrent (pageIndex) {
        this.refreshTableFromServer(this.pageSize, pageIndex);
      },
      async refreshTableFromServer (pageSize, pageIndex) {
        const { reportName } = this;
        await this.fetchSystemReportTemplateList({ pageSize, pageIndex, reportName });
      }
    }
  };

</script>
<style lang="scss">
  .system-report-template-container {
    padding: 20px;

    .toolBar {
      display: flex;
      justify-content: space-between;

      .search-input {
        .el-form-item__content {
          width: 300px;
        }
      }
    }
  }
</style>
