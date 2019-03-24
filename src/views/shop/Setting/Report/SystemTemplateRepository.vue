<template>
  <div class="system-template-container">
    <el-table :data="systemTemplateList" border @current-change="onSelectedTemplate">
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
          <mw-button class="btn-preview" content="预览" @click="onPreviewClick(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button class="btn-submit" @click="onCheckAddOrEdit">保存</el-button>
    </el-row>
    <popup
      title="保存"
      tips="模板编号已存在，是否覆盖？"
      :handleOk="onSaveSystemTemplateClick"
      ref="editPopup">
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
  import { Popup, MwButton } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { ADD, EDIT, UPAIYUN_BASE_URL } from 'constant/constants';

  export default {
    name: 'SystemTemplateRepository',
    components: {
      Popup,
      MwButton
    },
    data () {
      return {
        ADD,
        EDIT,
        UPAIYUN_BASE_URL,
        selectedTemplateId: '',
        selectedTemplateUrl: '',
        selectedTemplateName: ''
      };
    },
    computed: mapState({
      systemTemplateList: state => state.setting.report.systemTemplateList,
      operation: state => state.setting.report.operation
    }),
    watch: {
      systemTemplateList () {
        if (this.systemTemplateList && this.systemTemplateList.length) {
          this.selectedTemplateId = this.systemTemplateList[0].reportTempletId;
        }
      }
    },
    methods: {
      ...mapActions([
        'fetchSystemTemplateList',
        'checkAddOrEditSystemTemplate',
        'saveSystemTemplateItem'
      ]),
      onSelectedTemplate (templateItem) {
        if (templateItem) {
          this.selectedTemplateId = templateItem.reportTempletId;
        }
      },
      async onCheckAddOrEdit () {
        const { reportId } = this.$route.params;
        await this.checkAddOrEditSystemTemplate({ reportId, sysReportTempletId: this.selectedTemplateId });
        const { opera } = this.operation;
        if (opera === EDIT) {
          this.$refs.editPopup.isShow = true;
        } else {
          await this.onSaveSystemTemplateClick();
        }
      },
      async onSaveSystemTemplateClick () {
        const { reportId } = this.$route.params;
        const sysReportTempletId = this.selectedTemplateId;
        await this.saveSystemTemplateItem({ reportId, sysReportTempletId });

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.$router.push(`/myd/setting/report/edit/${reportId}/template/${this.selectedTemplateId}`);
        }
      },
      onCancel () {
        this.$router.back();
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
      const { reportId } = this.$route.params;
      await this.fetchSystemTemplateList({ reportId });
    }
  };
</script>
<style lang="scss">
  .system-template-container {
    padding: 10px 15px 15px;
    margin-bottom: 20px;

    .radio {
      .el-radio__label {
        display: none;
      }
    }
  }
</style>
