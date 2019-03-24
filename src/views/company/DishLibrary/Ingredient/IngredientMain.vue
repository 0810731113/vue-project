<template>
  <div class="dish-library-ingredient">
    <el-button :disabled="isMaintain" class="btn-primary" icon="el-icon-plus" @click="onClickAdd">新增</el-button>
    <el-button :disabled="isMaintain" class="btn-primary" @click="onShowMoving">移动到</el-button>
    <el-button :disabled="isMaintain" class="btn-primary" @click="onClickBatchDelete">删除</el-button>
    <el-select v-model="menuClsId" class="ingredient-group" @change="getIngreGroupList">
      <el-option label="所有分组" :value="null"></el-option>
      <el-option
        v-for="item in ingredGroupsList"
        :key="item.menuClsId"
        :label="item.menuClsName"
        :value="item.menuClsId" />
    </el-select>
    <!--<el-button size="small" type="primary" class="btn-primary" @click="onClickChange">分组管理</el-button>-->
    <el-table :data="ingredientList" border @selection-change="onChangeSelection">
      <el-table-column type="selection" />
      <el-table-column prop="itemId" align="center" label="配料代码" />
      <el-table-column prop="itemName" align="center" label="菜品名称" />
      <el-table-column prop="groupName" align="center" label="分组" />
      <el-table-column prop="salePrice" align="center" label="价格">
        <template slot-scope="scope">
          {{ `${scope.row.salePrice}/${scope.row.orderUint}` }}
        </template>
      </el-table-column>
      <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button :disabled="isMaintain" class="btn-edit" content="编辑" @click="onClickEdit(scope.row)" />
          <mw-button :disabled="isMaintain" class="btn-delete" content="删除" @click="onClickDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onPopupDelete"
      ref="popup" />
    <toast
      ref='toast'
      content="请选择要操作的数据!"
      :timeout="2000"
      type="warning" />
    <ingredient-moving
      ref="ingredientMoving"
      :itemCds="itemCds"
      :names="selectedNames"
      :pageIndex="pageIndex"
      :pageSize="pageSize"
      :ingredGroupsList="ingredGroupsList"
      :moveIngredientGroup="moveIngredientGroup"
      :fetchAllIngredientList="fetchAllIngredientList" />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { OK } from 'constant/statusCode';
  import { YES } from 'constant/constants';
  import { Popup, Pagination, Toast, MwButton } from 'components';
  import { IngredientMoving } from 'views/common';
  import { DEFAULT_PAGE } from 'constant/pagination';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'ingredientMain',
    components: {
      Popup,
      Toast,
      MwButton,
      Pagination,
      IngredientMoving
    },
    data () {
      return {
        OK,
        YES,
        menuClsId: null,
        menuIngredients: [],
        itemCds: [],
        selectedNames: [],
        editId: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    async created () {
      const { menuClsId, pageIndex, pageSize } = this;
      await this.fetchAllIngredientList({ pageIndex, pageSize, menuClsId });
      await this.getIngredientGroups({ type: YES });
    },
    computed: mapState({
      ingredientList: state => state.dishes.ingredient.ingredientList,
      ingredGroupsList: state => state.dishes.ingredient.ingredGroupsList,
      pageIndex: state => state.dishes.ingredient.pageIndex,
      pageSize: state => state.dishes.ingredient.pageSize,
      recordCount: state => state.dishes.ingredient.recordCount
    }),
    methods: {
      ...mapActions([
        'fetchAllIngredientList',
        'getIngredientGroups',
        'moveIngredientGroup',
        'deleteMenuIngredient'
      ]),
      onClickAdd () {
        this.$router.push({ path: '/myd/dishes/ingredient/add' });
      },
      onClickChange () {
        this.$router.push({ path: '/myd/dishes/ingredient/group' });
      },
      async getIngreGroupList () {
        const { menuClsId, pageIndex, pageSize } = this;
        await this.fetchAllIngredientList({ pageIndex, pageSize, menuClsId });
      },
      async onChangeSize (pageSize) {
        await this.fetchAllIngredientList({ pageIndex: DEFAULT_PAGE, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        await this.fetchAllIngredientList({ pageIndex, pageSize: this.pageSize });
      },
      onShowMoving () {
        if (!this.itemCds.length) {
          this.$refs.toast.isShow = true;
        } else {
          const names = [];
          this.ingredientList.map(item => {
            if (this.itemCds.includes(item.itemCd)) {
              names.push(item.itemName);
            }
          });

          this.selectedNames = names;
          this.$refs.ingredientMoving.isShow = true;
        }
      },
      onChangeSelection (datas) {
        this.itemCds = [];
        datas.map(data => {
          this.itemCds.push(data.itemCd);
        });
      },
      async onClickEdit (row) {
        this.$router.push(`/myd/dishes/ingredient/edit/${row.itemCd}`);
      },
      async onClickBatchDelete () {
        if (!this.itemCds.length) {
          this.$refs.toast.isShow = true;
        } else {
          this.ingredientList.map(item => {
            if (this.itemCds.includes(item.itemCd)) {
              const { itemCd, orderUintCd } = item;
              this.menuIngredients.push({ itemCd, orderUintCd });
            }
          });
          this.$refs.popup.isShow = true;
        }
      },
      async onClickDelete (row) {
        this.menuIngredients.push({
          itemCd: row.itemCd,
          orderUintCd: row.orderUintCd
        });
        this.$refs.popup.isShow = true;
      },
      async onPopupDelete () {
        const { pageIndex, pageSize, menuIngredients } = this;
        await this.deleteMenuIngredient({ menuIngredients });
        await this.fetchAllIngredientList({ pageIndex, pageSize });
      }
    }
  };
</script>

<style lang="scss">
  .dish-library-ingredient {
    padding: 15px;

    .ingredient-group {
      width: 160px;
      margin: 0 15px 0 30px;
    }

    .el-button {
      height: 36px;
    }

    .el-table {
      margin-top: 20px;
    }
  }
</style>
