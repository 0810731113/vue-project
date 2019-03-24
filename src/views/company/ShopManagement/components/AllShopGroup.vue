<template>
  <div class="base-modal all-shop-group" :visible.sync="isShow" size="tiny">
    <el-input class="menu-search" v-model="searchData">
      <el-button slot="append" icon="el-icon-search" @click="onClickSearch"></el-button>
    </el-input>
    <el-col :span="12">
      <el-table :data="allShopItems" border ref="multipleTable" class="mw-shop" @select="onChangeSelection">
        <el-table-column align="center" type="selection" width="50px">
        </el-table-column>
        <el-table-column prop="shopName" align="center" label="所有门店">
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="11">
      <el-table :data="selectedItem" border class="mw-selected-shop" empty-text="没有找到匹配的记录">
        <el-table-column prop="shopName" align="center" label="已选门店">
        </el-table-column>
      </el-table>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'allShopGroup',
  props: ['allShopList', 'selectedList', 'onChangeSelectedShop', 'isShow'],
  data () {
    return {
      shopName: '',
      searchData: null,
      originalList: [],
      allShopItems: [],
      selectedItem: []
    };
  },
  watch: {
    allShopList () {
      this.originalList = this.allShopList;
      this.allShopItems = this.allShopList;
    },
    selectedList () {
      this.selectedItem = this.selectedList.slice();
    }
  },
  updated () {
    this.selectedItem.map(row => {
      const item = this.allShopItems.find(item => item.shopGUID === row.shopGUID);
      this.$refs.multipleTable.toggleRowSelection(item, true);
    });
  },
  methods: {
    onClickSearch () {
      const { searchData, originalList } = this;
      this.allShopItems = originalList;
      if (!searchData) return;
      const newList = this.allShopItems.filter(item => {
        if (item.shopName.includes(searchData)) {
          return item;
        }
      });
      this.allShopItems = newList;
    },
    onChangeSelection (selection) {
      this.onChangeSelectedShop(selection);
    }
  }
};
</script>

<style lang="scss">
  .all-shop-group {
    .menu-search {
      width: 50%;
      margin: 0 200px 10px 0;
    }

    .el-table__body-wrapper {
      height: 368px;
    }

    .mw-selected-shop {
      margin-left: 20px;
    }
  }

  .mw-form {
    width: 45%;
  }
</style>
