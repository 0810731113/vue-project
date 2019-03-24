<template>
  <el-dialog v-if="isShow" custom-class="base-modal garnish-menu-modal" :visible.sync="isShow" size="small">
    <div class="modal-title" slot="title">管理配餐项内菜品</div>
    <el-tree
      class="relation-tree"
      :data="treeData"
      :props="defaultProps"
      :highlight-current="true"
      :default-expand-all="true"
      :expand-on-click-node="false"
      @node-click="onClickNode">
    </el-tree>
    <div class="dishes-transfer">
      <el-form :inline="true" class="form-inline">
        <el-form-item label="菜品：" class="search-input">
          <el-input v-model="searchMenuName">
            <el-button slot="append" icon="el-icon-search" @click="onClickSearch" />
          </el-input>
        </el-form-item>
        <div class="add-tips">已添加</div>
      </el-form>
      <el-table
        ref="transfer"
        class="transfer-table"
        :data="menuList"
        border
        :height="450"
        @select="(selection, row) => onChangeLinkedMenu(row)"
        @select-all="onSelectAll"
      >
        <el-table-column align="center" type="selection" />
        <el-table-column prop="itemName" align="center" label="菜品" />
        <el-table-column prop="orderUint" align="center" label="规格" />
        <el-table-column prop="salePrice" align="center" label="价格" />
      </el-table>
      <el-table class="linked-table" :data="linkedMenus" border :height="450">
        <el-table-column prop="itemName" class-name="table-auto" align="center" label="菜品" />
        <el-table-column prop="orderUint" align="center" label="规格" width="40"/>
        <el-table-column prop="salePrice" align="center" label="价格" width="60"/>
        <el-table-column v-if="!(selectedItem && selectedItem.setFoodType) " align="center" label="数量">
          <template slot-scope="scope">
            <el-input-number
              :value="scope.row.saleQty"
              :min="1"
              :controls="false"
              @blur="(event) => onBlurSaleQty(event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column v-if="(selectedItem && selectedItem.setFoodType) " align="center" label="差价">
          <template slot-scope="scope">
            <el-input-number :controls="false" v-model="scope.row.increase" />
          </template>
        </el-table-column>
        <el-table-column v-if="(selectedItem && selectedItem.setFoodType) " align="center" label="会员差价">
          <template slot-scope="scope">
            <el-input-number :controls="false" v-model="scope.row.vipdifference" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { REGEX_NUMBER } from 'constant/regex';

export default {
  name: 'garnishMenu',
  props: [
    'treeData',
    'menuList',
    'linkedMenus',
    'fetchAllMenuItems',
    'onChangeLinkedMenu',
    'onSubmitMenu',
    'selectedItem'
  ],
  data () {
    return {
      isShow: false,
      menuClsId: '0',
      isRequired: null,
      searchMenuName: '',
      defaultProps: {
        children: 'children',
        label: 'menuClsName'
      }
    };
  },
  updated () {
    if (this.$refs.transfer) {
      this.linkedMenus.map(item => {
        this.$refs.transfer.toggleRowSelection(this.getSelectedItem(item, this.menuList), true);
      });
    }
  },
  methods: {
    async onClickNode (data) {
      this.menuClsId = data.menuClsId || '0';
      const { menuClsId, searchMenuName } = this;
      await this.fetchAllMenuItems({ menuClsId, searMenuName: searchMenuName });
      this.linkedMenus.map(item => {
        this.$refs.transfer.toggleRowSelection(this.getSelectedItem(item, this.menuList), true);
      });
    },
    getSelectedItem (row, list = []) {
      return list.find(item =>
        +row.itemCd === +item.itemCd &&
        row.orderUint === item.orderUint &&
        +row.salePrice === +item.salePrice
      );
    },
    onSelectAll (selection) {
      this.menuList.map(item => {
        if (!this.getSelectedItem(item, this.linkedMenus) || !selection[0]) {
          this.onChangeLinkedMenu(item);
        }
      });
    },
    onBlurSaleQty (event, row) {
      const { value } = event.target;
      row['saleQty'] = isNaN(value) ? 1 : parseInt(value);
    },
    async onClickSearch () {
      const { searchMenuName, menuClsId } = this;
      await this.fetchAllMenuItems({ menuClsId, searMenuName: searchMenuName });
    },
    async onSubmit () {
      await this.onSubmitMenu(this.linkedMenus);
      this.onShowOrHideModal();
    },
    onShowOrHideModal () {
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss">
.garnish-menu-modal {
  width: 65% !important;

  .relation-tree {
    width: 23%;
    height: 475px;
    border: none;
    overflow-y: auto;
    display: inline-block;

    .el-tree-node .is-current {
      > .el-tree-node__content {
        color: white;
        background-color: #428bca;
      }
    }
  }

  .dishes-transfer {
    width: 75%;
    vertical-align: top;
    display: inline-block;

    .transfer-table {
      width: 45%;
      display: inline-block;

      .cell,
      .el-table th > div {
        padding: 0;
      }
    }

    .linked-table {
      width: 50%;
      display: inline-block;

      .cell,
      .el-table th > div {
        padding: 0;
      }

      .el-input-number {
        width: 60px;
        line-height: 50px;
      }
    }

    .search-input {
      width: 300px;
      margin-right: 0;
      font-weight: bold;
    }

    .add-tips {
      display: inline-block;
      height: 36px;
      line-height: 36px;
      font-weight: 700;
      margin-left: 110px;
    }
  }
}
</style>
