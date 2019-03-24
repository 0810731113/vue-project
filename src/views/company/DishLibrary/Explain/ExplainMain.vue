<template>
  <div class="dishes-explain">
    <div class="btn-tools">
      <el-button :disabled="isMaintain" class="btn-primary" icon="el-icon-plus" @click="onClickAdd">新增</el-button>
      <el-button :disabled="isMaintain" class="btn-primary" @click="onShowPopup(null, 'popup')">删除</el-button>
    </div>
    <el-table :data="explainList" border @selection-change="onChangeSelection" ref="table">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="askGpName" class-name="table-auto" align="center" label="要求分组">
      </el-table-column>
      <el-table-column prop="askGpCount" align="center" label="要求数量">
      </el-table-column>
      <el-table-column prop="menuItemCount" align="center" label="菜品数量">
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="btn-wrapper">
            <mw-button v-if="scope.row.dataKind !== SYSTEM_KEY" :disabled="isMaintain" content="编辑" class="btn-edit" @click="onClickEdit(scope.row)" />
            <mw-button :disabled="isMaintain" content="菜品关联" class="btn-link" @click="onShowRelation(scope.row)" />
            <mw-button :disabled="isMaintain" content="管理内容" class="btn-manage" @click="onShowPopup(scope.row, 'content')" />
            <mw-button v-if="scope.row.dataKind !== SYSTEM_KEY" class="btn-delete" :disabled="isMaintain" content="删除" @click="onShowPopup(scope.row, 'popup')" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount">
    </pagination>
    <relation-modal
      :data="editItem"
      :itemType="0"
      :treeData="classifyList"
      :menuList="menuList"
      :linkedMenus="linkedMenus"
      :onSelectedSubmitMenu="onUpdateOrSaveMenus"
      :fetchAllMenuItems="fetchAllMenuItems"
      :onChangeLinkedMenu="onChangeLinkedMenu"
      :rightTable="rightTable"
      ref="relation"
    />
    <content-modal
      :data="editItem"
      :list="explainContentList"
      ref="content"
      :saveExplainContent="onSaveExplainContent"
      :updateExplainContent="onUpdateExplainContent"
      :deleteExplainContent="onDeleteExplainContent"
      :fetchAllExplainByPage="fetchAllExplainByPage"
    />
    <popup
      title="删除操作"
      cancelText="取消"
      :tips="popupTipMessage"
      :handleOk="() => this.onClickDelete()"
      :handleClose="() => this.onCancelDelete()"
      ref="popup"
    />
    <Toast
      ref='toast'
      content="请选择要操作的数据!"
      :timeout="2000"
      type="warning"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { Popup, Pagination, Toast, MwButton } from 'components';
import { RelationModal, ContentModal } from 'views/common';
import { ITEMTYPE, ITEMKIND, SYSTEM_KEY } from 'constant/constants';
import { OK } from 'constant/statusCode';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'explainMain',
  components: {
    Popup,
    Toast,
    MwButton,
    Pagination,
    RelationModal,
    ContentModal
  },
  data () {
    return {
      OK,
      ITEMTYPE,
      ITEMKIND,
      SYSTEM_KEY,
      editItem: {},
      contentList: [],
      linkedMenus: [],
      selectedItems: [],
      popupTipMessage: '',
      isMaintain: !checkMaintainRight(this),
      rightTable: [{ key: 'itemName', name: '菜品' }]
    };
  },
  async created () {
    await this.fetchAllExplainByPage();
  },
  computed: mapState({
    explainList: state => state.dishes.explain.list,
    menuList: state => state.dishes.explain.menuList,
    linkedMenuList: state => state.dishes.explain.linkedMenuList,
    explainContentList: state => state.dishes.explain.contentList,
    pageIndex: state => state.dishes.explain.pageIndex,
    pageSize: state => state.dishes.explain.pageSize,
    recordCount: state => state.dishes.explain.recordCount,
    classifyList () {
      const { allClassify } = this.$store.state.dishes.classify;
      return [{ children: allClassify, menuClsName: '全部分类' }];
    }
  }),
  methods: {
    ...mapActions([
      'fetchAllExplain',
      'fetchExplainDetail',
      'deleteExplain',
      'fetchExplainContentList',
      'saveExplainContent',
      'updateExplainContent',
      'deleteExplainContent',
      'fetchAllClassify',
      'fetchAllMenuItems',
      'fetchLinkedMenuItems',
      'saveExplainMenu'
    ]),
    ...mapMutations([
      'CHANGE_COOK_VISIBLE'
    ]),
    async fetchAllExplainByPage () {
      const { pageIndex, pageSize } = this;
      await this.fetchAllExplain({ pageIndex, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchAllExplain({ pageIndex, pageSize: this.pageSize });
    },
    onClickAdd () {
      this.$router.push('/myd/dishes/explain/add');
    },
    async onClickEdit (row) {
      this.$router.push(`/myd/dishes/explain/edit/${row.askGpId}`);
    },
    onCancelDelete () {
      this.$refs.table.clearSelection();
      this.selectedItems = [];
    },
    async onClickDelete () {
      const askGpIds = [];
      const { pageIndex, pageSize } = this;
      this.selectedItems.map(item => {
        askGpIds.push(item.askGpId);
      });
      await this.deleteExplain({ askGpIds });
      await this.fetchAllExplain({ pageIndex, pageSize });
      this.selectedItems = [];
    },
    async onUpdateOrSaveMenus (params) {
      const { pageIndex, pageSize } = this;
      const { askGpId, itemCds } = params;
      await this.saveExplainMenu({ askGpId, itemCds });
      await this.fetchAllExplain({ pageIndex, pageSize });
    },
    async onShowPopup (row, type) {
      if (type === 'content') {
        await this.fetchExplainContentList({ askGpId: +row.askGpId });
      }

      if (row) {
        this.selectedItems = [row];
        this.editItem = row;
        this.popupTipMessage = '菜品关联、管理内容一起删除,您确认要删除此数据吗？';
      } else {
        this.popupTipMessage = '菜品关联、管理内容一起删除,您确认要批量删除此数据吗？';
      }

      if (!this.selectedItems.length) {
        this.$refs.toast.isShow = true;
        return;
      }

      this.$refs[type].isShow = true;
    },
    async onShowRelation (row) {
      await this.fetchAllClassify({ menuClsKind: 1 });
      await this.fetchAllMenuItems({ itemType: ITEMTYPE.ALL });
      await this.fetchLinkedMenuItems({ askGpId: row.askGpId });
      this.editItem = row;
      const relation = this.$refs.relation;
      const itemCds = [];
      this.linkedMenuList.map(item => { itemCds.push(item.itemCd); });
      const items = this.menuList.filter(item => itemCds.includes(item.itemCd));
      this.linkedMenus = items;
      relation.isShow = true;
      this.CHANGE_COOK_VISIBLE();
    },
    async onSaveExplainContent (data) {
      const { askGpId, askName, addPrice } = data;
      await this.saveExplainContent({ askGpId, askName, addPrice });
      await this.fetchExplainContentList({ askGpId });
    },
    async onUpdateExplainContent (data) {
      const { id, askGpId, askName, addPrice } = data;
      await this.updateExplainContent({ id, askGpId, askName, addPrice });
      await this.fetchExplainContentList({ askGpId });
    },
    async onDeleteExplainContent (data) {
      const { id, askGpId } = data;
      await this.deleteExplainContent({ id, askGpId });
      await this.fetchExplainContentList({ askGpId });
    },
    onChangeSelection (items) {
      this.selectedItems = items;
    },
    onChangeLinkedMenu (item) {
      const index = this.linkedMenus.findIndex(menu => menu.itemCd === item.itemCd && menu.orderUintCd === item.orderUintCd);

      if (index >= 0) {
        this.linkedMenus.splice(index, 1);
      } else {
        this.linkedMenus.push(item);
      }
    }
  }
};
</script>

<style lang="scss">
.dishes-explain {
  padding: 15px;

  .btn-tools {
    margin-bottom: 15px;
  }

  .btn-wrapper {
    .el-button--primary {
      height: 26px;
    }
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

  .pagination-wrapper {
    margin: 15px 0;
  }
}
</style>
