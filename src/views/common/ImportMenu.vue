<template>
  <div class="import-menu">
    <div class="import-wrapper">
      <span class="import-tips">请选择Excel文件</span>
      <el-upload
        ref="upload"
        :action="getActionUrl(`dishes/${API_UPLOAD_MENUS}`)"
        :show-file-list="false"
        :auto-upload="false"
        :on-success="onUploadSuccess"
        :on-change="onChangeFile"
        class="upload">
        <div class="upload-wrapper" slot="trigger">
          <el-button type="primary" size="small" class="btn-select">选取文件</el-button>
          <el-button type="text" class="upload-name">{{ fileList.length ? fileList[0].name : '请选择要上传的文档' }}</el-button>
        </div>
      </el-upload>
    </div>
    <div class="btn-wrapper">
      <el-button size="small" class="btn-base" @click="submitUpload">导入</el-button>
      <el-button size="small" class="btn-base" @click="() => { this.$router.push('/myd/dishes/menu'); } ">返回</el-button>
      <a class="down-link" :href="downLoadLink">下载菜品模版</a>
    </div>
    <div v-show="exportMsg" class="upload-title">菜品导入日志：</div>
    <div v-show="exportMsg" class="upload-fail-wrapper" v-html="exportMsg"></div>
    <div v-show="!exportMsg" class="upload-title">
      <div>菜品导入说明：</div>
      1、在第一张“菜品”表中输入菜品的信息，请不要更改工作区顺序，默认模板数据为第一个工作区。<br/>
      2、第一行为说明行，不可修改，第二行开始为数据行，数据行应连续，中间不得出现空行。<br/>
      3、分类名称中输入商品所属的分类，不能为空，如果输入的这个分类原来没有，那么会新建一个分类(其销售归属以及收入分类会默认"未分类")，如果原来已经有了，那么是在原来基础上增加菜品。<br/>
      4、商品名称最好是8个汉字以内，最长不超过18个汉字或36个英文字符。<br/>
      5、是否打折等字段填入值为"0"或者"1"，"1"代表是，"0"代表否。<br/>
      6、导入以菜品编号为基准，相同编号的菜品，会覆盖现在已有的菜品、套餐、菜品配料。<br/>
      7、建议导入前清空此门店菜品数据，否则可能会造成菜品名称、菜品顺序混乱
    </div>
    <div class="upload-pic-wrap">
      <div class="upload-title">
        上传菜品图片
        <div class="upload-tips">
          上传单张图片最大为350K（仅支持jpg、jpeg、bmp和png格式）<br/>
          图片必须以菜品编号为文件名，建议图片比例1280*800 且纵横比16:10
        </div>
      </div>
      <mw-upload
        ref="picUpload"
        :action="getActionUrl(`dishes/${API_UPLOAD_PICTURES}`)"
        :multipleSelect="true"
        :multipleUpload="true"
        :autoUpload="true"
      />
    </div>
  </div>
</template>

<script>
import MwUpload from 'components/Upload';
import { SUCCESS } from 'constant/statusCode';
import { MENU_TEMP_DOWNLOAD_LINK } from 'constant/constants';
import { API_UPLOAD_MENUS, API_UPLOAD_PICTURES } from 'constant/API';

export default {
  name: 'importMenu',
  components: {
    MwUpload
  },
  data () {
    return {
      API_UPLOAD_MENUS,
      API_UPLOAD_PICTURES,
      fileList: [],
      exportMsg: '',
      downLoadLink: window.location.origin + MENU_TEMP_DOWNLOAD_LINK
    };
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit();
    },
    onChangeFile (file) {
      this.$refs.upload.uploadFiles = [file];
      this.fileList = [file];
    },
    async onUploadSuccess (response, file, fileList) {
      const { data, result, err } = response.data;
      this.exportMsg = data || result;

      if (err && err.errNo !== SUCCESS) {
        const { errMsg, errException } = err;
        this.exportMsg = `${errMsg}: ${errException}`;
      }
    }
  }
};
</script>

<style lang="scss">
.import-menu {
  padding: 15px;

  .import-wrapper {
    width: 100%;
    display: inline-block;
    text-align: center;

    .import-tips {
      font-size: 16px;
      font-weight: 700px;
    }

    .upload {
      width: 60%;
      height: 34px;
      display: inline-block;
      text-align: left;
      border: 1px solid #ddd;

      .btn-select {
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        margin: 0 10px;
      }
    }
  }

  .btn-wrapper {
    text-align: center;
    padding-top: 15px;

    .down-link {
      text-decoration: none;
    }
  }

  .upload-title,
  .upload-fail-wrapper {
    width: 70%;
    margin: 0 auto;
    padding: 5px;
    border: 1px solid #DDD;
    border-radius: 5px;
  }

  .upload-title {
    border: none;
    font-weight: 500;
  }

  .upload-pic-wrap {
    .upload-title {
      font-size: 14px;
      padding-top: 20px;
      font-weight: 700;
      color: #373737;

      .upload-tips {
        color: #666;
        font-weight: normal;
        padding: 10px 0 20px;
      }
    }

    .upload-container {
      width: 70%;
      margin: 0 auto;

      .upload-multiple {
        margin-top: 0;
      }
    }
  }
}
</style>
