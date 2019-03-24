<template>
  <Popup
    size="small"
    title="自主菜品"
    :handleClose="onClose"
    :handleOk="onClose"
    ref="popup">
    <div slot="content" class="update-cook-book-modal">
      <label>菜品数量：</label><span class="menu-count">{{ companyDishMenuList.length }}</span> 个
      <el-table :data="companyDishMenuList" border height="400">
        <el-table-column prop="itemCd" align="center" label="编号" min-width="30%" />
        <el-table-column prop="itemName" align="center" label="菜品" min-width="40%" />
        <el-table-column prop="orderUint" align="center" :formatter="formatEmptyText" label="规格" min-width="15%" />
        <el-table-column prop="salePrice" align="center" :formatter="formatPrice" label="价格" min-width="15%" />
      </el-table>
    </div>
  </Popup>
</template>
<script>
  import { Popup } from 'components';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'DisplayMenuModal',
    props: ['fsShopGUID'],
    components: { Popup },
    data () {
      return {
        isShow: false
      };
    },
    computed: {
      ...mapState({
        companyDishMenuList: state => state.dishLibrary.shopUpdate.companyDishMenuList
      })
    },
    watch: {
      async isShow () {
        if (this.isShow) {
          const { fsShopGUID } = this;
          await this.fetchCompanyDishMenuList({ fsShopGUID });
        }
        this.$refs.popup.isShow = this.isShow;
      }
    },
    methods: {
      ...mapActions([
        'fetchCompanyDishMenuList'
      ]),
      formatPrice (row, column, cellValue) {
        return cellValue || '0';
      },
      onClose () {
        this.isShow = false;
      }
    }
  };
</script>

<style lang="scss">
.update-cook-book-modal {
  .menu-count {
    color: #F36B5F;
  }
}
</style>
