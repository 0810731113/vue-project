<template>
  <div class="report-template-main-container">
    <el-button class="btn-add btn-bottom" icon="el-icon-plus" @click="onClickAdd">新增</el-button>
    <el-button class="btn-base btn-bottom" icon="el-icon-plus" @click="onAddSystemTemplateClick">从模板库选择</el-button>
    <el-table :data="reportTemplateList" border @current-change="onSelectedTemplate">
      <el-table-column min-width="5%">
        <template slot-scope="scope">
          <el-radio class="radio" v-model="selectedTemplateId" :label="scope.row.reportTempletId"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="reportTempletName" align="center" label="模板名称"  min-width="20%">
      </el-table-column>
      <el-table-column prop="reportTempletDesc" align="center" label="说明"  min-width="20%">
      </el-table-column>
      <el-table-column prop="paperSize" align="center" label="尺寸"  min-width="20%">
      </el-table-column>
      <el-table-column align="center" label="操作"  min-width="20%">
        <template slot-scope="scope">
          <mw-button v-if="scope.row.isFromSystem !== SYSTEM_KEY" class="btn-edit" content="编辑" @click="onClickEdit($event, scope.row)" />
          <mw-button class="btn-preview" content="预览" v-else @click="onPreviewClick(scope.row)" />
          <mw-button class="btn-delete" content="删除" @click="onShowDeletePopup" />
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button class="btn-submit" @click="onSubmit">保存</el-button>
    </el-row>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup">
    </popup>
    <popup
      type="submit"
      :title="selectedTemplateName"
      :handleOk="onShowOrHidePreviewModal"
      ref="previewModal">
      <div slot="content" style="text-align: center">
        <img :src="selectedTemplateUrl" width="350px"/>
      </div>
    </popup>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { SYSTEM_KEY, UPAIYUN_BASE_URL } from 'constant/constants';
  import { Popup, MwButton } from 'components';

  export default {
    name: 'ReportTemplateMain',
    components: {
      Popup,
      MwButton
    },
    data () {
      return {
        SYSTEM_KEY,
        UPAIYUN_BASE_URL,
        selectedTemplateId: this.$route.params.reportTempletId,
        selectedTemplateName: '',
        selectedTemplateUrl: ''
      };
    },
    computed: mapState({
      reportTemplateList: state => state.setting.report.reportTemplateList
    }),
    methods: {
      ...mapActions([
        'fetchReportTemplateList',
        'updateReportTemplate',
        'deleteReportTemplateItem'
      ]),
      onSelectedTemplate (templateItem) {
        if (templateItem) {
          this.selectedTemplateId = templateItem.reportTempletId;
        }
      },
      async onSubmit () {
        const { reportId } = this.$route.params;
        const reportTempletId = this.selectedTemplateId;
        if (!this.reportTemplateList.length) {
          this.$router.push(`/myd/setting/report`);
        }
        await this.updateReportTemplate({ reportId, reportTempletId });

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.$router.push(`/myd/setting/report`);
        }
      },
      onCancel () {
        this.$router.push(`/myd/setting/report`);
      },
      onClickAdd () {
        const { reportId } = this.$route.params;
        this.$router.push(`/myd/setting/report/edit/${reportId}/template/add`);
      },
      onAddSystemTemplateClick () {
        const { reportId } = this.$route.params;
        this.$router.push(`/myd/setting/report/edit/${reportId}/template/systemtemplate`);
      },
      onClickEdit (event, row) {
        this.$router.push(`/myd/setting/report/edit/${row.reportId}/template/edit/${row.reportTempletId}`);
        event.stopPropagation();
      },
      async onClickDelete () {
        await this.deleteReportTemplateItem({
          reportTempletId: this.selectedTemplateId,
          isSelected: this.selectedTemplateId === this.$route.params.reportTempletId,
          reportId: this.$route.params.reportId
        });

        if (this.reportTemplateList.length) {
          this.selectedTemplateId = this.reportTemplateList[0].reportTempletId;
        }
      },
      onShowDeletePopup () {
        this.$refs.popup.isShow = true;
      },
      onPreviewClick (row) {
        this.selectedTemplateName = row.reportTempletName;
        this.selectedTemplateUrl = row.sysTempletUrl;
        this.onShowOrHidePreviewModal();
      },
      onShowOrHidePreviewModal () {
        this.$refs.previewModal.isShow = !this.$refs.previewModal.isShow;
      }
    },
    async created () {
      const { reportTempletId, reportId } = this.$route.params;
      await this.fetchReportTemplateList({ reportTempletId, reportId });
    }
  };
</script>
<style lang="scss">
  .report-template-main-container {
    padding: 10px 15px 15px;
    margin-bottom: 20px;

    .radio {
      .el-radio__label {
        display: none;
      }
    }

    .btn-top {
      margin-top: 10px;
    }
  }
</style>
