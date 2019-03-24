<template>
  <div class="mw-tab-panel">
    <div class="add-menu-tips">
      <span class="requied">*</span>
      添加菜品
      <span class="option-tips">(方法二选一即可)</span>
      <show-error-tip ref="showErrorTip" :showError="showError" errorText="请导入／手动添加菜品" />
    </div>
    <div class="method-one">
      <span class="method-tips">方法一&nbsp;&nbsp;&nbsp;&nbsp;通过模板导入: &nbsp;下载菜品模板文件，按说明添加菜品后选择文件上传并导入</span>
      <div class="down-wrap">
        <a class="down-link" :href="downLoadLink">下载菜品模版</a>
        <span class="down-tips">（内含添加菜品说明）</span>
      </div>
      <el-upload
        ref="upload"
        accept=".xlsx, .xls"
        :action="getActionUrl(`dishes/${API_UPLOAD_MENUS}`)"
        :show-file-list="false"
        :auto-upload="false"
        :on-success="onUploadSuccess"
        :on-change="onChangeFile"
      >
        <div class="upload-wrapper" slot="trigger">
          <el-button type="text" class="upload-name">{{ fileList.length ? fileList[0].name : '请选择要上传的文档' }}</el-button>
          <el-button type="primary" size="small" class="btn-select">选取文件</el-button>
        </div>
        <el-button size="small" class="btn-export" @click="submitUpload">导入</el-button>
      </el-upload>
      <div v-show="exportMsg" class="upload-fail-wrapper" v-html="exportMsg"></div>
    </div>
    <div class="method-two">
      <div class="method-two-tips">方法二&nbsp;&nbsp;&nbsp;&nbsp;手动添加菜品</div>
      <el-button type="primary" size="small" class="btn-add" icon="el-icon-plus" @click="onClickAdd">添加菜品</el-button>
      <menu-main :isMenu="true"></menu-main>
    </div>
    <div class="upload-pic-wrap">
      <div class="upload-title">
        上传菜品图片
        <div class="upload-tips">
          上传单张图片最大为350K（仅支持jpg、jpeg、bmp和png格式）<br/>
          图片必须以菜品编号为文件名，建议图片比例 4：3，大小为120K，分辨率大于320*240
        </div>
      </div>
      <mw-upload
        ref="picUpload"
        :action="getActionUrl(`dishes/${API_UPLOAD_PICTURES}`)"
        :multipleSelect="true"
        :multipleUpload="true"
        :autoUpload="true">
      </mw-upload>
    </div>
    <el-dialog custom-class="base-modal dish-menu-modal" :visible.sync="isShow" size="tiny">
      <div class="modal-title" slot="title">新增菜品</div>
      <menu-form v-if="isShow" :onSubmitForm="onSubmitForm"></menu-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { MenuMain } from '../../Dishes/Menu';
import MwUpload from 'components/Upload';
import MenuForm from './MenuForm';

import { API_UPLOAD_MENUS, API_UPLOAD_PICTURES } from 'constant/API';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import { GUIDANCE_MENU_TEMP_DOWNLOAD_LINK } from 'constant/constants';
import { SUCCESS } from 'constant/statusCode';
import { ShowErrorTip } from 'components';

export default {
  name: 'dishMenu',
  props: ['showError'],
  components: {
    MenuMain,
    MenuForm,
    MwUpload,
    ShowErrorTip
  },
  data () {
    return {
      API_UPLOAD_MENUS,
      API_UPLOAD_PICTURES,
      downLoadLink: window.location.origin + GUIDANCE_MENU_TEMP_DOWNLOAD_LINK,
      fileList: [],
      exportMsg: '',
      isShow: false
    };
  },
  computed: mapState({
    helpCode: state => state.dishes.menu.helpCode,
    pageIndex: state => state.dishes.menu.pageIndex,
    pageSize: state => state.dishes.menu.pageSize,
    errorStatus: state => state.error.errorStatus,
    errorMsg: state => state.error.errorMsg
  }),
  methods: {
    ...mapActions([
      'fetchAllMenu',
      'saveMenuItem',
      'getMenuHelpCode',
      'fetchAllClassify',
      'fetchClassifyByPage'
    ]),
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
        return;
      }

      await this.fetchAllMenu({ pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES });
      await this.fetchClassifyByPage({ pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES });
    },
    async onSubmitForm (params) {
      const { pageIndex, pageSize } = this;
      const { itemName, orderUint, menuClsId, salePrice, menuItemUintDtos } = params;
      let uintDto = menuItemUintDtos[0];
      uintDto = { ...uintDto, orderUint, salePrice, vipprice: salePrice };
      menuItemUintDtos[0] = uintDto;
      await this.getMenuHelpCode({ fsItemName: itemName });
      params = { ...params, menuClsId: menuClsId.pop(), helpCode: this.helpCode, menuItemUintDtos };
      await this.saveMenuItem({ info: params, noShowError: true });
      if (!this.errorStatus) {
        this.isShow = false;
        await this.fetchAllMenu({ pageIndex, pageSize });
        await this.fetchClassifyByPage({ pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES });
        return;
      }
    },
    async onClickAdd () {
      this.isShow = true;
      await this.fetchAllClassify();
    }
  }
};
</script>

<style lang="scss">
.mw-tab-panel {
  .dish-menu {
    padding: 0;
  }

  .el-upload {
    width: 65%;
  }

  .upload-wrapper {
    width: 100%;
    display: inline-block;

    .upload-name {
      width: calc(100% - 120px);
    }
  }

  .btn-select,
  .btn-export {
    height: 26px;
    width: 101px;
    line-height: 26px;
    padding: 0;
  }

  .upload-name {
    width: 480px;
    height: 26px;
    text-align: left;
    font-size: 14px;
    line-height: 26px;
    color: #B3C1CE;
    padding: 0 10px;
    border-radius: 3px;
    background: #F5F8F9;
    border: 1px solid #C2CDD3;
  }

  .btn-export {
    color: #FFF;
    background-color: #F36B5F;
    border-color: #F36B5F;
  }

  .requied {
    color: #f36b5f;
    height: 20px;
    line-height: 20px;
    vertical-align: sub;
    padding-right: 5px;
  }

  .add-menu-tips {
    width: 350px;
    font-size: 14px;
    position: relative;

    .option-tips {
      color: #888;
      padding-left: 15px;
    }
  }

  .method-one {
    font-size: 14px;
    padding: 10px 0;

    .method-tips {
      font-weight: 700;
      padding-top: 15px;
    }

    .down-wrap {
      padding: 23px 0 18px;
      color: #9c9c9c;
    }

    .down-link {
      color: #484848;
      font-size: 14px;
      padding: 3px 8px;
      border: 1px solid #D6DEE2;
      border-radius: 3px;
      text-decoration: none;
    }

    .upload-file {
      padding: 6px 12px;
      border: 1px solid #ddd;
    }
  }

  .method-one,
  .method-two {
    padding-left: 15px;
  }

  .method-two-tips {
    font-size: 14px;
    font-weight: 700;
    color: #373737;
    padding: 30px 0 20px;
  }

  .upload-fail-wrapper {
    width: 74%;
    color: #B3C1CE;
    margin-top: 11px;
    border-radius: 3px;
    padding: 8px 10px;
    background: #F5F8F9;
    border: 0 solid #C2CDD3;
    max-height: 100px;
    overflow: auto;
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
      .upload-multiple {
        margin-top: 0;
      }
    }
  }

  .cls-wrap {
    .cell {
      display: initial;
    }
  }

  .dish-menu-modal {
    width: 40%;

    .el-dialog__body {
      .mw-form {
        width: 90%;
      }
    }
  }
}
</style>
