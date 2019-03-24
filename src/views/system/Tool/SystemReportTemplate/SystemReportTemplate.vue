<template>
  <div class="system-report-template-form-container">
    <el-form class="mw-form" ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="系统模板名称" prop="reportTempletName">
        <el-input v-model="form.reportTempletName" placeholder="请输入系统模板名称" :maxlength='30' :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="小票单据类型" prop="reportId">
        <el-select v-model="form.reportId" style="width: 100%" :disabled="isEdit">
          <el-option
            v-for="item in systemReportTypeList"
            :key="item.reportId"
            :label="item.reportName"
            :value="item.reportId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小票单据编码" prop="reportId">
        <el-input v-model="form.reportId" placeholder="请输入小票单据编码" disabled></el-input>
      </el-form-item>
      <el-form-item label="小票模板尺寸" prop="paperSize">
        <el-select v-model="form.paperSize" style="width: 100%" :disabled="isEdit">
          <el-option
            v-for="item in SYS_REPORT_TEMPLATE_SIZE"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统模板编号" prop="reportIndex">
        <el-input placeholder="请输入系统模板编号" v-model="form.reportIndex" :maxlength='5' :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="系统模板说明">
        <el-input type="textarea" placeholder="请输入系统模板说明，最多输入50字符" v-model="form.reportTempletDesc" :maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label="模板内容" class="html-content">
        <customize-template ref="customizeTemplate" :dataSource="form.rptFile" :reportId="form.reportId"/>
      </el-form-item>
      <el-form-item label="模板预览图片">
        <mw-upload
          style="margin-left: 20px"
          uploadTip="注意：图片最大为2M，仅支持jpg、png、jpeg图片格式"
          :dataSource = '(form.sysTempletUrl && form.sysTempletUrl.length) ? [{url: form.sysTempletUrl}] : []'
          :action="getActionUrl(`shop/${API_UPLOAD_SYS_REPORT_TEMPLATE}`)"
          acceptedFileSize="2048"
          @getImageURI='getImageURI'
          :autoUpload="true"
          ref="upload"
          :multipleUpload="false"
          :multipleSelect="false">
        </mw-upload>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { MwUpload } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { CustomizeTemplate } from '../../Components';
  import { API_UPLOAD_SYS_REPORT_TEMPLATE } from 'constant/API';
  import { validateReportName, validateReportId, validateId } from 'utils/validateUtil';
  import { SYS_REPORT_TEMPLATE_SIZE } from 'constant/constants';

  export default {
    name: 'SystemReportTemplate',
    components: {
      MwUpload,
      CustomizeTemplate
    },
    data () {
      return {
        form: {
          rptFile: [],
          reportId: '',
          paperSize: null,
          reportIndex: '',
          reportTempletId: '',
          reportTempletDesc: '',
          reportTempletName: '',
          sysTempletUrl: null
        },
        requestData: {},
        SYS_REPORT_TEMPLATE_SIZE,
        API_UPLOAD_SYS_REPORT_TEMPLATE,
        rules: {
          reportTempletName: [
            { validator: validateReportName, trigger: 'blur, change' },
            { required: true, message: '请输入系统模板名称，最多输入30字符', trigger: 'blur, change' }
          ],
          reportId: [
            { required: true, message: '这是必填字段', trigger: 'blur, change' }
          ],
          paperSize: [
            { type: 'number', required: true, message: '请选择小票模板尺寸', trigger: 'blur, change' }
          ],
          reportIndex: [
            { required: true, message: '请输入系统模板编号，最多输入5字符', trigger: 'blur, change' },
            { validator: validateId, trigger: 'blur, change' }
          ],
          reportTempletId: [
            { validator: validateReportId, trigger: 'blur, change' },
            { required: true, message: '请输入系统模板编号', trigger: 'blur, change' }
          ]
        },
        isEdit: !!this.$route.params.sysReportTempletId
      };
    },
    async created () {
      await this.fetchSystemReportTypeList();

      if (this.isEdit) {
        const { reportId, sysReportTempletId } = this.$route.params;
        await this.fetchSysReportTemplateItem({ reportId, sysReportTempletId });
        this.init();
      }
    },
    computed: mapState({
      systemReportTypeList: state => state.tool.systemReportTemplate.systemReportTypeList,
      systemReportTemplateItem: state => state.tool.systemReportTemplate.systemReportTemplateItem
    }),
    methods: {
      ...mapActions([
        'fetchSystemReportTypeList',
        'saveSysReportTemplateItem',
        'fetchSysReportTemplateItem',
        'updateSysReportTemplateItem'
      ]),
      init () {
        const { rptFile } = this.systemReportTemplateItem;
        this.form = {
          ...this.form,
          ...this.systemReportTemplateItem,
          rptFile: JSON.parse(rptFile) instanceof Array ? JSON.parse(rptFile) : []
        };
        const { reportTempletId } = this.form;
        this.form.reportIndex = reportTempletId.substring(reportTempletId.lastIndexOf('_') + 1);
      },
      async onSubmit () {
        if (!this.validateForm()) return;

        this.formatRequestData();
        const { requestData } = this;
        this.isEdit
          ? await this.updateSysReportTemplateItem({ requestData })
          : await this.saveSysReportTemplateItem({ requestData });

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.$router.push('/myd/tool/systemreporttemplate');
        }
      },
      validateForm () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });

        return validForm;
      },
      formatRequestData () {
        const { reportId, paperSize, reportIndex } = this.form;
        this.requestData = {
          ...this.form,
          reportTempletId: 'SYS_' + reportId + '_' + paperSize + '_' + reportIndex,
          rptFile: JSON.stringify(this.$refs.customizeTemplate.getReportTemplateContent())
        };
      },
      onCancel () {
        this.$router.push('/myd/tool/systemreporttemplate');
      },
      getImageURI (data) {
        this.form.sysTempletUrl = data ? data.data.sysTempletUrl : null;
      }
    }
  };
</script>
<style lang="scss">
  .system-report-template-form-container {
    margin-bottom: 20px;

    .mw-form {
      width: 50% !important;
    }

    .el-textarea {
      .el-textarea__inner {
        height: 80px;
        font-size: 14px;
        font-family: Arial;
      }
    }

    .btn-run-preview {
      height: 30px;
    }

    .el-upload__tip {
      font-size: 13px;
    }
  }
</style>
