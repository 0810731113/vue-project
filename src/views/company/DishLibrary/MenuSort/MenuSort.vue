<template>
  <div class="menu-sort-main">
    <div class="search-wrapper">
      <el-input class="menu-name" placeholder="菜品名称、菜品编码、助记码" @change="onChangeSearch" v-model="searchParam">
        <el-button slot="append" @click="onSearchMenu">搜索</el-button>
      </el-input>
    </div>
    <div class="bottom-wrapper">
      <el-tree class="relation-tree"
        :data="classifyList"
        :props="defaultProps"
        :highlight-current="true"
        :default-expand-all="true"
        :expand-on-click-node="false"
        @node-click="onClickNode"
        v-model="fsMenuClsId"
      />
      <el-table class="table-menu-sort" :data="sortList" border :height="525">
        <el-table-column prop="sortOrder" align="center" label="显示顺序" sortable>
          <template slot-scope="scope">
            <el-input-number class="item-input" :controls="false" :min="0" :max="9999" v-model="scope.row.sortOrder" />
          </template>
        </el-table-column>
        <el-table-column prop="itemId" align="center" label="菜品编号" sortable />
        <el-table-column prop="itemName" align="center" label="菜品名称" sortable />
      </el-table>
    </div>
    <el-button type="primary" :disabled="isMaintain" class="btn-submit btn-save" @click="onSubmit">保存</el-button>
    <toast
      ref='toast'
      content="保存成功!"
      :timeout="2000"
      type="success"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Toast } from 'components';
import cloneDeep from 'lodash/cloneDeep';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'menuSort',
  components: {
    Toast
  },
  data () {
    return {
      fsMenuClsId: 0,
      searchParam: '',
      defaultProps: {
        children: 'children',
        label: 'menuClsName'
      },
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    await this.fetchAllClassify();
    await this.fetchSortMenuList({ fsMenuClsId: 0 });
  },
  computed: mapState({
    sortList () {
      return cloneDeep(this.$store.state.dishes.menu.sortList);
    },
    classifyList () {
      const { allClassify } = this.$store.state.dishes.classify;
      return [{ children: allClassify, menuClsName: '全部分类' }];
    }
  }),
  methods: {
    ...mapActions([
      'fetchAllClassify',
      'fetchSortMenuList',
      'updateMenuSortList'
    ]),
    onChangeSearch (value) {
      this.searchParam = value.length ? value : null;
    },
    async onClickNode (data) {
      this.fsMenuClsId = data.menuClsId || 0;
      const { fsMenuClsId, searchParam } = this;
      await this.fetchSortMenuList({ fsMenuClsId, searchParam: searchParam || null });
    },
    async onSearchMenu () {
      const { fsMenuClsId, searchParam } = this;
      await this.fetchSortMenuList({ fsMenuClsId, searchParam: searchParam || null });
    },
    async onSubmit () {
      await this.updateMenuSortList({ dtos: this.sortList });
      this.$refs.toast.isShow = true;
    }
  }
};
</script>

<style lang="scss">
.menu-sort-main {
  padding: 15px;

  .search-wrapper {
    width: 100%;
    display: inline-block;

    .menu-name {
      width: 30%;
      margin-bottom: 10px;
      float: right;
    }
  }

  .item-input {
    .el-input__inner {
      text-align: center;
    }
  }

  .bottom-wrapper {
    height: 530px;

    .relation-tree {
      width: 20%;
      height: 525px;
      overflow-y: auto;
      vertical-align: top;
      display: inline-block;
    }

    .table-menu-sort {
      width: 78%;
      float: right;
      display: block;
    }
  }

  .btn-save {
    width: 120px;
    margin-left: 46%;
    margin-top: 30px;
  }
}
</style>
