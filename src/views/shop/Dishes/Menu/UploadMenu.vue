<template>
  <div class="upload-menu">
    <div class="upload-title">批量上传菜品（包含套餐）</div>
    <div class="btn-wrapper">
      <el-button size="small" type="primary" class="btn-primary" @click="onClickUpload" :disabled="uploading">{{uploading ? '正在上传...' : '开始上传'}}</el-button>
      <el-button size="small" type="primary" class="btn-primary" @click="() => { this.$router.push('/myd/dishes/menu'); }">返回</el-button>
    </div>
    <div class="upload-msg-wrapper">
      <div class="header">导入信息</div>
      <div class="content" v-html="uploadMsg"></div>
      <div style="display: none" v-html="hiddenMsg"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// import { SUCCESS } from 'constant/statusCode';
export default {
  name: 'uploadMenu',
  data () {
    return {
      uploadMsg: '',
      hiddenMsg: '',
      interval: null,
      uploading: false
    };
  },
  computed: {
    ...mapState({
      uploadResult: state => state.dishes.menu.uploadResult,
      error: state => state.error
    })
  },
  methods: {
    ...mapActions([
      'uploadMenuToCloud',
      'getMenuUploadResult'
    ]),
    async onClickUpload () {
      this.uploading = true;
      this.uploadMsg = '';
      let message = '';
      await this.uploadMenuToCloud({ noShowError: true });
      const { errorStatus, errorMsg } = this.error;
      if (errorStatus) {
        this.$toast.show({ content: errorMsg, type: 'warning' });
        this.uploading = false;
        return;
      }

      let uploadResult;
      let keyArray = [];
      this.interval = setInterval(async () => {
        uploadResult = await this.getMenuUploadResult({ loading: true });
        for (let key in uploadResult) {
          if (key.endsWith('Msg')) {
            if (uploadResult[key] && !keyArray.includes(key)) {
              keyArray.push(key);
              message += uploadResult[key];
            }
          }
        }
        this.uploadMsg = message;
        if (uploadResult['menuClsMapMsg'] &&
          uploadResult['shopAreaMenuMsg'] &&
          uploadResult['msectionMsg'] &&
          uploadResult['mtableAreasMsg'] &&
          uploadResult['mtableMsg'] &&
          uploadResult['setmealMsg'] &&
          uploadResult['shopsellPlanMsg'] &&
          uploadResult['shopAreaMenuMsg']) {
          this.uploading = false;
          clearInterval(this.interval);
        }
      }, 2000);
    }
  }
};
</script>

<style lang="scss">
.upload-menu {
  width: 70%;
  margin: 20px auto;

  .upload-title {
    font-size: 16px;
    font-weight: 500;
  }

  .btn-wrapper {
    padding: 20px 0;
  }

  .upload-msg-wrapper {
    border: 1px solid #BCE8F1;
    border-radius: 5px;

    .header {
      color: #31708F;
      background-color: #D9EDF7;
      padding: 10px 15px;
    }

    .content {
      padding: 10px 15px;
    }
  }
}
</style>
