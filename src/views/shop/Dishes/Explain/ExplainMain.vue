<template>
  <div class="dishes-explain">
    <div class="btn-tools" v-if="!isGuide">
      <el-button size="small" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
      <el-button size="small" class="btn-primary" :disabled="isMaintain" @click="onShowPopup(null, 'popup')">删除</el-button>
      <el-button size="small" class="btn-primary" :disabled="isMaintain" @click="onShowSortable()">排序</el-button>
    </div>
    <el-table :data="explainList" border @selection-change="onChangeSelection" :class="{ 'no-select': isGuide }">
      <el-table-column :type="isGuide ? '' : 'selection'" :width="isGuide ? '1' : '50'" />
      <el-table-column prop="askGpName" class-name="table-auto" align="center" label="要求分组" />
      <el-table-column prop="askGpCount" align="center" label="要求数量"/>
      <el-table-column v-if="false" prop="menuClsCount" align="center" label="菜品分类关联">
        <template slot-scope="scope">
          {{ +scope.row.menuClsCount ? '已关联' : '未关联' }}
        </template>
      </el-table-column>
      <el-table-column prop="menuItemCount" align="center" label="菜品数量" />
      <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" />
      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <div class="btn-wrapper">
            <mw-button v-if="scope.row.dataKind !== SYSTEM_KEY" class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
            <mw-button class="btn-classify" v-if="false" content="分类关联" :disabled="isMaintain" @click="onShowClassify(scope.row)" />
            <mw-button class="btn-link" content="菜品关联" :disabled="isMaintain" @click="onShowRelation(scope.row)" />
            <mw-button class="btn-manage" content="管理内容" :disabled="isMaintain" @click="onShowPopup(scope.row, 'content')" />
            <mw-button v-if="scope.row.dataKind !== SYSTEM_KEY" content="删除" class="btn-delete" :disabled="isMaintain" @click="onShowPopup(scope.row, 'popup')" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount" />
    <relation-modal
      :data="editItem"
      :treeData="menuClassList"
      :menuList="menuList"
      :linkedMenus="linkedMenus"
      :onSelectedSubmitMenu="onUpdateOrSaveMenus"
      :fetchAllMenuItems="fetchAllMenuItems"
      :onChangeLinkedMenu="onChangeLinkedMenu"
      :rightTable="rightTable"
      ref="relation" />
    <content-modal
      :data="editItem"
      :list="explainContentList"
      ref="content"
      :saveExplainContent="saveExplainContent"
      :updateExplainContent="updateExplainContent"
      :deleteExplainContent="deleteExplainContent"
      :fetchAllExplainByPage="fetchAllExplainByPage" />
    <classify-modal
      :data="menuClassList"
      :selectedClass="menuClsList"
      :item="editItem"
      :saveExplainMenuCls="onSaveExplainMenuCls"
      ref="classify" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="() => this.onClickDelete()"
      ref="popup" />
    <Toast
      ref='toast'
      content="请选择要操作的数据!"
      :timeout="2000"
      type="warning" />
    <Sortable :sortList="sortableList" :handleOK="onUpdateSortList" :headerKey="['要求分组名称']" :sortKey="['askGpName']" ref="sortable">
    </Sortable>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, Toast, MwButton,Sortable } from 'components';
import { RelationModal, ContentModal, ClassifyModal } from 'views/common';
import { ITEMTYPE, ITEMKIND, SYSTEM_KEY } from 'constant/constants';
import { checkMaintainRight } from 'utils/permissionUtil';
import { OK } from 'constant/statusCode';
import {getDishRequireSortList,saveDishRequireSortList} from 'api/dishes'

export default {
  name: 'explainMain',
  props: {
    isGuide: Boolean,
    onClickEditItem: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    Popup,
    Toast,
    MwButton,
    Pagination,
    RelationModal,
    ClassifyModal,
    ContentModal,
    Sortable,
  },
  data () {
    return {
      OK,
      ITEMTYPE,
      SYSTEM_KEY,
      editItem: {},
      contentList: [],
      linkedMenus: [],
      selectedItems: [],
      isMaintain: !checkMaintainRight(this),
      rightTable: [{ key: 'itemName', name: '菜品' }],
      sortableList: [], //排序
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
    menuClsList: state => state.dishes.explain.menuClsList,
    pageIndex: state => state.dishes.explain.pageIndex,
    pageSize: state => state.dishes.explain.pageSize,
    recordCount: state => state.dishes.explain.recordCount,
    menuClassList () {
      const { classList } = this.$store.state.dishes.menu;
      return [{ children: classList, menuClsName: '全部分类', menuClsKind: '1' }];
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
      'fetchMenuClassList',
      'fetchAllMenuItems',
      'fetchLinkedMenuItems',
      'saveExplainMenu',
      'saveExplainMenuCls',
      'fetchExplainMenuCls'
    ]),
    async onShowSortable () {
      var result = await getDishRequireSortList({}); // 0或者null查全部
      console.log(result)
      if(result.err.errNo == 0){
        this.sortableList = result.datas
      }else{

      }

      this.$refs.sortable.isShow = true;
    },
    async onUpdateSortList(data){ //排序好提交
      console.log(data)
      var datas = []
      data.map((item,index) => {
        const {askGpId} = item
        datas.push({askGpId,sortOrder:index})
      })
      await saveDishRequireSortList({datas})
      await this.fetchAllExplainByPage();

    },
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
      if (this.isGuide) {
        await this.onClickEditItem(row.askGpId);
        return;
      }

      this.$router.push(`/myd/dishes/explain/edit/${row.askGpId}`);
    },
    async onClickDelete () {
      const ids = [];
      const { pageIndex, pageSize } = this;
      this.selectedItems.map(item => {
        ids.push(item.askGpId);
      });
      await this.deleteExplain({ askGpIds: ids });
      await this.fetchAllExplain({ pageIndex, pageSize });
      this.selectedItems = [];
    },
    async onUpdateOrSaveMenus (params) {
      const { pageIndex, pageSize } = this;
      await this.saveExplainMenu(params);
      await this.fetchAllExplain({ pageIndex, pageSize });
    },
    async onSaveExplainMenuCls (params) {
      const { pageIndex, pageSize } = this;
      await this.saveExplainMenuCls(params);
      await this.fetchAllExplain({ pageIndex, pageSize });
    },
    async onShowPopup (row, type) {
      if (type === 'content') {
        await this.fetchExplainContentList({ askGpId: row.askGpId });
      }

      if (row) {
        this.selectedItems = [row];
        this.editItem = row;
      }

      if (!this.selectedItems.length) {
        this.$refs.toast.isShow = true;
        return;
      }
      this.$refs[type].isShow = true;
    },
    async onShowRelation (row) {
      await this.fetchMenuClassList();
      await this.fetchAllMenuItems({ itemKind: ITEMKIND.DISH, menuClsId: 0, itemType: ITEMTYPE.SINGLE });
      await this.fetchLinkedMenuItems({ askGpId: row.askGpId });
      this.editItem = row;
      const relation = this.$refs.relation;
      const itemCds = [];
      this.linkedMenuList.map(item => { itemCds.push(item.itemCd); });
      const items = this.menuList.filter(item => itemCds.includes(item.itemCd));
      this.linkedMenus = items;
      relation.isShow = true;
    },
    async onShowClassify (row) {
      await this.fetchMenuClassList();
      await this.fetchExplainMenuCls({ askGpId: row.askGpId });
      this.editItem = row;
      this.$refs.classify.isShow = true;
    },
    onChangeSelection (items) {
      this.selectedItems = items;
    },
    onChangeLinkedMenu (item) {
      const index = this.linkedMenus.findIndex(menu =>
        menu.itemCd === item.itemCd &&
        menu.orderUintCd === item.orderUintCd &&
        menu.salePrice === item.salePrice
      );

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

  .el-table td,
  .el-table th {
    padding: 5px;
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

