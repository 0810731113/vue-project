<template>
  <div class="erp-system-integration">
    <el-form :inline="true" class="search-form">
      <el-form-item label="上传时间">
        <el-date-picker
          v-model="sellDateSearch"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上传模式">
        <el-select v-model="autoUploadSearch">
          <el-option
            v-for="item in AUTO_UPLOAD_ENUM"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-search" @click="onSearchClick">搜索</el-button>
        <el-button class="btn-reset" @click="onResetClick">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="division-line"></div>
    <el-button :disabled="isMaintain" class="btn-base" @click="onBatchChangeClick">批量设置</el-button>
    <el-button :disabled="isMaintain" class="btn-base" @click="onBatchUploadClick">批量上传</el-button>
    <el-table :data="erpSystemIntegrationList" border @selection-change="onSelectionChange" class="erp-system-table">
      <el-table-column type="selection" min-width="10%" />
      <el-table-column prop="shopGUID" align="center" label="GUID" min-width="10%" />
      <el-table-column prop="shopName" align="center" label="门店名称" min-width="10%" />
      <el-table-column prop="provinceName" align="center" :formatter="formatEmptyText" label="省" min-width="5%" />
      <el-table-column prop="cityName" align="center" :formatter="formatEmptyText" label="市" min-width="5%" />
      <el-table-column prop="districtName" align="center" :formatter="formatEmptyText" label="区" min-width="5%" />
      <el-table-column prop="sellNoCount" align="center" label="账单数" min-width="10%" />
      <el-table-column prop="expAmtSum" align="center" :formatter="formatEmptyText" label="营业额" min-width="10%" />
      <el-table-column prop="realAmtSum" align="center" :formatter="formatEmptyText" label="实收金额" min-width="10%" />
      <el-table-column prop="autoUpload" align="center" label="是否自动上传" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.autoUpload === AUTO_UPLOAD ? '自动上传' : '手动上传' }}
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime" align="center" label="自动上传时间" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.autoUpload === AUTO_UPLOAD ? scope.row.uploadTime : '手动上传' }}
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent="onChangeCurrent">
    </Pagination>
    <Toast
      :type="toastType"
      ref='toast'
      :content="toastContent"
      :timeout="2000">
    </Toast>
    <Popup
      type="submit"
      title="批量设置"
      :handleOk="onBatchChangeUploadWay"
      ref="batchChangeModal">
      <div slot="content" style="text-align: center" class="batch-setting">
        <span>{{selectedShopNameList[0]}}</span>等
        <span>{{selectedShopNameList.length}}</span>个门店
        <el-form label-width="80px" class="choice-item">
          <el-form-item label="上传方式">
            <el-select style="width: 80%" v-model="uploadWay">
              <el-option :key="AUTO_UPLOAD" label="自动上传" :value="AUTO_UPLOAD"></el-option>
              <el-option :key="MANUAL_UPLOAD" label="手动上传" :value="MANUAL_UPLOAD"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传时间" v-if="uploadWay === AUTO_UPLOAD">
            <el-time-picker style="width: 80%" placeholder="请选择上传时间" v-model="uploadTime">
            </el-time-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="errorMessage" class="error-wrapper" v-if="!!errorMessage">
        <div>
          <i class="el-icon-circle-cross"></i>
          {{ errorMessage }}
        </div>
      </div>
    </Popup>
  </div>
</template>
<script>
  import { AUTO_UPLOAD_ENUM, AUTO_UPLOAD, MANUAL_UPLOAD } from 'constant/constants';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { Pagination, Toast, Popup } from 'components';
  import { mapActions, mapState } from 'vuex';
  import fecha from 'fecha';

  export default {
    components: { Pagination, Toast, Popup },
    name: 'ERPSystemIntegration',
    data () {
      return {
        AUTO_UPLOAD,
        MANUAL_UPLOAD,
        AUTO_UPLOAD_ENUM,
        sellDateSearch: Date.now(),
        autoUploadSearch: null,
        sellDate: Date.now(),
        autoUpload: null,
        selectedShopGuidList: [],
        selectedShopNameList: [],
        uploadTime: Date.now(),
        uploadWay: MANUAL_UPLOAD,
        errorMessage: '',
        toastType: '',
        toastContent: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    async created () {
      const { pageSize, pageIndex, sellDate, autoUpload } = this;
      await this.fetchERPSystemIntegrationList({ pageSize, pageIndex, sellDate, autoUpload });
    },
    computed: {
      ...mapState({
        erpSystemIntegrationList: state => state.shopManagement.erpSystemIntegration.erpSystemIntegrationList,
        recordCount: state => state.shopManagement.erpSystemIntegration.recordCount,
        pageIndex: state => state.shopManagement.erpSystemIntegration.pageIndex,
        pageSize: state => state.shopManagement.erpSystemIntegration.pageSize,
        error: state => state.error
      })
    },
    methods: {
      ...mapActions([
        'fetchERPSystemIntegrationList',
        'batchUploadShopData',
        'batchChangeUploadWay'
      ]),
      onPageSizeChange (pageSize) {
        const { pageIndex, sellDate, autoUpload } = this;
        this.fetchERPSystemIntegrationList({ pageSize, pageIndex, sellDate, autoUpload });
      },
      onChangeCurrent (pageIndex) {
        const { pageSize, sellDate, autoUpload } = this;
        this.fetchERPSystemIntegrationList({ pageSize, pageIndex, sellDate, autoUpload });
      },
      async onSearchClick () {
        const { sellDateSearch, autoUploadSearch } = this;
        this.sellDate = sellDateSearch;
        this.autoUpload = autoUploadSearch;
        await this.refreshTableFromServer();
      },
      onResetClick () {
        this.sellDateSearch = Date.now();
        this.autoUploadSearch = null;
      },
      onSelectionChange (selectedItems) {
        this.selectedShopGuidList = selectedItems.map(item => item.shopGUID);
        this.selectedShopNameList = selectedItems.map(item => item.shopName);
      },
      onBatchChangeClick () {
        this.selectedShopGuidList.length
          ? this.$refs.batchChangeModal.isShow = true
          : this.onShowToastModal('warning', '请选择要设置的门店!'); ;
      },
      async onBatchUploadClick () {
        if (!this.selectedShopGuidList.length) {
          this.onShowToastModal('warning', '请选择需要上传的门店!');
          return;
        }
        const { selectedShopGuidList, sellDate } = this;
        await this.batchUploadShopData({ shopGuids: selectedShopGuidList.toString(), sellDate });
        // handle error
        const { errorStatus } = this.error;
        if (errorStatus) {
          this.onShowToastModal('warning', '上传失败');
        } else {
          this.onShowToastModal('success', '上传成功');
          await this.refreshTableFromServer();
        }
      },
      async onBatchChangeUploadWay () {
        const { uploadTime, uploadWay, selectedShopGuidList } = this;
        await this.batchChangeUploadWay({
          uploadTime: fecha.format(uploadTime, 'HH:mm:ss'),
          autoUpload: uploadWay,
          shopGuids: selectedShopGuidList.toString() });
        // handle error
        const { errorStatus, errorMsg } = this.error;
        if (errorStatus) {
          this.errorMessage = errorMsg;
        } else {
          this.$refs.batchChangeModal.isShow = false;
          await this.refreshTableFromServer();
        }
      },
      onShowToastModal (toastType, toastContent) {
        this.toastContent = toastContent;
        this.toastType = toastType;
        this.$refs.toast.isShow = true;
      },
      async refreshTableFromServer () {
        const { pageIndex, pageSize, sellDate, autoUpload } = this;
        await this.fetchERPSystemIntegrationList({ pageSize, pageIndex, sellDate, autoUpload });
      }
    }
  };

</script>
<style lang="scss">
  .erp-system-integration {
    margin: 10px;
    padding-left: 10px;

    .search-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }

    .erp-system-table {
      margin-top: 14px;
    }

    .batch-setting {
      margin-top: 20px;

      .choice-item {
        margin-top: 16px;
      }
    }

    .division-line {
      margin: 8px auto;
    }
  }
</style>
