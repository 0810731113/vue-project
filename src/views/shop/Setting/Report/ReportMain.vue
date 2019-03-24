<template>
  <div class="module-padding">
    <el-table :data="reportList" border>
      <el-table-column prop="reportId" align="center" label="小票单据编码"  min-width="20%">
      </el-table-column>
      <el-table-column prop="reportName" align="center" label="小票单据名称"  min-width="20%">
      </el-table-column>
      <el-table-column prop="reportTempletName" align="center" label="小票打印模板"  min-width="20%">
      </el-table-column>
      <el-table-column prop="note" align="center" label="其他说明"  min-width="20%">
      </el-table-column>
      <el-table-column align="center" label="操作"  min-width="20%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" @click="onClickEdit(scope.row)" />
          <mw-button
            :class="scope.row.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
            :content="scope.row.status == FORBIDDEN ? '启用' : '禁用'"
            @click="onClickChangeStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :totalCount ="totalCount"
      :currentPage ="pageIndex"
      :pageSize ="pageSize"
      :onChangeSize ="onPageSizeChange"
      :onChangeCurrent ="onChangeCurrent">
    </pagination>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, MwButton } from 'components/index';
  import { FORBIDDEN, OK } from 'constant/statusCode';

  export default {
    name: 'ReportMain',
    components: {
      Pagination,
      MwButton
    },
    data () {
      return {
        FORBIDDEN,
        OK
      };
    },
    computed: {
      ...mapState({
        reportList: state => state.setting.report.reportList,
        totalCount: state => state.setting.report.totalCount,
        pageIndex: state => state.setting.report.pageIndex,
        pageSize: state => state.setting.report.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchReportList',
        'setReportTemplateId',
        'updateReportStatus'
      ]),
      onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        this.fetchReportList({ pageSize, pageIndex });
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchReportList({ pageSize, pageIndex });
      },
      onClickEdit (row) {
        this.$router.push(`/myd/setting/report/edit/${row.reportId}/template/${row.reportTempletId}`);
      },
      async onClickChangeStatus (row) {
        let status;
        parseInt(row.status) === OK ? status = FORBIDDEN : status = OK;
        const { reportId } = row;
        await this.updateReportStatus({ reportId, status });
      }
    },
    async created () {
      const { pageSize, pageIndex } = this;
      await this.fetchReportList({ pageSize, pageIndex });
    }
  };
</script>
