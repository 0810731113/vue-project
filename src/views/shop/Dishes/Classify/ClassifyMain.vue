<template>
  <div class="dishes-classify">
    <div class="btn-tools" :class="{ hidden: isGuide }">
      <el-button size="small" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="() => onClickAdd()">添加分类</el-button>
      <el-button size="small" class="btn-primary" :disabled="isMaintain" @click="onShowSortable">排序</el-button>
      <div class="tools">
        <span @click="() => collapsed ? onShowAllChildren() : null" :class="{ selected: !collapsed }">全部展开</span>|
        <span @click="() => !collapsed ? onShowAllChildren() : null" :class="{ selected: collapsed }">全部收起</span>
      </div>
    </div>
    <el-table :data="classifyList" border class="width-full" height="635">
      <el-table-column align="center" prop="menuClsName" class-name="class-number" label="分类名称" min-width="20%">
        <template slot-scope="scope">
          <i :class="{
              'no-icon': !scope.row.children,
              'el-icon-caret-bottom': checkShowChildren(scope.row),
              'el-icon-caret-right': scope.row.level === FIRST_LEVEL && scope.row.children && !checkShowChildren(scope.row)
            }"
            @click="() => onShowOrHiddenChildren(scope.row)"
          />
          <i class="icon-level" :class="{ 'hidden': scope.row.level === FIRST_LEVEL, 'level-three': scope.row.level === THIRD_LEVEL }"></i>
          <span class="menucls-id">{{ scope.row.menuClsName }}</span>
          <span class="el-icon-plus icon-plus" v-show="showAddChildren(scope.row)" @click="onClickAdd(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="table-auto" prop="menuType" label="分类类型" v-show="!isGuide" min-width="15%" />
      <el-table-column align="center" class-name="table-auto" prop="expClsName" label="销售归属" min-width="15%" />
      <el-table-column align="center" class-name="table-auto" prop="revenueTypeName" label="收入归属" min-width="15%" />
      <el-table-column align="center" class-name="table-auto" prop="status" label="状态" min-width="10%" />
      <el-table-column align="center" class-name="table-auto" prop="menuCount" label="菜品数量" v-show="!isGuide" min-width="10%">
        <template slot-scope="scope">
          <span class="menu-count" @click="goToMenu(scope.row)">{{ scope.row.menuCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="" label="操作" min-width="15%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowPopup(scope.row, 'popup')" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="isGuide"
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount">
    </pagination>
    <popup
      :title="popTitle"
      :tips="popTips"
      :handleOk="onClickDelete"
      ref="popup"
    />
    <classify-sortabe
      :data="sortableList"
      :updateClassifySort="onUpdateClassifySort"
      ref='sortable'
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';
import { ClassifySortabe } from 'views/shop/Dishes/components';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import cloneDeep from 'lodash/cloneDeep';
import { FIRST_LEVEL, SECOND_LEVEL, THIRD_LEVEL, DEFAULT_MENU } from 'constant/constants';

export default {
  name: 'classifyMain',
  props: {
    isGuide: {
      type: Boolean,
      default: false
    },
    onClickEditItem: {
      type: Function,
      default: () => {}
    },
    onClickAddSubClassify: Function
  },
  components: {
    Popup,
    MwButton,
    Pagination,
    ClassifySortabe
  },
  data () {
    return {
      FIRST_LEVEL,
      THIRD_LEVEL,
      editItem: {},
      sortableList: [],
      showChildrenIds: [],
      popTitle: '',
      popTips: '',
      isMaintain: !checkMaintainRight(this),
      collapsed: true
    };
  },
  async created () {
    let params = {};
    if (this.isGuide) {
      params = { pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES };
    }

    await this.fetchClassifyByPage(params);
  },
  computed: mapState({
    pageIndex: state => state.dishes.classify.pageIndex,
    pageSize: state => state.dishes.classify.pageSize,
    recordCount: state => state.dishes.classify.recordCount,
    list: state => state.dishes.classify.list,
    classifyList () {
      this.showChildrenIds = [];
      return cloneDeep(this.list);
    }
  }),
  methods: {
    ...mapActions([
      'fetchClassifyByPage',
      'deleteClassify',
      'updateClassifySort'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchClassifyByPage({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchClassifyByPage({ pageIndex, pageSize: this.pageSize });
    },
    onClickAdd (item = {}) {
      let level = [item.menuClsId];
      if (item.level === SECOND_LEVEL) {
        level.unshift(item.menuClsId_P);
      }
      const query = { level };
      if (this.isGuide) {
        this.onClickAddSubClassify(query.level);
        return;
      }
      this.$router.push({ path: '/myd/dishes/classify/add', query });
    },
    onClickEdit (row) {
      if (this.isGuide) {
        this.onClickEditItem(row.menuClsId);
        return;
      }

      this.$router.push(`/myd/dishes/classify/edit/${row.menuClsId}`);
    },
    goToMenu (row) {
      const { menuCount, menuClsId, menuType, level } = row;
      if (!menuCount || menuType !== DEFAULT_MENU) return;
      const ids = [menuClsId];
      switch (level) {
        case FIRST_LEVEL:
          if (row.children) {
            row.children.forEach(item => {
              ids.push(item.menuClsId);
              if (item.children) {
                item.children.forEach(subItem => {
                  ids.push(subItem.menuClsId);
                });
              }
            });
          }
          break;
        case SECOND_LEVEL:
          ids.push(row.menuClsId_P);
          if (row.children) {
            row.children.forEach(item => {
              ids.push(item.menuClsId);
            });
          }
          break;
      }
      this.$router.push({ path: '/myd/dishes/menu', query: { menuClsId: ids.toString() } });
    },
    async onClickDelete () {
      if (!this.editItem.menuClsId) return;
      await this.deleteClassify(this.editItem.menuClsId);
      await this.fetchClassifyByPage();
      this.editItem = {};
    },
    onShowPopup (row, type) {
      const { children, menuCount } = row;
      // 分类下包含菜品或子分类时. 不能删除
      if (children || menuCount) {
        this.popTitle = '提示';
        this.popTips = '删除失败！该分类下包含菜品或子分类，不能删除!!';
        this.$refs[type].isShow = true;
        return;
      }

      this.popTitle = '删除操作';
      this.popTips = '您确认要删除此数据吗?';
      this.$refs[type].isShow = true;
      this.editItem = row;
    },
    onShowSortable () {
      this.sortableList = this.classifyList.slice();
      this.$refs.sortable.isShow = true;
    },
    onShowOrHiddenChildren (row, globalChange) {
      const position = this.classifyList.findIndex(item => item.menuClsId === row.menuClsId);
      const subItems = this.getChildrens(row.children);
      if (this.checkShowChildren(row)) {
        // 处理全部展开
        if (globalChange && !this.collapsed) return;

        const index = this.showChildrenIds.findIndex(id => id === row.menuClsId);
        this.showChildrenIds.splice(index, 1);
        // 已显示子集, 则从 list 移除
        for (let i = 1; i <= subItems.length; i++) {
          this.classifyList.splice(position + 1, 1);
        }
      } else {
        // 处理全部收起
        if (globalChange && this.collapsed) return;

        // 未显示子集, 则追加到父级后
        for (let i = 1; i <= subItems.length; i++) {
          this.classifyList.splice(position + i, 0, subItems[i - 1]);
        }
        this.showChildrenIds.push(row.menuClsId);
      }
    },
    getChildrens (row) {
      const childrens = [];
      row.map(item => {
        childrens.push(item);
        item.children && item.children.map(subItem => {
          childrens.push(subItem);
        });
      });
      return childrens;
    },
    checkShowChildren (row) {
      return this.showChildrenIds.includes(row.menuClsId);
    },
    showAddChildren (row) {
      const { menuType, level, currentMenuCount } = row;
      return menuType === DEFAULT_MENU && level !== THIRD_LEVEL && !currentMenuCount;
    },
    onShowAllChildren () {
      this.collapsed = !this.collapsed;
      const list = cloneDeep(this.classifyList);
      list.map(item => {
        if (item.children && !+item.menuClsId_P) {
          this.onShowOrHiddenChildren(item, true);
        }
      });
    },
    async onUpdateClassifySort (params) {
      await this.updateClassifySort(params);
      await this.fetchClassifyByPage();
    }
  }
};
</script>

<style lang="scss">
.dishes-classify {
  padding: 15px;
  color: #333;

  .btn-tools {
    margin-bottom: 15px;
  }

  .tools {
    float: right;
    font-size: 14px;

    > span {
      color: #add8e6;
      padding: 10px;
      cursor: pointer;

      &.selected {
        color: #ccc;
        cursor: not-allowed;
      }
    }
  }

  .menucls-id {
    line-height: 44px;
  }

  .menu-count {
    color: #409EFF;
    width: 100%;
    display: inline-block;
    cursor: pointer;
  }

  .class-number {
    .cell {
      justify-content: left;

      .no-icon {
        visibility: hidden;
        margin-left: 33px;
      }

      .icon-plus,
      .el-icon-caret-bottom,
      .el-icon-caret-right {
        height: 44px;
        line-height: 44px;
        padding: 0 10px;
        cursor: pointer;
      }

      .icon-plus {
        margin-left: 20px;
      }
    }

    .icon-level {
      width: 12px;
      height: 12px;
      margin-top: 15px;
      display: inline-block;
      border-left: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      margin-right: 5px;
      margin-left: 25px;
    }

    .level-three {
      margin-left: 50px;
    }
  }
}
</style>

