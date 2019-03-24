<template>
  <div class="report-container">
    <el-form class="mw-form" ref="form" :model="form" :rules='rules' label-width="100px">
      <el-form-item label="模板编号" prop="reportTempletId">
        <el-input placeholder="请输入模板编号" v-model="form.reportTempletId" :maxlength='INPUT_MAX_LENGTH'></el-input>
      </el-form-item>
      <el-form-item label="模板名称" prop="reportTempletName">
        <el-input placeholder="请输入名称" v-model="form.reportTempletName" :maxlength='INPUT_MAX_LENGTH'></el-input>
      </el-form-item>
      <el-form-item label="模板说明">
        <el-input placeholder="请输入模板说明" v-model="form.reportTempletDesc" :maxlength='INPUT_MAX_LENGTH'></el-input>
      </el-form-item>
      <el-form-item label="模板尺寸" prop="paperSize">
        <el-input-number placeholder="请输入模板尺寸" v-model="form.paperSize" :min="1" :max="1000" style="width: 100%" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="模板内容" class="html-content">
        <el-input type="textarea" v-model="form.rptFile"></el-input>
      </el-form-item>
      <el-form-item label="模板试图">
        <el-button class="btn-run-preview" @click="onPreviewTemplate">运行-预览</el-button>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <popup
      size="small"
      title="预览模板"
      :handleOk="() => {}"
      ref="previewPopup">
      <div slot="content" v-html="form.rptFile"></div>
    </popup>
  </div>
</template>
<script>
  import { Popup } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { validateReportName, validateReportId } from 'utils/validateUtil';
  import { INPUT_MAX_LENGTH } from 'constant/constants';

  export default {
    name: 'ReportTemplate',
    components: { Popup },
    data () {
      return {
        INPUT_MAX_LENGTH,
        form: {
          reportTempletId: '',
          reportTempletName: '',
          reportTempletDesc: '',
          paperSize: 0,
          rptFile: '',
          htmlContect: ''
        },
        rules: {
          reportTempletId: [
            { validator: validateReportId, trigger: 'blur, change' },
            { required: true, message: '这是必填字段', trigger: 'blur, change' }
          ],
          reportTempletName: [
            { validator: validateReportName, trigger: 'blur, change' },
            { required: true, message: '这是必填字段', trigger: 'blur, change' }
          ]
        },
        isEdit: !!this.$route.params.reportTempletId
      };
    },
    computed: mapState({
      reportTemplateItem: state => state.setting.report.reportTemplateItem
    }),
    methods: {
      ...mapActions([
        'fetchReportTemplateItem',
        'updateReportTemplateItem',
        'saveReportTemplateItem'
      ]),
      init () {
        this.form = {
          ...this.form,
          ...this.reportTemplateItem
        };
      },
      onPreviewTemplate () {
        this.$refs.previewPopup.isShow = true;
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        const { reportId } = this.$route.params;
        let requestData = {
          ...this.form,
          reportId
        };
        this.isEdit
          ? await this.updateReportTemplateItem({ requestData })
          : await this.saveReportTemplateItem({ requestData });
        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.$router.back();
        }
      },
      onCancel () {
        this.$router.back();
      }
    },
    async created () {
      if (this.isEdit) {
        const { reportId, reportTempletId } = this.$route.params;
        await this.fetchReportTemplateItem({ reportId, reportTempletId });
        this.init();
      }
    }
  };
</script>
<style lang="scss">
  .report-container {
    .mw-form {
      width: 60% !important;
    }

    .el-textarea {
      .el-textarea__inner {
        height: 400px;
      }
    }

    .btn-run-preview {
      height: 30px;
    }
  }
</style>
