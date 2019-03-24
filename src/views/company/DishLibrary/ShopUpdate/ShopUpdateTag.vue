<template>
    <div class="shop-update-container">
      <el-form :inline="true" :model="searchForm" ref="search" class="search-bar">
        <el-form-item label="门店ID" prop="fsShopGUID">
          <el-input v-model="searchForm.fsShopGUID" placeholder="请输入门店ID" />
        </el-form-item>
        <el-form-item label="门店名称" prop="fsShopName">
          <el-input v-model="searchForm.fsShopName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店分组" prop="shopGroup">
          <el-select v-model="searchForm.shopGroup">
            <el-option :value="null" label="全部" />
            <el-option
              v-for="item in shopGroupList"
              :key="item.shopGroupId"
              :label="item.shopGroupName"
              :value="item.shopGroupId" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单" prop="cookBook">
          <el-select v-model="searchForm.cookBook">
            <el-option :value="null" label="全部" />
            <el-option
              v-for="item in cookBookList"
              :key="item.cookid"
              :label="item.cookname"
              :value="item.cookid" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
          <el-button class="btn-reset" @click="onClickReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="division-line"></div>
      <div>
        <el-button size="small" :disabled="isMaintain" class="btn-primary" @click="onBatchUpdateCookBookClick">更新菜单</el-button>
        <el-table :data="shopUpdateList" ref="multipleTable" border @select="onSelectionChange">
          <el-table-column type="selection" min-width="10%"/>
          <el-table-column prop="fsShopGUID" align="center" class-name="table-auto" label="门店ID" min-width="15%"/>
          <el-table-column prop="fsShopName" align="center" class-name="table-auto" label="门店名称" min-width="15%"/>
          <el-table-column prop="fsProvinceName" align="center" :formatter="formatEmptyText" label="省" min-width="10%"/>
          <el-table-column prop="fsCityName" align="center" :formatter="formatEmptyText" label="市" min-width="10%"/>
          <el-table-column prop="fsDistrictName" align="center" :formatter="formatEmptyText" label="区" min-width="10%"/>
          <el-table-column prop="fsCookname" align="center" :formatter="formatEmptyText" label="菜单" min-width="20%"/>
          <el-table-column prop="fiMenuCount" align="center" label="自主菜品" min-width="10%">
            <template slot-scope="scope">
              <label class="menu-count" @click="onShowMenuListModalClick(scope.row)">{{scope.row.fiMenuCount || '0'}}</label>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="操作" min-width="20%">
            <template slot-scope="scope">
              <mw-button :disabled="isMaintain" class="btn-authority" content="权限" @click="onShowAddMenuAuthorityModalClick(scope.row)" />
              <mw-button :disabled="isMaintain" class="btn-update-manage" content="管理" @click="onShowChangeCookBookModalClick(scope.row)" />
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
        <toast
          ref='toast'
          :content="toastContent"
          :timeout="2000"
          :type="toastType">
        </toast>
        <Popup
          type="submit"
          size="small"
          :title="cookBookModalTitle"
          :errorMsg="updateCookBookErrorMessage"
          :handleOk="onUpdateShopCookBookClick"
          ref="updateCookBookModal">
          <div slot="content" class="modal-content">
            <label>菜单：</label>
            <el-select v-model="selectedCookBook">
              <el-option
                v-for="item in cookBookManagementList"
                :key="item.cookGuid"
                :label="item.cookname"
                :value="item.cookGuid"
                style="width: 100%">
              </el-option>
            </el-select>
          </div>
        </Popup>
        <Popup
          type="submit"
          size="small"
          title="自主菜品权限"
          :errorMsg="addMenuAuthorityErrorMessage"
          :handleOk="onUpdateAddMenuAuthorityClick"
          ref="addMenuAuthorityModal">
          <div slot="content" class="modal-content">
            <el-checkbox v-model="addMenuAuthorityChecked" :true-label="1" :false-label="0">自主菜品</el-checkbox>
          </div>
        </Popup>
        <batch-update-cook-book-modal
          :update="batchUpdate"
          :timedUpdate="batchTimedUpdate"
          ref="batchUpdateCookBookModal" />
        <display-menu-modal
          :fsShopGUID="selectedShopGuid"
          ref="displayMenuModal" />
      </div>
    </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup, Toast, MwButton } from 'components';
  import BatchUpdateCookBookModal from './BatchUpdateCookBookModal';
  import DisplayMenuModal from './DisplayMenuModal';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'ShopUpdate',
    components: {
      Popup,
      Toast,
      MwButton,
      Pagination,
      DisplayMenuModal,
      BatchUpdateCookBookModal
    },
    data () {
      return {
        searchForm: {
          fsShopGUID: null,
          fsShopName: null,
          shopGroup: null,
          cookBook: null
        },
        fsShopGUID: null,
        fsShopName: null,
        cookBookModalTitle: null,
        selectedShops: [],
        toastContent: '',
        toastType: '',
        selectedShopGuid: '',
        selectedCookBook: '',
        updateCookBookErrorMessage: '',
        addMenuAuthorityErrorMessage: '',
        addMenuAuthorityChecked: 0,
        isMaintain: !checkMaintainRight(this)
      };
    },
    async created () {
      await this.refreshShopListFromServer(this.pageIndex, this.pageSize);
      await this.fetchShopUpdateFormData();
    },
    computed: {
      ...mapState({
        shopGroupList: state => state.dishLibrary.shopUpdate.shopGroupList,
        cookBookList: state => state.dishLibrary.shopUpdate.cookBookList,
        cookBookManagementList: state => state.dishLibrary.shopUpdate.cookBookManagementList,
        addMenuAuthority: state => state.dishLibrary.shopUpdate.addMenuAuthority,
        cookBookManagement: state => state.dishLibrary.shopUpdate.cookBookManagement,
        shopUpdateList: state => state.dishLibrary.shopUpdate.shopUpdateList,
        recordCount: state => state.dishLibrary.shopUpdate.recordCount,
        pageIndex: state => state.dishLibrary.shopUpdate.pageIndex,
        pageSize: state => state.dishLibrary.shopUpdate.pageSize,
        errorStatus: state => state.error.errorStatus,
        errorMsg: state => state.error.errorMsg
      })
    },
    methods: {
      ...mapActions([
        'fetchShopUpdateFormData',
        'fetchShopUpdateList',
        'batchUpdateCookBook',
        'updateShopCookBook',
        'fetchCookBookManagementList',
        'fetchAddMenuAuthority',
        'updateAddMenuAuthority'
      ]),
      async onPageSizeChange (pageSize) {
        await this.refreshShopListFromServer(this.pageIndex, pageSize);
      },
      async onChangeCurrent (pageIndex) {
        await this.refreshShopListFromServer(pageIndex, this.pageSize);
      },
      async onClickSearch () {
        const { fsShopGUID, fsShopName, cookBook } = this.searchForm;
        this.fsShopGUID = fsShopGUID;
        this.fsShopName = fsShopName;
        const { pageIndex, pageSize } = this;
        await this.fetchShopUpdateList({ fsShopGUID, fsShopName, cookBook, pageIndex, pageSize });
      },
      onClickReset () {
        this.$refs.search.resetFields();
        this.fsShopGUID = null;
        this.fsShopGUID = null;
      },
      onSelectionChange (selectedItems) {
        this.selectedShops = selectedItems;
      },
      async onShowChangeCookBookModalClick (row) {
        this.selectedShopGuid = row.fsShopGUID;
        this.selectedCookBook = '';
        this.updateCookBookErrorMessage = '';
        await this.fetchCookBookManagementList({ fsShopGUID: row.fsShopGUID });
        this.$refs.updateCookBookModal.isShow = true;
      },
      async onUpdateShopCookBookClick () {
        const fsCookBookGuid = this.cookBookManagement ? this.cookBookManagement.cookBookGuid : undefined;
        await this.updateShopCookBook({
          fsShopGUID: this.selectedShopGuid,
          fsCookGuid: this.selectedCookBook,
          fsCookBookGuid
        });

        if (this.errorStatus) {
          this.updateCookBookErrorMessage = this.errorMsg;
        } else {
          this.$refs.updateCookBookModal.isShow = false;
          const { pageIndex, pageSize } = this;
          await this.refreshShopListFromServer(pageIndex, pageSize);
        }
      },
      async onShowAddMenuAuthorityModalClick (row) {
        this.selectedShopGuid = row.fsShopGUID;
        await this.fetchAddMenuAuthority({ fsShopGUID: row.fsShopGUID });
        this.addMenuAuthorityChecked = this.addMenuAuthority;
        this.$refs.addMenuAuthorityModal.isShow = true;
      },
      async onUpdateAddMenuAuthorityClick () {
        await this.updateAddMenuAuthority({
          fsShopGUID: this.selectedShopGuid,
          fiIsShopMenu: this.addMenuAuthorityChecked
        });

        if (this.errorStatus) {
          this.addMenuAuthorityErrorMessage = this.errorMsg;
        } else {
          this.$refs.addMenuAuthorityModal.isShow = false;
          const { pageIndex, pageSize } = this;
          await this.refreshShopListFromServer(pageIndex, pageSize);
        }
      },
      onBatchUpdateCookBookClick () {
        if (!this.selectedShops.length) {
          this.toastContent = '请选择需要操作的门店';
          this.toastType = 'warning';
          this.$refs.toast.isShow = true;
          return;
        }
        this.$refs.batchUpdateCookBookModal.isShow = true;
      },
      async batchUpdate () {
        await this.batchUpdateCookBook({ ids: this.selectedShops, loading: true });

        if (!this.errorStatus) {
          this.toastContent = '更新成功';
          this.toastType = 'success';
          this.$refs.toast.isShow = true;
        }
      },
      async batchTimedUpdate (time) {
        await this.batchUpdateCookBook({ ids: this.selectedShops, fsStarDate: time, loading: true });

        if (!this.errorStatus) {
          this.toastContent = '更新成功';
          this.toastType = 'success';
          this.$refs.toast.isShow = true;
        }
      },
      onShowMenuListModalClick (row) {
        this.selectedShopGuid = row.fsShopGUID;
        this.$refs.displayMenuModal.isShow = true;
      },
      async refreshShopListFromServer (pageIndex, pageSize) {
        const { fsShopGUID, fsShopName } = this;
        await this.fetchShopUpdateList({ pageIndex, pageSize, fsShopGUID, fsShopName });
      }
    }
  };
</script>
<style lang="scss">
  .shop-update-container {
    padding: 20px;

    .search-bar {
      .el-form-item {
        margin-bottom: 0;
      }
    }

    .division-line {
      margin: 8px auto;
    }

    .btn-primary {
      margin-bottom: 15px;
    }

    .modal-content {
      text-align: center;
      margin: 10px 0;
    }

    .menu-count {
      color: #337ab7;
      cursor: pointer;

      &:hover {
        color: #23527c;
        outline: 0;
      }
    }
  }
</style>
