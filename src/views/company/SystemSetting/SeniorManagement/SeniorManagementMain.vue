<template>
    <div class="senior-container">
      <el-upload
        style="display: inline-block"
        accept=".xlsx, .xls"
        :action="getActionUrl(`shop/${API_SENIOR_MANAGEMENT_FILE_UPLOAD}`)"
        :show-file-list="false"
        :on-success="handleSuccess"
        :on-error="handleError"
        :multiple = "false">
        <el-button size="small" class="btn-add btn-bottom">高层名单导入</el-button>
      </el-upload>
      <a class="link mw-link" :href="downLoadLink">高层名单模板下载</a>
      <SeniorManagement :isManageShop ="true"></SeniorManagement>
      <popup
        type="success"
        :title="modalTitle"
        ref="popup">
        <div v-html="errorMsg" slot="content" class="error-message"></div>
      </popup>
    </div>
</template>
<script>
  import { mapActions } from 'vuex';
  import { Popup, Toast } from 'components';
  import { SUCCESS } from 'constant/statusCode';
  import { SeniorManagement } from 'views/common';
  import { API_SENIOR_MANAGEMENT_FILE_UPLOAD } from 'constant/API';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { SENIOR_MANAGEMENT_TEMP_DOWNLOAD_LINK, FAIL_TO_IMPORT_SENIOR_MANAGEMENT } from 'constant/constants';

  export default {
    name: 'SeniorManagementMain',
    components: {
      SeniorManagement,
      Popup,
      Toast
    },
    data () {
      return {
        modalTitle: '',
        errorMsg: '',
        DEFAULT_PAGE,
        DEFAULT_PAGES,
        SUCCESS,
        FAIL_TO_IMPORT_SENIOR_MANAGEMENT,
        API_SENIOR_MANAGEMENT_FILE_UPLOAD,
        downLoadLink: window.location.origin + SENIOR_MANAGEMENT_TEMP_DOWNLOAD_LINK
      };
    },
    methods: {
      ...mapActions([
        'getManagersFingerList'
      ]),
      async handleSuccess (response) {
        const { errNo } = response.data.err;
        if (errNo === SUCCESS) {
          this.modalTitle = '导入成功';
          this.errorMsg = response.data.data;
          this.$refs.popup.isShow = true;
          await this.getManagersFingerList({ superUserType: '0', pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES });
        } else {
          this.handleError();
        }
      },
      async handleError () {
        this.modalTitle = '导入失败';
        this.errorMsg = FAIL_TO_IMPORT_SENIOR_MANAGEMENT;
        this.$refs.popup.isShow = true;
      }
    }
  };
</script>
<style lang="scss">
  .senior-container {
    padding: 10px 15px 15px;
    margin-bottom: 20px;

    .error-message {
      text-align: center;
      max-height: 200px;
      min-height: 40px;
      overflow: auto;
    }

    .link {
      float: right;
      line-height: 40px;
      margin-right: 40px;
      font-size: 16px;
    }
  }
</style>
