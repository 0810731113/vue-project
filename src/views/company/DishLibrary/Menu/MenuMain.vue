<template>
  <div class="dish-menu">
    <menu-search
      v-if="!(isMenu || isDiscount)"
      :classList="classListWithAll"
      :printList="printList"
      :isShop="false"
      :menuClsId="searchMenuCls"
      :onSearchMenus="onSearchMenus"
    />
    <div v-if="!isMenu" class="btn-wrapper">
      <el-button v-show="!isDiscount" class="btn-primary" :disabled="isAdd" @click="() => { this.$router.push('/myd/dishes/menu/add'); }">添加菜品</el-button>
      <el-cascader
        ref="cascader"
        v-model="fsMenuClsId"
        :options="allClassify"
        :props="defaultProps"
        @change="onSelectClassify"
      />
      <el-button v-show="!isDiscount" class="btn-primary" :disabled="isMaintain" @click="onClickCascader">移动到</el-button>
      <el-button class="btn-primary" :disabled="isMaintain" @click="onShowModal('menuSetting')">批量设置</el-button>
      <el-button v-show="!isDiscount" class="btn-primary" :disabled="isDelete" @click="onShowDeletePopup()">批量删除</el-button>
      <el-button v-show="!isDiscount" class="btn-primary" :disabled="isMaintain" @click="onShowSortable()">排序</el-button>
      <div class="right-btns">
        <a :href="getActionUrl(`dishes/${API_EXPROT_MENU_LIST}`)">
          <el-button v-show="!isDiscount" :disabled="isExport" class="btn-primary">菜品导出</el-button>
        </a>
        <el-button class="btn-primary" v-show="!isDiscount" :disabled="isImport" @click="() => { this.$router.push('/myd/dishes/menu/import'); }">菜品导入</el-button>
        <!-- <el-button size="small" type="primary" v-show="!isDiscount" :disabled="isUpload" @click="() => { this.$router.push('/myd/dishes/menu/upload'); }">菜品批量上传</el-button> -->
      </div>
    </div>
    <el-table :data="list" border @selection-change="onChangeSelection" :class="{ 'no-select': isMenu }" max-height="600">
      <el-table-column :type="isMenu ? '' : 'selection'" :width="isMenu ? '1' : '50'" />
      <el-table-column prop="fiItemCd" align="center" label="菜品内码" min-width="10%" />
      <el-table-column prop="fsItemId" align="center" label="菜品编号" min-width="10%" />
      <el-table-column prop="fsItemName" align="center" class-name="table-auto" label="菜品名称" min-width="10%">
        <template slot-scope="scope">
          <div class="table-row-link" @click="() => onShowMenuDetailClick(scope.row.fiItemCd)">{{scope.row.fsItemName}}</div>
          <!--<div>{{scope.row.fsItemName}}</div>-->
        </template>
      </el-table-column>
      <el-table-column prop="fdSalePrice" align="center" label="价格(元)" min-width="7%" />
      <el-table-column prop="fsOrderUint" align="center" label="规格" min-width="7%" />
      <el-table-column prop="cookCount"  align="center" label="所属菜单" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.cookCount ? scope.row.cookCount : 0 }}个
        </template>
      </el-table-column>
      <el-table-column prop="menuItemCount" class-name="option-wrap table-auto" v-if="!isMenu" align="center" label="选项" min-width="15%">
        <template slot-scope="scope">
          <menu-options :data="scope.row">
          </menu-options>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="10%">
        <template slot-scope="scope">
          <mw-button v-show="!(isMenu || isDiscount)" class="btn-edit" content="编辑" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isDelete" @click="onShowDeletePopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <menu-setting
      ref="menuSetting"
      :data="selectedIds"
      :settingList="settingList"
      :onUpdateSettings="onUpdateSettings"
    />
    <Sortable :sortList="sortableList" :handleOK="onUpdateSortList" :headerKey="['品类名称']" :sortKey="['itemName']" ref="sortable">
      <el-cascader slot="filter" placeholder="请选择菜品分类" :options="classList" :props="defaultProps" @change="onChangeCascader" v-model="selectedClass"/>
    </Sortable>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount"
      layout="slot, ->, prev, pager, next, sizes"
    />
    <popup
      :title="deletePopupTitle"
      :tips="deletePopupTips"
      :handleOk="() => this.onClickConfirm()"
      ref="popup"
    />
    <toast
      ref='toast'
      content="请选择要操作的数据!"
      :timeout="2000"
      type="warning"
    />
    <menu-detail-modal ref="menuDetail" :itemCd="itemCd"></menu-detail-modal>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Popup, Pagination, Toast, MwButton, Sortable } from 'components';
  import { MenuOptions, MenuSetting, MenuSearch } from 'common/components';
  import { DEFAULT_PAGE } from 'constant/pagination';
  import { API_EXPROT_MENU_LIST } from 'constant/API';
  import * as Auth from 'utils/permissionUtil';
  import MenuDetailModal from 'views/shop/Dishes/Menu/MenuDetailModal';

  export default {
    name: 'MenuMain',
    props: {
      isMenu: {
        type: Boolean,
        default: false
      },
      isDiscount: {
        type: Boolean,
        default: false
      }
    },
    components: {
      MenuDetailModal,
      MenuOptions,
      MenuSetting,
      MenuSearch,
      Pagination,
      MwButton,
      Sortable,
      Popup,
      Toast
    },
    data () {
      return {
        API_EXPROT_MENU_LIST,
        itemCd: '',
        selectedIds: [],
        sortableList: [],
        deletePopupTitle: '',
        deletePopupTips: '',
        fsMenuClsId: [],
        selectedClass: [],
        searchMenuCls: null,
        isMoveClass: false,
        defaultProps: {
          value: 'menuClsId',
          label: 'menuClsName',
          children: 'children'
        },
        searchParams: {},
        isMaintain: !Auth.checkMaintainRight(this),
//        isDelete: !Auth.checkDeleteRight(this),
//        isImport: !Auth.checkImportRight(this),
//        isExport: !Auth.checkExportRight(this),
//        isUpload: !Auth.checkUploadRight(this),
//        isAdd: !Auth.checkAddRight(this)
        isDelete: false,
        isImport: false,
        isExport: false,
        isUpload: false,
        isAdd: false
      };
    },
    async created () {
      const { pageIndex, pageSize } = this;
      const { menuClsId } = this.$route.query;
      this.searchMenuCls = menuClsId;
      await this.fetchAllMenu({ pageIndex, pageSize, fsMenuClsId: menuClsId });
      await this.fetchAllClassify(({ menuClsKind: 1 }));
      await this.fetchMenuClassList();
      await this.fetchMenuSettingList();
      await this.getPrintList();
    },
    watch: {
      sortList () {
        this.sortableList = this.sortList.slice();
      }
    },
    computed: mapState({
      list: state => state.dishes.menu.list,
      sortList: state => state.dishes.menu.sortList,
      classList: state => state.dishes.menu.classList,
      allClassify: state => state.dishes.classify.allClassify,
      settingList: state => state.dishes.menu.settingList,
      downloadFile: state => state.dishes.menu.downloadFile,
      pageIndex: state => state.dishes.menu.pageIndex,
      pageSize: state => state.dishes.menu.pageSize,
      recordCount: state => state.dishes.menu.recordCount,
      printList: state => state.dishes.menu.printList,
      classListWithAll () {
        const classListWithAll = this.allClassify ? this.allClassify.slice() : [];
        classListWithAll.unshift({ menuClsId: [-1], menuClsName: '全部分类', children: null });
        return classListWithAll;
      }
    }),
    methods: {
      ...mapActions([
        'fetchAllMenu',
        'fetchSortMenuList',
        'fetchAllClassify',
        'fetchMenuClassList',
        'fetchMenuSettingList',
        'updateMenuSortList',
        'updateMenuSettingByIds',
        'deleteMenuByIds',
        'getPrintList',
        'batchMoveMenus'
      ]),
      async onChangeSize (pageSize) {
        await this.fetchAllMenu({ ...this.searchParams, pageIndex: DEFAULT_PAGE, pageSize, loading: true });
      },
      async onChangeCurrent (pageIndex) {
        await this.fetchAllMenu({ ...this.searchParams, pageIndex, pageSize: this.pageSize, loading: true });
      },
      async onUpdateSettings (params) {
        const { pageIndex, pageSize, selectedIds } = this;
        await this.updateMenuSettingByIds({ ...params, itemCds: selectedIds });
        await this.fetchAllMenu({ pageIndex, pageSize });
      },
      async onSearchMenus (data) {
        this.searchParams = data;
        const { pageSize } = this;
        await this.fetchAllMenu({ ...data, pageIndex: DEFAULT_PAGE, pageSize, loading: true });
      },
      async onClickConfirm () {
        const { pageIndex, pageSize, isMoveClass, fsMenuClsId, selectedIds } = this;
        if (isMoveClass) {
          await this.batchMoveMenus({ fsMenuClsId: fsMenuClsId.toString(), fiItemCds: selectedIds });
          this.isMoveClass = false;
          this.fsMenuClsId = [];
        } else {
          await this.deleteMenuByIds({ ids: this.selectedIds });
        }
        await this.fetchAllMenu({ pageIndex, pageSize, loading: true });
      },
      async onUpdateSortList (params) {
        const dtos = [];
        params.map((item, index) => {
          const { itemCd, itemName } = item;
          dtos.push({ itemCd, itemName, sortOrder: index });
        });
        const { pageIndex, pageSize } = this;
        await this.updateMenuSortList({ dtos });
        await this.fetchAllMenu({ pageIndex, pageSize });
      },
      async onChangeCascader (value) {
        value = value.slice(-1).pop();
        await this.fetchSortMenuList({ fsMenuClsId: +value < 0 ? 0 : value });
      },
      onClickCascader () {
        if (!this.selectedIds.length) {
          this.$refs.toast.isShow = true;
          return;
        }
        this.$refs.cascader.handleClick();
      },
      async onSelectClassify (menuClsId) {
        let menuNames = this.getClsNameByIds(menuClsId);
        this.isMoveClass = true;
        this.deletePopupTitle = '操作提示';
        this.deletePopupTips = `确定移动${this.selectedIds.length}个菜品至${menuNames.join('>')}?`;
        this.$refs.popup.isShow = true;
        this.fsMenuClsId = [menuClsId.pop()];
      },
      getClsNameByIds (menuClsId) {
        let menuNames = [];
        menuClsId.map(item => {
          this.allClassify.map(first => {
            if (first.menuClsId === item) {
              menuNames.push(first.menuClsName);
            }
            if (first.children) {
              first.children.map(second => {
                if (second.menuClsId === item) {
                  menuNames.push(second.menuClsName);
                }
                if (second.children) {
                  second.children.map(third => {
                    if (third.menuClsId === item) {
                      menuNames.push(third.menuClsName);
                    }
                  }
                    );
                }
              }
              );
            }
          });
        });
        return menuNames;
      },
      onClickEdit (item) {
        this.$router.push(`/myd/dishes/menu/edit/${item.fiItemCd}`);
      },
      onChangeSelection (items) {
        this.selectedIds = items.map(item => item.fiItemCd);
      },
      onShowModal (type) {
        if (!this.selectedIds.length) {
          this.$refs.toast.isShow = true;
        } else {
          this.$refs[type].isShow = true;
        }
      },
      async onShowSortable () {
        await this.fetchSortMenuList({ fsMenuClsId: 0 }); // 0或者null查全部
        this.selectedClass = [];
        this.$refs.sortable.isShow = true;
      },
      onShowDeletePopup (row) {
        if (row) {
          this.deletePopupTitle = '操作提示';
          this.deletePopupTips = '您确认要删除此数据吗?';
          this.selectedIds = [row.fiItemCd];
          this.$refs.popup.isShow = true;
          return;
        }
        if (!this.selectedIds.length) {
          this.$refs.toast.isShow = true;
          return;
        }
        this.deletePopupTitle = '删除操作';
        this.deletePopupTips = '您确认要删除此数据吗？（与菜品相关的折扣方案一并删除）';
        this.$refs.popup.isShow = true;
      },
      onShowMenuDetailClick (itemCd) {
        this.itemCd = itemCd;
        this.$refs.menuDetail.isShow = true;
      }
    }
  };
</script>

<style lang="scss">
  .dish-menu {
    padding: 15px;

    .btn-wrapper {
      padding: 10px 0 15px;

      .el-button {
        height: 36px;
      }

      .el-cascader {
        .el-input {
          display: none;
        }
      }

      .right-btns {
        float: right;
        display: block;
      }
    }

    .el-table .el-table__body .cell {
      display: inline-block;
    }

    .option-wrap {
      height: 45px;
      vertical-align: middle;

      .menu-options {
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
      }
    }

    .btn-upload {
      display: inline-block;
    }

    .no-select {
      .el-table__body-wrapper,
      .el-table__header-wrapper {
        tbody > tr,
        thead > tr {
          :first-child {
            border-right: 0;
          }
        }
      }
    }

    .table-row-link {
      cursor: pointer;
      color: #409EFF;
    }
  }

  .el-cascader-menus {
    margin-top: 15px;
  }
</style>
