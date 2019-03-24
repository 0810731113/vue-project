<template>
  <div class="group-management">
    <el-button size="small" type="primary" class="btn-add" @click="onClickAdd">新增</el-button>
    <el-button size="small" type="primary" class="btn-back" @click="onClickBack">返回配料库</el-button>
    <el-table :data="ingredGroupsList" border @selection-change="onChangeSelection">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="menuClsId" align="center" label="分组代码">
      </el-table-column>
      <el-table-column prop="menuClsName" align="center" label="分组名称">
      </el-table-column>
      <el-table-column prop="itemCount" align="center" label="配料数量">
      </el-table-column>
      <el-table-column prop="menuCounts" align="center" label="关联菜品数量">
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" @click="onClickDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount"
    />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onPopupDelete"
      ref="popup"
    />
    <add-ingredient-group
      :isEdit="isEdit"
      :pageIndex="pageIndex"
      :pageSize="pageSize"
      :detail="groupDetail"
      ref="addIngredientGroup"
      :saveIngredientGroup="saveIngredientGroup"
      :fetchIngredientGroup="fetchIngredientGroupList"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { OK } from 'constant/statusCode';
  import { AddIngredientGroup } from 'views/common';
  import { Popup, Pagination, MwButton } from 'components';
  import { DEFAULT_PAGE } from 'constant/pagination';

  export default {
    name: 'groupManagement',
    components: {
      Popup,
      MwButton,
      Pagination,
      AddIngredientGroup
    },
    data () {
      return {
        OK,
        detail: {},
        menuClsId: '',
        itemCds: [],
        isEdit: ''
      };
    },
    async created () {
      const { pageIndex, pageSize } = this;
      await this.fetchIngredientGroupList({ pageIndex, pageSize });
    },
    computed: mapState({
      ingredGroupsList: state => state.dishes.ingredient.ingredGroupsList,
      groupDetail: state => state.dishes.ingredient.groupDetail,
      pageIndex: state => state.dishes.ingredient.pageIndex,
      pageSize: state => state.dishes.ingredient.pageSize,
      recordCount: state => state.dishes.ingredient.recordCount
    }),
    methods: {
      ...mapActions([
        'saveIngredientGroup',
        'getIngredientGroups',
        'fetchIngredientGroupList',
        'deleteManageIngredientGroup',
        'getIngredientGroupDetail'
      ]),
      onClickAdd () {
        this.isEdit = false;
        this.$refs.addIngredientGroup.isShow = true;
      },
      onClickBack () {
        this.$router.push(`/myd/dishes/ingredient`);
      },
      async onChangeSize (pageSize) {
        await this.fetchIngredientGroupList({ pageIndex: DEFAULT_PAGE, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        await this.fetchIngredientGroupList({ pageIndex, pageSize: this.pageSize });
      },
      onChangeSelection (datas) {
        this.itemCds = [];
        datas.map(data => {
          this.itemCds.push(data.itemCd);
        });
      },
      async onClickEdit (row) {
        this.isEdit = true;
        await this.getIngredientGroupDetail({ menuClsId: row.menuClsId });
        this.$refs.addIngredientGroup.isShow = true;
      },
      async onClickDelete (row) {
        this.menuClsId = row.menuClsId;
        this.$refs.popup.isShow = true;
      },
      async onPopupDelete () {
        const { pageIndex, pageSize, menuClsId } = this;
        await this.deleteManageIngredientGroup({ menuClsId });
        await this.fetchIngredientGroupList({ pageIndex, pageSize });
      }
    }
  };
</script>

<style lang="scss">
  .group-management {
    padding: 15px;

    .btn-add {
      width: 90px;
    }

    .el-button {
      height: 36px;
    }

    .el-table {
      margin-top: 20px;
    }
  }
</style>
